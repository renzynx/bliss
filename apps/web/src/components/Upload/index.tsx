import { useMantineTheme, Skeleton } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '#lib/redux/hooks';
import dynamic from 'next/dynamic';
import { File as PrismaFile } from '@prisma/client';
import { dropzoneChildren } from './DropzoneChildren';
import { auth } from '#lib/redux/slices/auth.slice';
const UploadGrid = dynamic(import('./UploadGrid'));

const Upload = () => {
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number[]>([]);
  const [finish, setFinish] = useState<PrismaFile[]>([]);
  const { user } = useAppSelector((state) => state.user);
  return (
    <>
      <Skeleton visible={!user}>
        <Dropzone
          onDrop={(files) => {
            setFiles((prevFiles) => [...prevFiles, ...files]);
            import('#lib/functions').then(async ({ uploadFile }) => {
              const slug = user.slugType;
              const promises = files.map(
                async (file) =>
                  await uploadFile(file, user.token, slug, setProgress)
              );
              const filedata = await Promise.all(promises).finally(() => {
                setProgress((p) => [...p, 100]);
              });
              setFinish((prevFinish) => [...prevFinish, ...filedata]);
              dispatch(auth.util.invalidateTags(['File']));
            });
          }}
          onReject={(files) => alert(`${files.length} file(s) rejected`)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          multiple
        >
          {(status) => dropzoneChildren(status, theme)}
        </Dropzone>
      </Skeleton>

      <UploadGrid
        files={files}
        progress={progress}
        success={finish}
        theme={theme}
      />
    </>
  );
};

export default Upload;
