import Loading from '#components/Loading';
import ShareXSettings from '#components/SharexSettings';
import Shell from '#layouts/Shell';
import { useAuth } from '#lib/hooks/useAuth';

const Sharex = () => {
  const { data } = useAuth();

  if (!data) return <Loading />;

  return (
    <>
      <Shell>
        <ShareXSettings />
      </Shell>
    </>
  );
};

export default Sharex;
