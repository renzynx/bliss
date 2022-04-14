import Shell from '#layouts/Shell';
import { ReactElement } from 'react';
import { useStatsQuery } from '#lib/redux/slices/auth.slice';
import { Center, Loader } from '@mantine/core';
import { useAppSelector } from '#lib/redux/hooks';
import dynamic from 'next/dynamic';
const NotFound = dynamic(import('#components/NotFound'));

const Statistics = () => {
  const { user } = useAppSelector((state) => state.user);
  const { data: os, isLoading } = useStatsQuery();

  if (isLoading || !user)
    return (
      <Center>
        <Loader size="xl" />
      </Center>
    );

  if (!user.admin) return <NotFound />;

  return (
    <div>
      <h2>General</h2>
      <p>
        <strong>Total User:</strong> {os.totalUser}
      </p>
      <p>
        <strong>Total Files:</strong> {os.totalFile}
      </p>
      <p>
        <strong>Storage Used:</strong> {os.totalSize}
      </p>
      <h2>System</h2>
      <p>
        <strong>Platform:</strong> {os.platform}
      </p>
      <p>
        <strong>Architecture:</strong> {os.arch}
      </p>
      <p>
        <strong>Release:</strong> {os.release}
      </p>
      <p>
        <strong>Type:</strong> {os.type}
      </p>
      <p>
        <strong>Hostname:</strong> {os.hostname}
      </p>
      <p>
        <strong>Uptime:</strong> {os.uptime}
      </p>
      <p>
        <strong>Total memory:</strong> {os.total}
      </p>
      <p>
        <strong>Free memory:</strong> {os.free}
      </p>
      <p>
        <strong>Used memory:</strong> {os.used}
      </p>
      <p>
        <strong>CPU count:</strong> {os.cpus.length}
      </p>
      <p>
        <strong>CPU model:</strong> {os.cpus[0].model}
      </p>
      <p>
        <strong>CPU speed:</strong> {os.cpus[0].speed}
      </p>
    </div>
  );
};

Statistics.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default Statistics;
