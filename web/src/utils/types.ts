import { MeQuery } from '@generated/graphql';

export type Preview = {
	url: string;
	filename: string;
	type: string;
	size: number;
};

export type FileProps = {
	__typename?: 'File' | undefined;
	id: number;
	file_name: string;
	original_name: string;
	mimetype?: string | null | undefined;
	slug: string;
	uploaded_at: any;
	views: number;
	uid: number;
	size: number;
}[];

export interface DashboardBodyState {
	__typename?: 'CreateInvite' | undefined;
	invite: string;
	expires: number;
}

export interface InviteProps {
	__typename?: 'Invite' | undefined;
	id: number;
	code: string;
	created_at: any;
	used_by?: string | null | undefined;
	uid: number;
	expires_at: any;
}

export interface UserStore {
	data?: MeQuery;
	loading: boolean;
}
