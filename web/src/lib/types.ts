import { PaperProps } from '@mantine/core';
import { TablerIcon } from '@tabler/icons';
import { NextComponentType, NextPage, NextPageContext } from 'next';
import { AppProps } from 'next/app';

export interface SignInFormProps {
	props?: PaperProps;
	callback?: string;
}

export type CustomComponent = NextComponentType<NextPageContext, any, any> & {
	options?: CustomPageOptions;
};

export interface CustomAppProps extends AppProps {
	Component: CustomComponent;
}

export interface CustomPageOptions {
	auth?: boolean;
	withLayout?: boolean;
	admin?: boolean;
}

export type CustomNextPage<P = {}, IP = P> = NextPage<P, IP> & {
	options?: CustomPageOptions;
};

export interface UserResponse {
	user?: SessionUser;
	errors?: FieldError[];
}

export type Role = 'OWNER' | 'ADMIN' | 'USER';

export type SessionUser = {
	id: string;
	username: string;
	image?: string;
	email: string;
	role: Role;
	createdAt: Date;
	emailVerified: Date;
	apiKey: string;
	total: number;
	uploadLimit: number;
	disabled: boolean;
};

export interface Item {
	icon: TablerIcon;
	label: string;
	href: string;
	active?: boolean;
	admin?: boolean;
	owner?: boolean;
	children?: Omit<Item, 'children'>[];
}

export interface NavbarLinkProps {
	icon: TablerIcon;
	label: string;
	active?: boolean;
	onClick(): void;
}

export interface IMenuProps {
	href: string;
	text: string;
	icon: JSX.Element;
	right_section: JSX.Element;
}

export interface FieldError {
	field: string;
	message: string;
}

export interface UnauthorizedResponse {
	statusCode: number;
	message: string;
}

export interface UploadOptions {
	url?: string;
	startByte?: number;
	fileId?: string;
	onAbort: (e: any, file: File) => void;
	onProgress: (e: any, file: File) => void;
	onError: (e: any, file: File) => void;
	onComplete: (e: any, file: File) => void;
}

export interface IFile {
	id: string;
	filename: string;
	mimetype: string;
	slug: string;
	size: number;
	userId: string;
	createdAt: Date;
	albumCover: string | null;
}

export interface FileResponse {
	files: IFile[];
	totalPages: number;
	totalFiles: number;
}

export interface EmbedSettings {
	id: string;
	enabled: 'true' | 'false';
	provider_name: string | null;
	provider_url: string | null;
	author_name: string | null;
	author_url: string | null;
	title: string | null;
	description: string | null;
	color: string;
	userId: string;
}

export interface ServerSettings {
	REGISTRATION_ENABLED: boolean;
	INVITE_MODE: boolean;
}

export interface Invite {
	invite: string;
	username: string;
}

export interface FileRejection {
	file: File;
	errors: {
		code: string;
		message: string;
	}[];
}

export interface Chunk {
	blob: Blob;
	start: number;
	end: number;
}

export interface UpdateUsers {
	id: string;
	role: Role;
	disabled: boolean;
	uploadLimit: number;
}
