import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  args: { label: "Ladataan asiakkaita..." },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Skeleton variant="text" label="Ladataan tietoja..." />
      <Skeleton variant="block" />
    </div>
  ),
};

export const Widths: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Skeleton width="sm" label="Ladataan tietoja..." />
      <Skeleton width="md" />
      <Skeleton width="lg" />
      <Skeleton width="full" />
    </div>
  ),
};
