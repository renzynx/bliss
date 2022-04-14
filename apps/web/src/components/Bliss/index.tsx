import { Group, ActionIcon, useMantineColorScheme, Box } from '@mantine/core';
import { Sun, MoonStars, Folder } from 'tabler-icons-react';
import useStyles from './Bliss.styles';

const Bliss = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes } = useStyles();

  return (
    <Box className={classes.box}>
      <Group position="apart">
        <Folder />
        <ActionIcon
          variant="light"
          onClick={() => toggleColorScheme()}
          size={35}
        >
          {colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
        </ActionIcon>
      </Group>
    </Box>
  );
};

export default Bliss;
