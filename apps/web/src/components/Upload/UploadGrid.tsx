import { MantineTheme, SimpleGrid } from '@mantine/core';
import { FC, memo } from 'react';
import dynamic from 'next/dynamic';
import { FileWithProgress } from '#lib/types';
const UploadCard = memo(dynamic(import('./UploadCard')));

interface UploadGridProps {
  files: FileWithProgress[];
  theme: MantineTheme;
}

const UploadGrid: FC<UploadGridProps> = ({ files, theme }) => {
  return (
    <SimpleGrid
      cols={3}
      my="xl"
      sx={{ placeItems: 'center' }}
      breakpoints={[
        { maxWidth: 'sm', cols: 1 },
        { maxWidth: 'md', cols: 1 },
        { maxWidth: 'lg', cols: 3 },
      ]}
    >
      {files.map((file, index) => (
        <UploadCard key={index} file={file} theme={theme} />
      ))}
    </SimpleGrid>
  );
};

export default UploadGrid;
