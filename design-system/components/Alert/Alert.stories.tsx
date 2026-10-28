import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Alert } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: { children: "Asiakkaan tiedot on tallennettu." },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert tone="info" title="Huoltokatko">
        Laskutus on pois käytöstä lauantaina klo 2-4.
      </Alert>
      <Alert tone="success" title="Lasku lähetetty">
        Lasku 2026-0142 lähetettiin verkkolaskuna.
      </Alert>
      <Alert tone="warning" title="Lasku erääntyy pian">
        Lasku 2026-0138 erääntyy huomenna.
      </Alert>
      <Alert tone="danger" title="Tallennus epäonnistui">
        Tarkista Y-tunnus ja yritä uudelleen.
      </Alert>
    </div>
  ),
};

function DismissibleAlert() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Alert tone="info" onDismiss={() => setVisible(false)}>
      Voit tuoda asiakkaat myös CSV-tiedostosta.
    </Alert>
  ) : (
    <p>Ilmoitus suljettu.</p>
  );
}

export const Dismissible: Story = { render: () => <DismissibleAlert /> };
