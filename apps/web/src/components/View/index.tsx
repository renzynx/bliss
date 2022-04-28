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
import { bytesToSize, View } from '@bliss/shared-types';

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
          <Title order={2}>{data.original}</Title>
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
              ({bytesToSize(parseInt(data.size))})
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
              position: 'relative',
            }}
            src={`${process.env.NEXT_PUBLIC_API_URL}/${slug}`}
            alt={data.original}
          />
        ) : data.type.includes('video') ? (
          <video
            style={{
              borderRadius: '5px',
              maxWidth: '100%',
              maxHeight: '75vh',
              width: 'auto',
            }}
            src={data.url}
            controls
          />
        ) : data.type.includes('audio') ? (
          <>
            <audio src={data.url} controls />
          </>
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
