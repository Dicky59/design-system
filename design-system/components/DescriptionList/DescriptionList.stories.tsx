import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "../Badge/Badge";
import { DescriptionItem, DescriptionList } from "./DescriptionList";

const meta = {
  title: "Components/DescriptionList",
  component: DescriptionList,
  args: { children: null },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionItem term="Y-tunnus">1234567-8</DescriptionItem>
      <DescriptionItem term="Yhteyshenkilö">Mikko Virtanen</DescriptionItem>
      <DescriptionItem term="Sähköposti">mikko@pohjoinenkone.example</DescriptionItem>
      <DescriptionItem term="Kaupunki">Oulu</DescriptionItem>
    </DescriptionList>
  ),
};

export const WithBadge: Story = {
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionItem term="Yhteyshenkilö">Mikko Virtanen</DescriptionItem>
      <DescriptionItem term="Tila">
        <Badge tone="danger">Erääntynyt</Badge>
      </DescriptionItem>
    </DescriptionList>
  ),
};
