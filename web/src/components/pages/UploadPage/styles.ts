import { createStyles } from '@mantine/core';

export const uploadStyles = createStyles((theme) => ({
	wrapper: {
		position: 'relative',
		marginBottom: 30,
	},

	dropzone: {
		borderWidth: 1,
		paddingBottom: 50,
		height: 300,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	icon: {
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[3]
				: theme.colors.gray[4],
	},

	control: {
		position: 'absolute',
		width: 250,
		left: 'calc(50% - 125px)',
		bottom: -20,
	},
}));
