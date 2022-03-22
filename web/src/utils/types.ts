export type Preview = {
	url: string;
	filename: string;
	displayName: string;
	type: string;
	size: number;
	id: number;
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
