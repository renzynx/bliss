import { createStyles } from '@mantine/core';

export const navbarStyles = createStyles((t) => ({
	'navbar-container': {
		borderBottom: '1px solid #2C2E33',
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		width: '100%',
		backgroundColor: t.colors.dark[7],
	},
	navbar: {
		maxWidth: '90%',
		height: 35,
	},
	'app-name': {
		letterSpacing: '2px',
		textTransform: 'uppercase',
		cursor: 'pointer',
	},
}));
