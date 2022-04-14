import { AppShell, useMantineTheme } from '@mantine/core';
import { FC, useState } from 'react';
import dynamic from 'next/dynamic';
const Navbar = dynamic(import('#components/Navbar'));
const NavHeader = dynamic(import('#components/Navbar/Header'));

const Shell: FC = ({ children }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        fixed
        navbar={<Navbar opened={opened} />}
        header={<NavHeader setOpened={setOpened} opened={opened} />}
      >
        {children}
      </AppShell>
    </>
  );
};

export default Shell;
