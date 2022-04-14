import {
  Header,
  MediaQuery,
  Burger,
  Text,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { Dispatch, FC, SetStateAction } from 'react';

const NavHeader: FC<{
  setOpened: Dispatch<SetStateAction<boolean>>;
  opened: boolean;
}> = ({ setOpened, opened }) => {
  const theme = useMantineTheme();

  return (
    <Header height={70} p="md">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          justifyContent: 'space-between',
          width: '95%',
          marginRight: 'auto',
          marginLeft: 'auto',
        }}
      >
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Link href="/" passHref>
          <Text
            variant="gradient"
            size="xl"
            weight="semibold"
            gradient={
              theme.colorScheme === 'dark'
                ? { from: 'teal', to: 'blue', deg: 60 }
                : { from: 'orange', to: 'red', deg: 45 }
            }
            sx={{ cursor: 'pointer' }}
          >
            Bliss
          </Text>
        </Link>
      </div>
    </Header>
  );
};

export default NavHeader;
