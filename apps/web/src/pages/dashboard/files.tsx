import dynamic from 'next/dynamic';
import Shell from '#layouts/Shell';
import { useState } from 'react';
import { Center } from '@mantine/core';
import { useFilesQuery } from '#lib/redux/slices/auth.slice';
import Loading from '#components/Loading';
import { useAuth } from '#lib/hooks/useAuth';
const FileGrid = dynamic(import('#components/FileGrid'));
const ToolBar = dynamic(import('#components/Toolbar'));
const Navigate = dynamic(import('#components/Navigate'));

const Files = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState('');
  useAuth();
  const { isLoading, data: files, isFetching } = useFilesQuery({ page, limit });

  if (isLoading) return <Loading />;

  if (!files) return <Navigate to="/" />;

  return (
    <>
      <Shell>
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
      </Shell>
    </>
  );
};

export default Files;
