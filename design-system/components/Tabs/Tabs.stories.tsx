import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: { defaultValue: "tiedot", children: null },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList label="Asiakkaan tiedot">
        <TabsTrigger value="tiedot">Perustiedot</TabsTrigger>
        <TabsTrigger value="laskut">Laskut</TabsTrigger>
        <TabsTrigger value="yhteyshenkilot">Yhteyshenkilöt</TabsTrigger>
      </TabsList>
      <TabsContent value="tiedot">
        <p>Pohjoinen Kone Oy, Y-tunnus 1234567-8.</p>
      </TabsContent>
      <TabsContent value="laskut">
        <p>Asiakkaalla on kolme avointa laskua.</p>
      </TabsContent>
      <TabsContent value="yhteyshenkilot">
        <p>Aino Virtanen, talouspäällikkö.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList label="Asiakkaan tiedot">
        <TabsTrigger value="tiedot">Perustiedot</TabsTrigger>
        <TabsTrigger value="laskut">Laskut</TabsTrigger>
        <TabsTrigger value="historia" disabled>
          Historia
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tiedot">
        <p>Pohjoinen Kone Oy, Y-tunnus 1234567-8.</p>
      </TabsContent>
      <TabsContent value="laskut">
        <p>Asiakkaalla on kolme avointa laskua.</p>
      </TabsContent>
    </Tabs>
  ),
};
