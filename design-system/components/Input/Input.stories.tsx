import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  args: { label: "Yrityksen nimi" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { label: "Y-tunnus", hint: "Muoto 1234567-8", placeholder: "1234567-8" },
};

export const Required: Story = {
  args: { label: "Sähköposti", type: "email", required: true },
};

export const WithError: Story = {
  args: {
    label: "Y-tunnus",
    defaultValue: "12345",
    error: "Y-tunnuksen muoto on virheellinen. Käytä muotoa 1234567-8.",
  },
};

export const Disabled: Story = {
  args: { label: "Asiakasnumero", defaultValue: "A-10234", disabled: true },
};

export const Types: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Input label="Sähköposti" type="email" autoComplete="email" />
      <Input label="Puhelinnumero" type="tel" autoComplete="tel" />
      <Input label="Hae asiakkaita" type="search" />
      <Input label="Maksuehto (päivää)" type="number" hint="Esimerkiksi 14 tai 30" />
    </div>
  ),
};
