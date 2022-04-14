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
    width: '10rem',
    height: '3rem',
    textTransform: 'uppercase',
    transitionDuration: '0.1s',
    transitionProperty: 'background-color, color',
    transitionTimingFunction: 'ease-in-out',
    boxShadow: theme.shadows.lg,
  },
  btnContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'center',
    marginTop: '50px',
    marginBottom: '50px',
    gap: '10px',
  },
}));
