import { MIME_TYPES } from '@mantine/dropzone';

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
	FORGOT_PASSWORD = '/auth/forgot-password',
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
	FORGOT_PASSWORD = '/users/forgot-password',
	RESET_PASSWORD = '/users/reset-password',
	CHECK_TOKEN = '/users/check-token',
	SEND_VERIFICATION_EMAIL = '/users/verify/send',
	VERIFY_EMAIL = '/users/verify',
	SERVER_SETTINGS = '/server-settings',
	UPDATE_SERVER_SETTINGS = '/admin/server-settings',
	INVITE_CODE = '/admin/invites',
}

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Bliss V2';
export const API_URL =
	process.env.NODE_ENV === 'production'
		? process.env.NEXT_PUBLIC_API_URL
		: 'http://localhost:3000';

export const sharexConfig = (name: string, token: string) => ({
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

export const flameshotScript = (token: string) => `
#!/bin/bash
IMAGEPATH="$HOME/Pictures/"
IMAGENAME="$name-$(date +%s%N | sha256sum | base64 | head -c 32 ; echo)"
KEY="${token}" 
DOMAIN="${API_URL}/upload"

flameshot config -f "$IMAGENAME" 
flameshot gui -r -p "$IMAGEPATH" > /dev/null 

FILE="$IMAGEPATH$IMAGENAME.png"


if [ -f "$FILE" ]; then
    echo "$FILE exists."
    URL=$(curl -X POST \
      -H "Content-Type: multipart/form-data" \
      -H "Accept: application/json" \
      -H "User-Agent: ShareX/13.4.0" \
      -H "Authorization: $KEY" \
      -F "file=@$IMAGEPATH$IMAGENAME.png" "$DOMAIN" | grep -Po '(?<="resource":")[^"]+')
    printf "%s" "$URL" | xclip -sel clip
    rm "$IMAGEPATH$IMAGENAME.png" 
else 
    echo "Aborted."
fi
`;

// export const MIME_TYPES = [
// 	'image/png',
// 	'image/gif',
// 	'image/jpeg',
// 	'image/svg+xml',
// 	'image/webp',
// 	'audio/ogg',
// 	'audio/wave',
// 	'audio/wav',
// 	'audio/x-wav',
// 	'audio/x-pn-wav',
// 	'audio/mp3',
// 	'audio/mpeg',

// ];

export const ACCEPT_TYPE = [
	MIME_TYPES.png,
	MIME_TYPES.jpeg,
	MIME_TYPES.mp4,
	MIME_TYPES.svg,
	MIME_TYPES.webp,
	MIME_TYPES.gif,
	MIME_TYPES.zip,
	MIME_TYPES.pdf,
	MIME_TYPES.docx,
	MIME_TYPES.pptx,
	MIME_TYPES.xlsx,
	'text/plain',
	'audio/mp3',
	'audio/wav',
	'audio/ogg',
	'audio/flac',
	'audio/aac',
	'audio/m4a',
	'audio/mp4',
	'audio/mpeg',
	'audio/webm',
	'audio/3gpp',
	'audio/3gpp2',
	'audio/aac',
	'audio/aiff',
	'audio/amr',
	'audio/basic',
	'audio/midi',
	'audio/mid',
	'audio/m4a',
	'video/mp4',
	'video/quicktime',
	'video/ogg',
	'video/webm',
	'application/ogg',
	'application/binary',
	'application/octet-stream',
	'application/x-msdownload',
	'application/vnd.rar',
	'application/x-rar-compressed',
	'application/zip',
	'application/octet-stream',
	'application/x-zip-compressed',
	'multipart/x-zip',
];

export const USER_LIMIT = (verified: boolean, admin = false) => {
	if (admin) return Infinity;

	return verified
		? +(process.env.NEXT_PUBLIC_USER_VERIFED_LIMIT ?? 2000)
		: +(process.env.NEXT_PUBLIC_USER_NOT_VERIFED_LIMIT ?? 500);
};

export const CHUNK_SIZE =
	+(process.env.NEXT_PUBLIC_CHUNK_SIZE ?? 10) * 1024 ** 2; // default: 10mb
