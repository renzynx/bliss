import { FieldError } from '@bliss/shared-types';
import { MantineTheme } from '@mantine/core';
import { DropzoneStatus } from '@mantine/dropzone';
import { Dispatch, SetStateAction } from 'react';
import { File as PrismaFile } from '@prisma/client';
import axios from 'axios';

export function handleError(errors: FieldError[]) {
  const error: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    error[field] = message;
  });

  return error;
}

export function matchError(errors: string[]) {
  const error: Record<string, string> = {};
  errors.forEach((message) => {
    const trueMessage = message.replace('(s) => s.', '').toLowerCase();
    const [field] = trueMessage.split(' ');
    error[field] = trueMessage
      .replace(/username_email/gi, 'Username/Email')
      .replace(/password/gi, 'Password')
      .replace(/old_Password/gi, 'old password')
      .replace(/new_Password_confirmation/gi, 'confirm password')
      .replace(/new_Password/gi, 'new password')
      .replace(/_confirmation/g, '');
  });

  return error;
}

export function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

export function uploadFile(
  file: File,
  auth: string,
  slug: string,
  onProgress: Dispatch<SetStateAction<number[]>>
) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/upload`;

  const formData = new FormData();
  formData.append('file', file);

  return axios
    .post<PrismaFile>(url, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        authorization: auth,
        uploader: 'web',
        type: slug,
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const progress = Math.round((loaded / total) * 100);
        onProgress((p) => [...p, progress]);
      },
    })
    .then((response) => response.data);
}
