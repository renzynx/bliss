import { userAtom } from '@lib/atoms';
import { EmbedSettings } from '@lib/types';
import {
	Anchor,
	Avatar,
	Group,
	Image,
	Paper,
	Stack,
	Text,
} from '@mantine/core';
import { useAtom } from 'jotai';
import { FC } from 'react';

const EmbedPreview: FC<Partial<EmbedSettings>> = (data) => {
	const [user] = useAtom(userAtom);
	return (
		<Paper withBorder p="md">
			<Group align="start">
				<Avatar
					sx={{ width: 42, height: 42, boxShadow: '0 0 0 0.1px #FFFFFF' }}
					size="md"
					radius="xl"
					src={user?.image}
					alt="user avatar"
				/>
				<Stack spacing={0}>
					<Group>
						<Text variant="link" sx={{ color: '#FFFFFF' }}>
							{user?.username}
						</Text>
						<Text color="dimmed" size="xs">
							Today at{' '}
							{new Date(Date.now()).toLocaleString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
								hour12: true,
							})}
						</Text>
					</Group>
					<Text variant="link">
						{process.env.NEXT_PUBLIC_API_URL}/r9fc2h89j0e
					</Text>

					{data && data.enabled === 'true' ? (
						<Paper
							withBorder={!!data.color}
							sx={{
								background: data.color ? '#2F3136' : '',
								borderLeft: `4px solid ${data.color}`,
								borderRadius: 4,
							}}
						>
							<Stack spacing={5} mt={10} ml={10} mr="sm">
								{data.provider_name && (
									<Anchor
										size="xs"
										href={data.provider_url ? data.provider_url : ''}
										sx={{
											color: '#FFFFFF',
											maxWidth: '300px',
											wordWrap: 'break-word',
										}}
									>
										{data.provider_name}
									</Anchor>
								)}
								{data.author_name && (
									<Anchor
										href={data.author_url ? data.author_url : ''}
										size="sm"
										sx={{
											color: '#FFFFFF',
											maxWidth: '300px',
											wordWrap: 'break-word',
										}}
									>
										{data.author_name}
									</Anchor>
								)}
								{data.title && (
									<Text
										variant="link"
										style={{ maxWidth: '300px', wordWrap: 'break-word' }}
									>
										{data.title}
									</Text>
								)}
								{data.description && (
									<Text
										size="sm"
										style={{ maxWidth: '300px', wordWrap: 'break-word' }}
									>
										{data.description}
									</Text>
								)}

								<Image
									src="https://upload.wikimedia.org/wikipedia/commons/d/d1/ShareX_Logo.png"
									alt="sharex logo"
								/>
							</Stack>
						</Paper>
					) : (
						<Image
							src="https://upload.wikimedia.org/wikipedia/commons/d/d1/ShareX_Logo.png"
							alt="sharex logo"
						/>
					)}
				</Stack>
			</Group>
		</Paper>
	);
};

export default EmbedPreview;
