import dynamic from 'next/dynamic';
import Shell from '#layouts/Shell';
import { ReactElement } from 'react';
const UpdateSettings = dynamic(import('#components/UpdateSettings'));

const Settings = () => {
  return (
    <>
      <UpdateSettings />
    </>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default Settings;
