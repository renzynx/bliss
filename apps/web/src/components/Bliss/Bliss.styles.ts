import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  box: {
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    paddingBottom: theme.spacing.lg,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },
}));
