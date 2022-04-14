import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';

const Navigate: FC<{ to: string }> = ({ to, children }) => {
  const router = useRouter();

  useEffect(() => {
    void router.replace(to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default Navigate;
