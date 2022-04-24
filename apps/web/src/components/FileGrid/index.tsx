import { FileProps } from '#lib/types';
import { Pagination, SimpleGrid, Loader, Center, Title } from '@mantine/core';
import dynamic from 'next/dynamic';
import { FC } from 'react';
const FileView = dynamic(import('#components/FileView'));

const FileGrid: FC<FileProps> = ({
  files,
  isFetching,
  isLoading,
  page,
  setPage,
  search,
}) => {
  if (isLoading)
    return (
      <Center mt="xl">
        <Loader size="xl" />
      </Center>
    );

  return (
    <>
      <Pagination
        total={files.total_pages}
        page={page}
        onChange={(e) => setPage(e)}
        withEdges
      />
      {!files.data.length ? (
        <Center sx={{ width: 'full' }}>
          <Title order={4} align="center">
            No files in this page.
          </Title>
        </Center>
      ) : files.data.length ? (
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
            { maxWidth: 'md', cols: 1 },
            { maxWidth: 'lg', cols: 3 },
          ]}
          sx={{ placeItems: 'center' }}
        >
          {isFetching ? (
            <Loader size="xl" />
          ) : (
            files.data
              .filter((file) =>
                file.originalName.toLowerCase().includes(search)
              )
              .map((file) => <FileView key={file.id} file={file} />)
          )}
        </SimpleGrid>
      ) : (
        <Center sx={{ width: 'full' }}>
          <Title order={4} align="center">
            You haven&apos;t upload any files yet.
          </Title>
        </Center>
      )}
      <Pagination
        total={files.total_pages}
        page={page}
        onChange={(e) => setPage(e)}
        withEdges
      />
    </>
  );
};

export default FileGrid;
