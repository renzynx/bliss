import ShareXSettings from '#components/SharexSettings';
import Shell from '#layouts/Shell';
import { ReactElement } from 'react';

const Sharex = () => {
  return (
    <>
      <ShareXSettings />
    </>
  );
};

Sharex.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default Sharex;
