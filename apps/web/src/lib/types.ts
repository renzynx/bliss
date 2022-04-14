import { PaginationPayload } from '@bliss/shared-types';
import { File } from '@prisma/client';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

export interface AuthModalProps {
  state: boolean;
  type?: 'login' | 'register';
}

export interface ModalProps {
  opened: AuthModalProps;
  setOpened: (opened: AuthModalProps) => void;
}

export interface LoginPayload {
  username_email: string;
  password: string;
}

export interface RegisterPayload {
  email?: string;
  username: string;
  password: string;
  invitation?: string;
}

export interface ChangePasswordPayLoad {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ErrorPayload {
  error: string;
  message: string[];
  statusCode: number;
}

export interface RootError {
  status: number;
  data: ErrorPayload;
}

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  description: string;
  id: string;
}

export interface FileProps {
  search: string;
  page: number;
  isLoading: boolean;
  isFetching: boolean;
  files: PaginationPayload<File>;
  setPage: (page: number) => void;
}

export interface ShareXConfig {
  Version: string;
  Name: string;
  DestinationType: string;
  RequestMethod: string;
  RequestURL: string;
  Headers: {
    Authorization: string;
    Type: string;
  };
  URL: string;
  ThumbnailURL: string;
  DeletionURL: string;
  ErrorMessage: string;
  Body: string;
  FileFormName: string;
}
