import Shell from '#layouts/Shell';
import { useStatsQuery } from '#lib/redux/slices/auth.slice';
import { useAuth } from '#lib/hooks/useAuth';
import Loading from '#components/Loading';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Statistics = () => {
  const router = useRouter();
  const { data, isLoading: userLoading } = useAuth();

  const { data: os, isLoading } = useStatsQuery();

  useEffect(() => {
    if (!isLoading && !userLoading && data && !data.user.admin) {
      router.replace('/dashboard');
    }
  }, [data, isLoading, router, userLoading]);

  if (isLoading || userLoading || !data || !os || !data.user.admin)
    return <Loading />;

  return (
    <Shell>
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
    </Shell>
  );
};

export default Statistics;
