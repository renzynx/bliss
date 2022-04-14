import { useMantineColorScheme, Group, ActionIcon } from '@mantine/core';
import { Sun, Moon } from 'tabler-icons-react';
import useStyles from './ToggleTheme.styles';

const ToggleTheme = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes } = useStyles();

  return (
    <Group position="center" mt="xl">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="xl"
        className={classes.actionButton}
      >
        {colorScheme === 'dark' ? (
          <Sun width={20} height={20} />
        ) : (
          <Moon width={20} height={20} />
        )}
      </ActionIcon>
    </Group>
  );
};

export default ToggleTheme;
