import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  card: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    padding: '1rem',
    gap: '10px',
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[5]
    }`,
  },
  imgContainer: {
    height: '100%',
  },
  textContainer: {
    marginBottom: 5,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
}));
