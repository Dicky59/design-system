import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./Select";

const paymentTerms = [
  { value: "7", label: "7 päivää netto" },
  { value: "14", label: "14 päivää netto" },
  { value: "30", label: "30 päivää netto" },
  { value: "60", label: "60 päivää netto", disabled: true },
];

const meta = {
  title: "Components/Select",
  component: Select,
  args: { label: "Maksuehto", options: paymentTerms },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "14", hint: "Oletus on 14 päivää." },
};

export const Required: Story = {
  args: { required: true, placeholder: "Valitse maksuehto" },
};

export const WithError: Story = {
  args: { required: true, error: "Valitse maksuehto ennen tallennusta." },
};

export const Disabled: Story = {
  args: { defaultValue: "30", disabled: true },
};

/** Opens the list so the accessibility check also covers the options. */
export const Open: Story = {
  args: { defaultValue: "14" },
  parameters: {
    // While the list is open Radix marks the page root aria-hidden, and the (inert-in-practice)
    // trigger sits inside it. Focus is trapped in the list, so users cannot reach the trigger.
    a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Maksuehto" }));
  },
};
