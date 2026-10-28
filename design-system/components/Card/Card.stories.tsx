import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle level={2}>Laskutustiedot</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Laskut lähetetään verkkolaskuna. Maksuehto on 14 päivää netto.</p>
      </CardContent>
    </Card>
  ),
};

export const WithBadgeAndActions: Story = {
  args: { children: null },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle level={2}>Pohjoinen Kone Oy</CardTitle>
        <Badge tone="success">Aktiivinen</Badge>
      </CardHeader>
      <CardContent>
        <p>Y-tunnus 1234567-8. Yhteyshenkilö Aino Virtanen.</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary">Muokkaa</Button>
        <Button>Luo lasku</Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  args: { children: null },
  render: () => (
    <Card>
      <CardContent>
        <p>Ei otsikkoa tai toimintoja.</p>
      </CardContent>
    </Card>
  ),
};
