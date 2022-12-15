import { createStyles } from '@mantine/core';

export const profileStyles = createStyles((t) => ({
	container: {
		height: 200,
		background: t.colors.dark[6],
		position: 'relative',
		'@media (max-width: 376px)': {
			height: 100,
		},
		'@media (max-width: 768px)': {
			height: 150,
		},
	},
	'useless-box': {
		height: '100px',
		width: 'calc(100% - 40px)',
		position: 'absolute',
		bottom: '-80px',
		left: '20px',
	},
	'avatar-container': {
		width: '100%',
		'@media (max-width: 768px)': {
			gap: '30px',
		},
	},
	'verify-button': {
		padding: '2px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '5px',
		color: t.colors.gray[6],
		':hover': { color: t.colors.gray[4] },
		'@media (max-width: 480px)': {
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
}));
