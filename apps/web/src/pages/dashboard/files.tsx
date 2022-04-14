import dynamic from 'next/dynamic';
import Shell from '#layouts/Shell';
import { ReactElement, useState } from 'react';
import { Center, Loader } from '@mantine/core';
import { useFilesQuery } from '#lib/redux/slices/auth.slice';
const FileGrid = dynamic(import('#components/FileGrid'));
const ToolBar = dynamic(import('#components/Toolbar'));
const Navigate = dynamic(import('#components/Navigate'));

const Files = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState('');
  const { isLoading, data: files, isFetching } = useFilesQuery({ page, limit });

  if (isLoading)
    return (
      <Center>
        <Loader size="xl" />
      </Center>
    );

  if (!files) return <Navigate to="/" />;

  return (
    <>
      <ToolBar
        setSearch={setSearch}
        isFetching={isFetching}
        setLimit={setLimit}
        files={files}
      />
      <Center my="2rem" sx={{ flexDirection: 'column', gap: '1rem' }}>
        <FileGrid
          search={search}
          files={files}
          isFetching={isFetching}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
        />
      </Center>
    </>
  );
};

Files.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default Files;
