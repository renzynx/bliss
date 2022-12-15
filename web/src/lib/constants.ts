export enum ROUTES {
	HOME = '/',
	ROOT = '/dashboard',
	UPLOAD = '/dashboard/upload',
	ADMIN = '/dashboard/admin',
	GALLERY = '/user/gallery',
	SETTINGS = '/user/settings',
	PROFILE = '/user/profile',
	SIGN_IN = '/auth/signin',
	SIGN_UP = '/auth/signup',
}

export enum API_ROUTES {
	STATS = '/statistics',
	REGISTER = '/auth/register',
	LOGIN = '/auth/login',
	LOGOUT = '/auth/logout',
	ME = '/auth/me',
	UPLOAD_FILE = '/upload/bulk',
	UPLOAD_STATUS = '/upload/status',
	UPLOAD_REQUEST = '/upload/request',
	USER_FILES = '/users/files',
	SEARCH_FILES = '/users/search/files',
	EMBED_SETTINGS = '/users/embed-settings',
	CHANGE_PASSWORD = '/users/change-password',
	CHANGE_USERNAME = '/users/change-username',
	SEND_VERIFICATION_EMAIL = '/users/verify/send',
	VERIFY_EMAIL = '/users/verify',
	CHECK_CLOSED = '/auth/check-register',
	UPDATE_SERVER_SETTINGS = '/admin/server-settings',
	INVITE_CODE = '/admin/invites',
}

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Bliss V2';
export const API_URL =
	process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const uploaderConfig = (name: string, token: string) => ({
	Version: '13.2.1',
	Name: name,
	DestinationType: 'ImageUploader, FileUploader, TextUploader',
	RequestMethod: 'POST',
	RequestURL: `${API_URL}/upload`,
	Headers: {
		Authorization: token,
	},
	URL: '$json:url$',
	ThumbnailURL: '$json:thumbnail$',
	DeletionURL: '$json:delete$',
	ErrorMessage: '$json:message$',
	Body: 'MultipartFormData',
	FileFormName: 'file',
});

export const MIME_TYPES = [
	'image/png',
	'image/gif',
	'image/jpeg',
	'image/svg+xml',
	'image/webp',
	'audio/ogg',
	'audio/wave',
	'audio/wav',
	'audio/x-wav',
	'audio/x-pn-wav',
	'audio/mp3',
	'audio/mpeg',
	'video/mp4',
	'video/quicktime',
	'video/ogg',
	'video/webm',
	'application/ogg',
];

export const CHUNK_SIZE = 90 * 1024 ** 2; // 90MB
