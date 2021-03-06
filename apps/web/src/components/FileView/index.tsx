import {
  useMantineTheme,
  Grid,
  Button,
  Box,
  Image,
  Text,
  Center,
  Anchor,
} from '@mantine/core';
import { File as PrismaFile } from '@prisma/client';
import useStyles from './FileView.styles';
import { bytesToSize } from '@bliss/shared-types';
import { useClipboard } from '@mantine/hooks';
import { useDeleteFileMutation } from '#lib/redux/slices/auth.slice';
import { showNotification } from '@mantine/notifications';
import { Check, X } from 'tabler-icons-react';
import { RootError } from '#lib/types';
import { useAppSelector } from '#lib/redux/hooks';

const FileView = ({ file }: { file: PrismaFile }) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { copy, copied } = useClipboard({ timeout: 3000 });
  const [deleteFile, { isLoading }] = useDeleteFileMutation();
  const { user } = useAppSelector((state) => state.user);

  return (
    <Box className={classes.card}>
      <Center className={classes.imgContainer}>
        {file.mimetype.includes('image') ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/${file.slug}`}
            alt={file.originalName}
            sx={{ width: '90%' }}
          />
        ) : file.mimetype.includes('video') ? (
          <video
            controls
            style={{ width: '90%' }}
            src={`${process.env.NEXT_PUBLIC_API_URL}/${file.slug}`}
          />
        ) : file.mimetype.includes('audio') ? (
          <audio controls preload="auto">
            <source
              src={`${process.env.NEXT_PUBLIC_API_URL}/${file.slug}`}
              type={file.mimetype}
            />
          </audio>
        ) : (
          <Text align="center" size="lg" weight="semibold">
            This file can&apos;t be previewed.
          </Text>
        )}
      </Center>
      <Box className={classes.textContainer}>
        <Text weight="bold" lineClamp={1}>
          {file.originalName}
        </Text>
        <Text size="sm">
          {file.fileName} ({bytesToSize(file.size)})
        </Text>
        <Text size="xs">
          Uploaded at {new Date(file.createdAt).toLocaleString()}
        </Text>
      </Box>
      <Grid
        grow
        mb="xs"
        mx="auto"
        sx={{
          placeItems: 'center',
        }}
      >
        <Grid.Col span={4}>
          <Button
            sx={{
              width: '100%',
            }}
            loading={isLoading}
            color="red"
            variant={`${theme.colorScheme === 'dark' ? 'light' : 'filled'}`}
            onClick={() => {
              deleteFile(file.deleteToken)
                .unwrap()
                .then(({ success, message }) => {
                  if (success) {
                    showNotification({
                      title: 'Deleted',
                      message,
                      color: 'green',
                      icon: <Check />,
                      autoClose: 1500,
                    });
                  } else {
                    showNotification({
                      title: 'Error',
                      message,
                      color: 'red',
                      icon: <X />,
                      autoClose: 1500,
                    });
                  }
                })
                .catch((err: RootError) => {
                  if (err.status === 429) {
                    return showNotification({
                      title: 'Error',
                      message: 'Too many requests, please try again later.',
                      color: 'red',
                      icon: <X />,
                    });
                  }
                  showNotification({
                    title: `Error `,
                    message: 'Something went wrong, please try again later.',
                    color: 'red',
                    icon: <X />,
                  });
                });
            }}
          >
            Delete
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button
            sx={{
              width: '100%',
            }}
            loading={!user}
            color={copied ? 'green' : 'blue'}
            variant={`${theme.colorScheme === 'dark' ? 'light' : 'filled'}`}
            onClick={() =>
              copy(
                user.useEmbed
                  ? `${window.location.hostname}/${file.slug}`
                  : `${process.env.NEXT_PUBLIC_API_URL}/${file.slug}`
              )
            }
          >
            {copied ? 'Copied File URL' : 'Copy URL'}
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button
            sx={{
              width: '100%',
            }}
            color="teal"
            variant={`${theme.colorScheme === 'dark' ? 'light' : 'filled'}`}
          >
            <Anchor
              variant="text"
              size="sm"
              download
              href={`${process.env.NEXT_PUBLIC_API_URL}/${file.slug}?download=true`}
            >
              Download
            </Anchor>
          </Button>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default FileView;
