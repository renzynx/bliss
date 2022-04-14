import Bliss from '#components/Bliss';
import { Navbar as Navigation } from '@mantine/core';
import { FC } from 'react';
import Sections from './Sections';
import User from './User';

const Navbar: FC<{ opened: boolean }> = ({ opened }) => {
  return (
    <Navigation
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Navigation.Section mt="xs">
        <Bliss />
      </Navigation.Section>
      <Navigation.Section grow mt="md">
        <Sections />
      </Navigation.Section>
      <Navigation.Section mt="xs">
        <User />
      </Navigation.Section>
    </Navigation>
  );
};

export default Navbar;
