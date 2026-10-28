import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Select } from "../Select/Select";
import { Stack } from "./Stack";

const meta = {
  title: "Components/Stack",
  component: Stack,
  args: { children: null },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = {
  render: (args) => (
    <Stack {...args} gap="3">
      <Input label="Yrityksen nimi" required />
      <Input label="Y-tunnus" hint="Muodossa 1234567-8" required />
      <Input label="Kaupunki" />
    </Stack>
  ),
};

export const Row: Story = {
  render: (args) => (
    <Stack {...args} direction="row" gap="2" align="center">
      <Button variant="secondary">Peruuta</Button>
      <Button>Tallenna</Button>
    </Stack>
  ),
};

export const Gaps: Story = {
  render: () => (
    <Stack gap="6">
      {(["1", "2", "3", "4", "6", "8"] as const).map((gap) => (
        <Stack key={gap} direction="row" gap={gap}>
          <Button size="sm" variant="secondary">
            Väli {gap}
          </Button>
          <Button size="sm" variant="secondary">
            Väli {gap}
          </Button>
        </Stack>
      ))}
    </Stack>
  ),
};

export const SwitchAtMd: Story = {
  render: (args) => (
    <Stack {...args} switchAt="md" fill>
      <Input label="Hae asiakasta" hint="Nimi tai Y-tunnus" type="search" />
      <Select
        label="Tila"
        defaultValue="all"
        options={[
          { value: "all", label: "Kaikki" },
          { value: "active", label: "Aktiivinen" },
        ]}
      />
    </Stack>
  ),
};
