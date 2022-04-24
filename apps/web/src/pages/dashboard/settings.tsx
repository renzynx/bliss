import dynamic from 'next/dynamic';
import Shell from '#layouts/Shell';
import { useAuth } from '#lib/hooks/useAuth';
import Loading from '#components/Loading';
const UpdateSettings = dynamic(import('#components/UpdateSettings'));

const Settings = () => {
  const { data } = useAuth();

  if (!data) return <Loading />;

  return (
    <>
      <Shell>
        <UpdateSettings />
      </Shell>
    </>
  );
};

export default Settings;
