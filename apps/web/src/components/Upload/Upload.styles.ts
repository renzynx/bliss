import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  card: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[3],
    padding: '1rem',
    borderRadius: '5px',
    gap: '5px',
  },
}));
