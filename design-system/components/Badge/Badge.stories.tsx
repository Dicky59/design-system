import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Aktiivinen" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge tone="neutral">Luonnos</Badge>
      <Badge tone="success">Maksettu</Badge>
      <Badge tone="warning">Odottaa maksua</Badge>
      <Badge tone="danger">Erääntynyt</Badge>
      <Badge tone="info">Lähetetty</Badge>
    </div>
  ),
};
