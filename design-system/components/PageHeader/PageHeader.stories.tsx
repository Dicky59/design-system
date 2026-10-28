import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../Button/Button";
import { PageHeader } from "./PageHeader";

const meta = {
  title: "Components/PageHeader",
  component: PageHeader,
  args: { title: "Asiakkaat" },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {};

export const WithAction: Story = {
  render: (args) => (
    <PageHeader {...args}>
      <Button>Lisää asiakas</Button>
    </PageHeader>
  ),
};
