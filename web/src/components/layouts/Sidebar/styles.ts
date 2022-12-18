import { createStyles } from '@mantine/core';

export const sidebarStyles = createStyles((theme) => ({
	nav_container: {
		'@media (max-width: 768px)': {
			display: 'none',
		},
		'@media (max-width: 300px)': {
			display: 'none',
		},
	},
	link: {
		width: '90%',
		margin: '0 auto',
		padding: '0.5rem',
		display: 'flex',
		alignItems: 'center',
		borderRadius: '0.5rem',
		gap: theme.spacing.sm,
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[0]
				: theme.colors.gray[7],

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.colors.dark[5]
					: theme.colors.gray[0],
		},
	},

	active: {
		'&, &:hover': {
			borderLeft: '3px solid #8b5cf6',
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.colors.dark[5]
					: theme.colors.gray[0],
		},
	},
}));
