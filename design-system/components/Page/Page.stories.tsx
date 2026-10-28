import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../Button/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../Card/Card";
import { PageHeader } from "../PageHeader/PageHeader";
import { Page } from "./Page";

const meta = {
  title: "Components/Page",
  component: Page,
  args: { children: null },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Page {...args}>
      <PageHeader title="Asiakkaat">
        <Button>Lisää asiakas</Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle level={2}>Suodattimet</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sivun sisältö tulee tähän.</p>
        </CardContent>
      </Card>
    </Page>
  ),
};
