import { ReactElement } from 'react';
import Shell from '#layouts/Shell';
import Upload from '#components/Upload';

const Dashboard = () => {
  return (
    <>
      <Upload />
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default Dashboard;
