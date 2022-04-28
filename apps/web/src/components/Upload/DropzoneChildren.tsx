import { getIconColor } from '#lib/functions';
import { MantineTheme, Group, Text } from '@mantine/core';
import { DropzoneStatus } from '@mantine/dropzone';
import ImageUploadIcon from './ImageUploadIcon';

export const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme
) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 220, pointerEvents: 'none' }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />

    <div>
      <Text size="xl" inline>
        Drag images here or click to select files
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Attach as many files as you like, each file should not exceed 50mb
      </Text>
    </div>
  </Group>
);
