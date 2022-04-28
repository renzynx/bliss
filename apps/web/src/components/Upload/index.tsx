import { useMantineTheme, Skeleton } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '#lib/redux/hooks';
import { dropzoneChildren } from './DropzoneChildren';
import { auth } from '#lib/redux/slices/auth.slice';
import { ACCEPT_TYPE } from '#lib/constants';
import { FileWithProgress } from '#lib/types';
import dynamic from 'next/dynamic';
const UploadGrid = dynamic(import('./UploadGrid'));

const Upload = () => {
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const { user } = useAppSelector((state) => state.user);

  return (
    <>
      <Skeleton visible={!user}>
        <Dropzone
          onDrop={(files) => {
            import('#lib/functions').then(async ({ uploadFile }) => {
              await Promise.all(
                uploadFile(files, user.token, user.slugType, setFiles)
              );
              dispatch(auth.util.invalidateTags(['File']));
            });
          }}
          onReject={(files) => alert(`${files.length} file(s) rejected`)}
          maxSize={10 * 5 * 1024 ** 2}
          accept={ACCEPT_TYPE}
          multiple
        >
          {(status) => dropzoneChildren(status, theme)}
        </Dropzone>
      </Skeleton>

      <UploadGrid files={files} theme={theme} />
    </>
  );
};

export default Upload;
