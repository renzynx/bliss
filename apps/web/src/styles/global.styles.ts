import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  btn: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    ':hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },
    color:
      theme.colorScheme === 'dark' ? theme.colors.yellow[5] : theme.colors.blue,
    boxShadow: theme.shadows.sm,
  },
  text: {
    color:
      theme.colorScheme === 'dark' ? theme.colors.yellow[5] : theme.colors.blue,
  },
}));
