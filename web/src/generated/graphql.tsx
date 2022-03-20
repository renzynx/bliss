import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type File = {
  __typename?: 'File';
  file_name: Scalars['String'];
  id: Scalars['Float'];
  mimetype?: Maybe<Scalars['String']>;
  original_name: Scalars['String'];
  size: Scalars['Float'];
  slug: Scalars['String'];
  uid: Scalars['Float'];
  uploaded_at: Scalars['DateTime'];
  views: Scalars['Float'];
};

export type GraphqlFile = {
  __typename?: 'GraphqlFile';
  url: Scalars['String'];
};

export type Ids = {
  ids: Array<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteFile: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  multipleUpload?: Maybe<Array<GraphqlFile>>;
  singleUpload: GraphqlFile;
};


export type MutationDeleteFileArgs = {
  ids: Ids;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationMultipleUploadArgs = {
  files: Array<Scalars['Upload']>;
};


export type MutationSingleUploadArgs = {
  file: Scalars['Upload'];
};

export type Query = {
  __typename?: 'Query';
  getStats: Stats;
  me?: Maybe<User>;
};

export type Stats = {
  __typename?: 'Stats';
  files: Scalars['Float'];
  size: Scalars['String'];
};

export type Url = {
  __typename?: 'Url';
  created_at: Scalars['String'];
  destination: Scalars['String'];
  id: Scalars['Float'];
  password: Scalars['String'];
  short: Scalars['String'];
  uid: Scalars['Float'];
  views: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  files?: Maybe<Array<File>>;
  id: Scalars['Float'];
  is_admin: Scalars['Boolean'];
  token: Scalars['String'];
  urls?: Maybe<Array<Url>>;
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularFileFragment = { __typename?: 'File', id: number, file_name: string, original_name: string, mimetype?: string | null, slug: string, uploaded_at: any, views: number, uid: number, size: number };

export type RegularUrlFragment = { __typename?: 'Url', id: number, destination: string, short: string, created_at: string, password: string, views: number, uid: number };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string, is_admin: boolean, token: string, files?: Array<{ __typename?: 'File', id: number, file_name: string, original_name: string, mimetype?: string | null, slug: string, uploaded_at: any, views: number, uid: number, size: number }> | null, urls?: Array<{ __typename?: 'Url', id: number, destination: string, short: string, created_at: string, password: string, views: number, uid: number }> | null };

export type DeleteFileMutationVariables = Exact<{
  ids: Ids;
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: boolean };

export type SignInMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, is_admin: boolean, token: string, files?: Array<{ __typename?: 'File', id: number, file_name: string, original_name: string, mimetype?: string | null, slug: string, uploaded_at: any, views: number, uid: number, size: number }> | null, urls?: Array<{ __typename?: 'Url', id: number, destination: string, short: string, created_at: string, password: string, views: number, uid: number }> | null } | null } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', logout: boolean };

export type UploadImageMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadImageMutation = { __typename?: 'Mutation', singleUpload: { __typename?: 'GraphqlFile', url: string } };

export type UploadMultipleImagesMutationVariables = Exact<{
  files: Array<Scalars['Upload']> | Scalars['Upload'];
}>;


export type UploadMultipleImagesMutation = { __typename?: 'Mutation', multipleUpload?: Array<{ __typename?: 'GraphqlFile', url: string }> | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, is_admin: boolean, token: string, files?: Array<{ __typename?: 'File', id: number, file_name: string, original_name: string, mimetype?: string | null, slug: string, uploaded_at: any, views: number, uid: number, size: number }> | null, urls?: Array<{ __typename?: 'Url', id: number, destination: string, short: string, created_at: string, password: string, views: number, uid: number }> | null } | null };

export type GetStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatsQuery = { __typename?: 'Query', getStats: { __typename?: 'Stats', files: number, size: string } };

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularFileFragmentDoc = gql`
    fragment RegularFile on File {
  id
  file_name
  original_name
  mimetype
  slug
  uploaded_at
  views
  uid
  size
}
    `;
export const RegularUrlFragmentDoc = gql`
    fragment RegularUrl on Url {
  id
  destination
  short
  created_at
  password
  views
  uid
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  is_admin
  token
  files {
    ...RegularFile
  }
  urls {
    ...RegularUrl
  }
}
    ${RegularFileFragmentDoc}
${RegularUrlFragmentDoc}`;
export const DeleteFileDocument = gql`
    mutation DeleteFile($ids: Ids!) {
  deleteFile(ids: $ids)
}
    `;
