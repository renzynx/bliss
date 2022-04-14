import { MantineTheme, SimpleGrid } from '@mantine/core';
import { FC, memo } from 'react';
import dynamic from 'next/dynamic';
import { File as PrismaFile } from '@prisma/client';
const UploadCard = memo(dynamic(import('./UploadCard')));

interface UploadGridProps {
  files: File[];
  theme: MantineTheme;
  progress: number[];
  success: PrismaFile[];
}

const UploadGrid: FC<UploadGridProps> = ({
  files,
  progress,
  success,
  theme,
}) => {
  return (
    <SimpleGrid
      cols={3}
      my="xl"
      sx={{ placeItems: 'center' }}
      breakpoints={[
        { maxWidth: 'sm', cols: 1 },
        { maxWidth: 'md', cols: 2 },
        { maxWidth: 'lg', cols: 3 },
      ]}
    >
      {files.map((file, index) => (
        <UploadCard
          key={index}
          file={file}
          index={index}
          progress={progress}
          success={success}
          theme={theme}
        />
      ))}
    </SimpleGrid>
  );
};

export default UploadGrid;
