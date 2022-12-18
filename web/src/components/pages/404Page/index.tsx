import { Title, Text, Button, Container, Group } from '@mantine/core';
import { notFoundStyles } from './styles';

export function NotFoundTitle() {
	const { classes } = notFoundStyles();

	return (
		<Container className={classes.root}>
			<div className={classes.label}>404</div>
			<Title className={classes.title}>You have found a secret place.</Title>
			<Text
				color="dimmed"
				size="lg"
				align="center"
				className={classes.description}
			>
				Unfortunately, this is only a 404 page. You may have mistyped the
				address, or the page has been moved to another URL.
			</Text>
			<Group position="center">
				<Button
					variant="subtle"
					size="md"
					onClick={() => (window.location.href = '/')}
				>
					Take me back to home page
				</Button>
			</Group>
		</Container>
	);
}
