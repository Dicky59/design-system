import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "./Dialog";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  args: { children: null },
  parameters: {
    // While a modal is open Radix marks the page root aria-hidden, and the trigger sits inside it.
    // Focus is trapped in the dialog, so users cannot reach the trigger.
    a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmation: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger>
        <Button variant="danger">Poista asiakas</Button>
      </DialogTrigger>
      <DialogContent
        size="sm"
        title="Poistetaanko asiakas?"
        description="Asiakas Pohjoinen Kone Oy ja sen laskuhistoria poistetaan pysyvästi."
      >
        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">Peruuta</Button>
          </DialogClose>
          <Button variant="danger">Poista asiakas</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Form: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger>
        <Button>Lisää asiakas</Button>
      </DialogTrigger>
      <DialogContent title="Lisää asiakas" description="Täytä asiakkaan perustiedot. Pakolliset kentät on merkitty tähdellä.">
        <Input label="Yrityksen nimi" required />
        <Input label="Y-tunnus" hint="Muoto 1234567-8" required />
        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">Peruuta</Button>
          </DialogClose>
          <Button>Tallenna asiakas</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Starts open so the accessibility check covers the dialog itself. */
export const Open: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Dialog {...args}>
      <DialogContent
        size="sm"
        title="Lähetetäänkö lasku?"
        description="Lasku lähetetään asiakkaalle verkkolaskuna. Lähetystä ei voi perua."
      >
        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">Peruuta</Button>
          </DialogClose>
          <Button>Lähetä lasku</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
