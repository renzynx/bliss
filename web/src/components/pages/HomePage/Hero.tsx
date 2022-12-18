import { Container, Flex, Group, Stack, Text, Title } from '@mantine/core';

export default function Hero() {
	return (
		<Container mt={100} size="xl">
			<Stack spacing={20}>
				<Title align="center">Features</Title>
				<Group align="center" position="center">
					<Flex align="start" p="md" sx={{ gap: '10px' }}>
						<Text>Icon Here</Text>
						<Stack spacing={1}>
							<Text weight="bold" size="lg">
								Feature 1
							</Text>
							<Text color="dimmed">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
							</Text>
						</Stack>
					</Flex>
					<Flex align="start" p="md" sx={{ gap: '10px' }}>
						<Text>Icon Here</Text>
						<Stack spacing={1}>
							<Text weight="bold" size="lg">
								Feature 2
							</Text>
							<Text color="dimmed">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
							</Text>
						</Stack>
					</Flex>
					<Flex align="start" p="md" sx={{ gap: '10px' }}>
						<Text>Icon Here</Text>
						<Stack spacing={1}>
							<Text weight="bold" size="lg">
								Feature 3
							</Text>
							<Text color="dimmed">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
							</Text>
						</Stack>
					</Flex>
				</Group>
			</Stack>
		</Container>
	);
}
