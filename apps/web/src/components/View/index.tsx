import {
  Center,
  Title,
  Group,
  Button,
  Box,
  Anchor,
  Text,
  Image,
} from '@mantine/core';
import { FC } from 'react';
import { CloudDownload } from 'tabler-icons-react';
import { View } from '@bliss/shared-types';

const View: FC<{ data: View; slug: string }> = ({ data, slug }) => {
  return (
    <Center
      my="xl"
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        p="xl"
        sx={(t) => ({
          backgroundColor:
            t.colorScheme === 'dark' ? t.colors.dark[6] : t.colors.gray[3],
          [t.fn.smallerThan('md')]: {
            width: '95%',
          },
          [t.fn.largerThan('md')]: {
            width: '60%',
          },
          textAlign: 'center',
          borderRadius: '5px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        })}
      >
        <Box mb="md">
          <Title order={2}>{data.original_name}</Title>
          <Title order={5}>
            {data.filename}

            <Text
              inherit
              color="dimmed"
              ml="2px"
              sx={{
                display: 'inline-block',
              }}
            >
              ({data.formatted_size})
            </Text>
          </Title>
        </Box>
        {data.type.includes('image') ? (
          <Image
            sx={{
              borderRadius: '5px',
              maxWidth: '100%',
              maxHeight: '75vh',
              width: 'auto',
            }}
            src={`${process.env.NEXT_PUBLIC_API_URL}/${slug}`}
            alt={data.original_name}
          />
        ) : data.type.includes('video') ? (
          <video
            style={{
              borderRadius: '5px',
              maxWidth: '100%',
              maxHeight: '75vh',
              width: 'auto',
            }}
            src={`${process.env.NEXT_PUBLIC_API_URL}/${slug}`}
            controls
          />
        ) : data.type.includes('audio') ? (
          <audio src={`${process.env.NEXT_PUBLIC_API_URL}/${slug}`} controls />
        ) : (
          <Text align="center" size="lg" weight="semibold">
            This file can&apos;t be previewed.
          </Text>
        )}
        <Box
          mt="md"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Title order={3}>Upload By: {data.username}</Title>
          <Title order={5}>
            Uploaded At:
            <Text
              inherit
              color="dimmed"
              ml="5px"
              sx={{
                display: 'inline-block',
              }}
            >
              {new Date(data.uploadedAt).toLocaleString()}
            </Text>
          </Title>
          <Title order={5}>
            View:{' '}
            <Text
              inherit
              color="dimmed"
              sx={{
                display: 'inline-block',
              }}
            >
              {data.view}
            </Text>
          </Title>
          <Group mt="md">
            <Button leftIcon={<CloudDownload />} color="indigo" size="md">
              <Anchor
                variant="text"
                size="sm"
                download
                href={`${process.env.NEXT_PUBLIC_API_URL}/${slug}?download=true`}
              >
                Download
              </Anchor>
            </Button>
          </Group>
        </Box>
      </Box>
    </Center>
  );
};

export default View;
