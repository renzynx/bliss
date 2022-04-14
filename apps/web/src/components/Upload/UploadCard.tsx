import { MantineTheme, Center, Text, Progress } from '@mantine/core';
import { FC } from 'react';
import { File as PrismaFile } from '@prisma/client';
import useStyles from './Upload.styles';

interface CardProps {
  theme: MantineTheme;
  index: number;

  progress: number[];
  success: PrismaFile[];
  file: File;
}

const UploadCard: FC<CardProps> = ({ file, index, progress, success }) => {
  const { classes } = useStyles();

  return (
    <Center className={classes.card} key={index}>
      <Progress
        size="xl"
        label={`${progress[index]}%`}
        value={progress[index]}
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
      {success[index] ? (
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