export type DeleteFileMutationFn = Apollo.MutationFunction<DeleteFileMutation, DeleteFileMutationVariables>;

/**
 * __useDeleteFileMutation__
 *
 * To run a mutation, you first call `useDeleteFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFileMutation, { data, loading, error }] = useDeleteFileMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useDeleteFileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFileMutation, DeleteFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFileMutation, DeleteFileMutationVariables>(DeleteFileDocument, options);
      }
export type DeleteFileMutationHookResult = ReturnType<typeof useDeleteFileMutation>;
export type DeleteFileMutationResult = Apollo.MutationResult<DeleteFileMutation>;
export type DeleteFileMutationOptions = Apollo.BaseMutationOptions<DeleteFileMutation, DeleteFileMutationVariables>;
export const SignInDocument = gql`
    mutation SignIn($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignOutDocument = gql`
    mutation SignOut {
  logout
}
    `;
export type SignOutMutationFn = Apollo.MutationFunction<SignOutMutation, SignOutMutationVariables>;

/**
 * __useSignOutMutation__
 *
 * To run a mutation, you first call `useSignOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSignOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignOutMutation(baseOptions?: Apollo.MutationHookOptions<SignOutMutation, SignOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument, options);
      }
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = Apollo.MutationResult<SignOutMutation>;
export type SignOutMutationOptions = Apollo.BaseMutationOptions<SignOutMutation, SignOutMutationVariables>;
export const UploadImageDocument = gql`
    mutation UploadImage($file: Upload!) {
  singleUpload(file: $file) {
    url
  }
}
    `;
export type UploadImageMutationFn = Apollo.MutationFunction<UploadImageMutation, UploadImageMutationVariables>;

/**
 * __useUploadImageMutation__
 *
 * To run a mutation, you first call `useUploadImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadImageMutation, { data, loading, error }] = useUploadImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadImageMutation, UploadImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadImageMutation, UploadImageMutationVariables>(UploadImageDocument, options);
      }
export type UploadImageMutationHookResult = ReturnType<typeof useUploadImageMutation>;
export type UploadImageMutationResult = Apollo.MutationResult<UploadImageMutation>;
export type UploadImageMutationOptions = Apollo.BaseMutationOptions<UploadImageMutation, UploadImageMutationVariables>;
export const UploadMultipleImagesDocument = gql`
    mutation UploadMultipleImages($files: [Upload!]!) {
  multipleUpload(files: $files) {
    url
  }
}
    `;
export type UploadMultipleImagesMutationFn = Apollo.MutationFunction<UploadMultipleImagesMutation, UploadMultipleImagesMutationVariables>;

/**
 * __useUploadMultipleImagesMutation__
 *
 * To run a mutation, you first call `useUploadMultipleImagesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadMultipleImagesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadMultipleImagesMutation, { data, loading, error }] = useUploadMultipleImagesMutation({
 *   variables: {
 *      files: // value for 'files'
 *   },
 * });
 */
export function useUploadMultipleImagesMutation(baseOptions?: Apollo.MutationHookOptions<UploadMultipleImagesMutation, UploadMultipleImagesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadMultipleImagesMutation, UploadMultipleImagesMutationVariables>(UploadMultipleImagesDocument, options);
      }
export type UploadMultipleImagesMutationHookResult = ReturnType<typeof useUploadMultipleImagesMutation>;
export type UploadMultipleImagesMutationResult = Apollo.MutationResult<UploadMultipleImagesMutation>;
export type UploadMultipleImagesMutationOptions = Apollo.BaseMutationOptions<UploadMultipleImagesMutation, UploadMultipleImagesMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    is_admin
    token
    files {
      ...RegularFile
    }
    urls {
      ...RegularUrl
    }
  }
}
    ${RegularFileFragmentDoc}
${RegularUrlFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetStatsDocument = gql`
    query GetStats {
  getStats {
    files
    size
  }
}
    `;

/**
 * __useGetStatsQuery__
 *
 * To run a query within a React component, call `useGetStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetStatsQuery, GetStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStatsQuery, GetStatsQueryVariables>(GetStatsDocument, options);
      }
export function useGetStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStatsQuery, GetStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStatsQuery, GetStatsQueryVariables>(GetStatsDocument, options);
        }
export type GetStatsQueryHookResult = ReturnType<typeof useGetStatsQuery>;
export type GetStatsLazyQueryHookResult = ReturnType<typeof useGetStatsLazyQuery>;
export type GetStatsQueryResult = Apollo.QueryResult<GetStatsQuery, GetStatsQueryVariables>;