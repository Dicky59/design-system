import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { useState } from "react";
import { Badge } from "../Badge/Badge";
import { Card, CardContent } from "../Card/Card";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "./Table";

const customers = [
  { id: "A-1001", name: "Pohjoinen Kone Oy", city: "Oulu", balance: 1250.5, status: "Aktiivinen" },
  { id: "A-1002", name: "Kaakon Kala Oy", city: "Kotka", balance: 0, status: "Aktiivinen" },
  { id: "A-1003", name: "Länsi-Suomen Rakennus Oy", city: "Pori", balance: 8400, status: "Erääntynyt" },
];

const euro = new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR" });

const meta = {
  title: "Components/Table",
  component: Table,
  args: { caption: "Asiakkaat", children: null },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", { name: "Asiakkaat, vieritettävä" });
    await expect(region).toHaveAttribute("tabindex", "0");
  },
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Asiakas</TableHead>
          <TableHead>Kaupunki</TableHead>
          <TableHead>Tila</TableHead>
          <TableHead numeric>Avoin saldo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((c) => (
          <TableRow key={c.id}>
            <TableCell rowHeader>{c.name}</TableCell>
            <TableCell>{c.city}</TableCell>
            <TableCell>
              <Badge tone={c.status === "Erääntynyt" ? "danger" : "success"}>{c.status}</Badge>
            </TableCell>
            <TableCell numeric>{euro.format(c.balance)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

function SortableTable() {
  const [direction, setDirection] = useState<"ascending" | "descending">("ascending");
  const rows = [...customers].sort((a, b) =>
    direction === "ascending" ? a.name.localeCompare(b.name, "fi") : b.name.localeCompare(a.name, "fi"),
  );
  return (
    <Table caption="Asiakkaat" captionHidden>
      <TableHeader>
        <TableRow>
          <TableHead sortDirection={direction} onSort={() => setDirection(direction === "ascending" ? "descending" : "ascending")}>
            Asiakas
          </TableHead>
          <TableHead>Kaupunki</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((c) => (
          <TableRow key={c.id}>
            <TableCell rowHeader>{c.name}</TableCell>
            <TableCell>{c.city}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const InsideCard: Story = {
  render: (args) => (
    <Card>
      <CardContent>
        <Table {...args} variant="flush">
          <TableHeader>
            <TableRow>
              <TableHead>Asiakas</TableHead>
              <TableHead>Kaupunki</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell rowHeader>{c.name}</TableCell>
                <TableCell>{c.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  ),
};

/** Narrow container: the table scrolls, with an edge shadow on the right that fades at the end of the scroll. */
export const ScrollsHorizontally: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Asiakas</TableHead>
          <TableHead>Yhteyshenkilö</TableHead>
          <TableHead>Kaupunki</TableHead>
          <TableHead>Tila</TableHead>
          <TableHead numeric>Avoimet laskut</TableHead>
          <TableHead>Viimeisin lasku</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((c) => (
          <TableRow key={c.id}>
            <TableCell rowHeader>{c.name}</TableCell>
            <TableCell>Mikko Virtanen</TableCell>
            <TableCell>{c.city}</TableCell>
            <TableCell>{c.status}</TableCell>
            <TableCell numeric>{euro.format(c.balance)}</TableCell>
            <TableCell>28.10.2026</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Sortable: Story = { render: () => <SortableTable /> };

export const Empty: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Asiakas</TableHead>
          <TableHead>Kaupunki</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty colSpan={2}>Ei asiakkaita. Lisää ensimmäinen asiakas.</TableEmpty>
      </TableBody>
    </Table>
  ),
};
