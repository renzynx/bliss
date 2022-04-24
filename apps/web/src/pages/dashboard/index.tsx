import Shell from '#layouts/Shell';
import Upload from '#components/Upload';
import Loading from '#components/Loading';
import { useAuth } from '#lib/hooks/useAuth';

const Dashboard = () => {
  const { data } = useAuth();

  if (!data) return <Loading />;

  return (
    <>
      <Shell>
        <Upload />
      </Shell>
    </>
  );
};

export default Dashboard;
