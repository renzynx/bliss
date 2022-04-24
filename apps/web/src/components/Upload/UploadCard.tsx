import { MantineTheme, Center, Text, Progress } from '@mantine/core';
import { FC } from 'react';
import useStyles from './Upload.styles';
import { FileWithProgress } from '#lib/types';

interface CardProps {
  theme: MantineTheme;
  file: FileWithProgress;
}

const UploadCard: FC<CardProps> = ({ file }) => {
  const { classes } = useStyles();

  return (
    <Center className={classes.card}>
      <Progress
        size="xl"
        label={`${file.progress}%`}
        value={file.progress}
        sx={{ width: '100%' }}
        sections={[
          {
            value: 0,
            color: 'gray',
            label: 'Pending',
          },
          {
            value: 100,
            color: 'teal',
            label: 'Success',
          },
        ]}
      />
      {file.progress === 100 ? (
        <Text align="center" lineClamp={1}>
          Uploaded {file.name}
        </Text>
      ) : (
        <Text align="center" lineClamp={1}>
          Uploading {file.name}
        </Text>
      )}
    </Center>
  );
};

export default UploadCard;
