// Generates design-system/manifest.json: a machine-readable index of every component.
// Everything is derived from the component source with the TypeScript compiler API, so the
// manifest cannot drift from the real prop types.
//
// Conventions read from each design-system/components/<Name>/<Name>.tsx:
//   - Every exported component `Foo` has an exported `FooProps` type.
//   - JSDoc on the component = description. JSDoc on a prop = prop description.
//   - `@default x` on a prop documents its default.
//   - `@a11y <text>` on a prop marks it as an accessibility prop (if the prop is required in
//     the type, it is listed under a11y.requiredProps). `@a11y <text>` on a component adds a
//     general accessibility note.
//   - Props named `variant`/`tone` feed `variants`; the prop named `size` feeds `sizes`.
//
// Usage: node build-manifest.mjs [--check]   (--check fails if manifest.json is stale)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const componentsDir = path.join(here, "components");
const outPath = path.join(here, "manifest.json");
const rel = (p) => path.relative(root, p).split(path.sep).join("/");

const fail = (message) => {
  console.error(`manifest: ${message}`);
  process.exit(1);
};

const componentNames = fs.existsSync(componentsDir)
  ? fs
      .readdirSync(componentsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort()
  : [];

const sourceFiles = componentNames.map((name) => path.join(componentsDir, name, `${name}.tsx`));
for (const [i, file] of sourceFiles.entries()) {
  const dir = path.dirname(file);
  const name = componentNames[i];
  for (const required of [`${name}.tsx`, `${name}.stories.tsx`, `${name}.md`]) {
    if (!fs.existsSync(path.join(dir, required))) fail(`${rel(dir)} is missing ${required}`);
  }
}

const configFile = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, root);
const program = ts.createProgram(sourceFiles, { ...parsed.options, noEmit: true });
const checker = program.getTypeChecker();

const tagText = (tag) => ts.displayPartsToString(tag.text ?? []).trim();
const tagsNamed = (symbol, name) => symbol.getJsDocTags(checker).filter((t) => t.name === name);
const doc = (symbol) => ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
const flatten = (text) => text.replace(/\s+/g, " ");

const typeToString = (type, location) =>
  checker.typeToString(type, location, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);

// String-literal members of a union (ignores `undefined`), or null if the type is not a literal union.
function literalValues(type) {
  const members = type.isUnion() ? type.types : [type];
  const literals = members.filter((m) => m.isStringLiteral()).map((m) => m.value);
  return literals.length > 0 && literals.length === members.filter((m) => !(m.flags & ts.TypeFlags.Undefined)).length
    ? literals
    : null;
}

function describeExport(sourceFile, exportSymbol) {
  const name = exportSymbol.getName();
  const propsSymbol = checker
    .getExportsOfModule(checker.getSymbolAtLocation(sourceFile))
    .find((s) => s.getName() === `${name}Props`);
  if (!propsSymbol) fail(`${rel(sourceFile.fileName)} exports ${name} without an exported ${name}Props type`);

  const propsType = checker.getDeclaredTypeOfSymbol(propsSymbol);
  const props = [];
  const a11yRequiredProps = [];
  let acceptsNativeAttributes = false;
  const variants = {};
  let sizes;

  for (const prop of checker.getPropertiesOfType(propsType).sort((a, b) => a.getName().localeCompare(b.getName()))) {
    const declaration = prop.declarations?.[0];
    if (declaration?.getSourceFile().fileName.includes("node_modules")) {
      acceptsNativeAttributes = true;
      continue;
    }
    const propName = prop.getName();
    const type = checker.getTypeOfSymbolAtLocation(prop, declaration);
    const required = !(prop.flags & ts.SymbolFlags.Optional);
    const values = literalValues(type);
    const typeText = values ? values.map((v) => JSON.stringify(v)).join(" | ") : typeToString(type, declaration);
    const entry = { name: propName, type: typeText.replace(/ | undefined$/, ""), required };
    const description = flatten(doc(prop));
    if (description) entry.description = description;
    const def = tagsNamed(prop, "default")[0];
    if (def) entry.default = tagText(def);
    const isA11y = tagsNamed(prop, "a11y").length > 0;
    if (isA11y) {
      entry.a11y = true;
      if (required) a11yRequiredProps.push(propName);
    }
    props.push(entry);

    if (values && (propName === "variant" || propName === "tone")) variants[propName] = values;
    if (values && propName === "size") sizes = values;
  }

  const result = { name, description: flatten(doc(exportSymbol)) };
  if (!result.description) fail(`${name} has no JSDoc description`);
  Object.assign(result, {
    props,
    ...(Object.keys(variants).length > 0 && { variants }),
    ...(sizes && { sizes }),
    a11y: {
      requiredProps: a11yRequiredProps,
      notes: tagsNamed(exportSymbol, "a11y").map((t) => flatten(tagText(t))),
    },
    acceptsNativeAttributes,
  });
  return result;
}

const components = componentNames.map((folder, i) => {
  const sourceFile = program.getSourceFile(sourceFiles[i]);
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) fail(`${rel(sourceFiles[i])} has no exports`);

  const exportedComponents = checker
    .getExportsOfModule(moduleSymbol)
    .filter((s) => /^[A-Z]/.test(s.getName()) && !s.getName().endsWith("Props") && s.flags & (ts.SymbolFlags.Variable | ts.SymbolFlags.Function))
    .map((s) => describeExport(sourceFile, s))
    .sort((a, b) => a.name.localeCompare(b.name));

  const primary = exportedComponents.find((c) => c.name === folder);
  if (!primary) fail(`${rel(sourceFiles[i])} must export a component named ${folder}`);
  const { name, description, ...primaryDetails } = primary;

  return {
    name,
    description,
    guide: rel(path.join(componentsDir, folder, `${folder}.md`)),
    source: rel(sourceFiles[i]),
    story: rel(path.join(componentsDir, folder, `${folder}.stories.tsx`)),
    ...primaryDetails,
    // Subcomponents of compound components (e.g. CardHeader), if any.
    parts: exportedComponents.filter((c) => c.name !== folder),
  };
});

const manifest = {
  $description:
    "GENERATED by design-system/build-manifest.mjs from component source. Do not edit. Read the guide of a component before using it.",
  components,
};
const json = `${JSON.stringify(manifest, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8").replace(/\r\n/g, "\n") : "";
  if (current !== json) fail("manifest.json is stale. Run `npm run manifest:build`.");
  console.log("manifest.json is up to date.");
} else {
  fs.writeFileSync(outPath, json);
  console.log(`Wrote ${rel(outPath)} (${components.length} components)`);
}
