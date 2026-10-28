import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconX } from "../../lib/icons";
import { Button, IconButton } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Tallenna asiakas" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Lähetä lasku</Button>
      <Button variant="secondary">Peruuta</Button>
      <Button variant="ghost">Näytä lisää</Button>
      <Button variant="danger">Poista asiakas</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Pieni</Button>
      <Button size="md">Normaali</Button>
      <Button size="lg">Suuri</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: "Tallennetaan" },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Tallenna</Button>
      <Button variant="secondary" disabled>
        Peruuta
      </Button>
      <Button variant="danger" disabled>
        Poista
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton aria-label="Sulje paneeli" icon={<IconX />} variant="secondary" size="sm" />
      <IconButton aria-label="Sulje paneeli" icon={<IconX />} variant="secondary" />
      <IconButton aria-label="Sulje paneeli" icon={<IconX />} variant="secondary" size="lg" />
    </div>
  ),
};
