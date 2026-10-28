import type { Metadata } from "next";
import { CustomersView } from "./CustomersView";

export const metadata: Metadata = {
  title: "Asiakkaat",
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { state } = await searchParams;
  return <CustomersView forceError={state === "error"} />;
}
