import { MeQuery } from './../generated/graphql';
import {
	MutationFunctionOptions,
	DefaultContext,
	ApolloCache,
	FetchResult,
} from '@apollo/client';
import { SignInMutation, Exact } from '@generated/graphql';

export interface IUserContext {
	user?: MeQuery;
	setUser: (user: MeQuery) => void;
}

export interface LoginFormProps {
	redirect?: string;
	signIn: (
		options?:
			| MutationFunctionOptions<
					SignInMutation,
					Exact<{
						username: string;
						password: string;
					}>,
					DefaultContext,
					ApolloCache<any>
			  >
			| undefined
	) => Promise<
		FetchResult<SignInMutation, Record<string, any>, Record<string, any>>
	>;
}

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
