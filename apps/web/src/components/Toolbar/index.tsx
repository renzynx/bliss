import FileComplete from '#components/FileComplete';
import { SimpleGrid, Select } from '@mantine/core';
import { File } from '@prisma/client';
import { FC } from 'react';
import { PaginationPayload } from '@bliss/shared-types';

interface ToolBarProps {
  files: PaginationPayload<File>;
  isFetching: boolean;
  setLimit: (n: number) => void;
  setSearch: (s: string) => void;
}

const ToolBar: FC<ToolBarProps> = ({
  isFetching,
  files,
  setLimit,
  setSearch,
}) => {
  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        {
          maxWidth: 'sm',
          cols: 1,
        },
        {
          maxWidth: 'md',
          cols: 2,
        },
        {
          maxWidth: 'lg',
          cols: 2,
        },
      ]}
    >
      <FileComplete
        setSearch={setSearch}
        files={files.data}
        loading={isFetching}
      />
      <Select
        sx={{
          width: '100%',
        }}
        defaultValue="15"
        size="md"
        label="Result per page"
        data={['15', '30', '60', '120']}
        onChange={(e) => {
          setLimit(parseInt(e));
        }}
      />
    </SimpleGrid>
  );
};

export default ToolBar;
