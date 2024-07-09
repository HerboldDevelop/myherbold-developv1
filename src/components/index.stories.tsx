import type { Meta, StoryObj } from '@storybook/react';

import { test } from './index';

const meta = {
  component: test,
} satisfies Meta<typeof test>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};