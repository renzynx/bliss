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
};

export type CreateInvite = {
  __typename?: 'CreateInvite';
  expires: Scalars['Float'];
  invite: Scalars['String'];
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

export type Invite = {
  __typename?: 'Invite';
  code: Scalars['String'];
  created_at: Scalars['DateTime'];
  expires_at: Scalars['DateTime'];
  id: Scalars['Float'];
  uid: Scalars['Float'];
  used_by?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createInvite?: Maybe<CreateInvite>;
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  invite: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
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
  users: Scalars['Float'];
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
  invites?: Maybe<Array<Invite>>;
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

export type RegularInviteFragment = { __typename?: 'Invite', id: number, code: string, created_at: any, used_by?: string | null, uid: number, expires_at: any };

export type RegularUrlFragment = { __typename?: 'Url', id: number, destination: string, short: string, created_at: string, password: string, views: number, uid: number };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string, is_admin: boolean, token: string, files?: Array<{ __typename?: 'File', id: number, file_name: string, original_name: string, mimetype?: string | null, slug: string, uploaded_at: any, views: number, uid: number, size: number }> | null, urls?: Array<{ __typename?: 'Url', id: number, destination: string, short: string, created_at: string, password: string, views: number, uid: number }> | null, invites?: Array<{ __typename?: 'Invite', id: number, code: string, created_at: any, used_by?: string | null, uid: number, expires_at: any }> | null };

export type CreateInviteMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateInviteMutation = { __typename?: 'Mutation', createInvite?: { __typename?: 'CreateInvite', invite: string, expires: number } | null };

export type SignInMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, is_admin: boolean, token: string, files?: Array<{ __typename?: 'File', id: number, file_name: string, original_name: string, mimetype?: string | null, slug: string, uploaded_at: any, views: number, uid: number, size: number }> | null, urls?: Array<{ __typename?: 'Url', id: number, destination: string, short: string, created_at: string, password: string, views: number, uid: number }> | null, invites?: Array<{ __typename?: 'Invite', id: number, code: string, created_at: any, used_by?: string | null, uid: number, expires_at: any }> | null } | null } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  invite: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, is_admin: boolean, token: string, files?: Array<{ __typename?: 'File', id: number, file_name: string, original_name: string, mimetype?: string | null, slug: string, uploaded_at: any, views: number, uid: number, size: number }> | null, urls?: Array<{ __typename?: 'Url', id: number, destination: string, short: string, created_at: string, password: string, views: number, uid: number }> | null, invites?: Array<{ __typename?: 'Invite', id: number, code: string, created_at: any, used_by?: string | null, uid: number, expires_at: any }> | null } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, is_admin: boolean, token: string, files?: Array<{ __typename?: 'File', id: number, file_name: string, original_name: string, mimetype?: string | null, slug: string, uploaded_at: any, views: number, uid: number, size: number }> | null, urls?: Array<{ __typename?: 'Url', id: number, destination: string, short: string, created_at: string, password: string, views: number, uid: number }> | null, invites?: Array<{ __typename?: 'Invite', id: number, code: string, created_at: any, used_by?: string | null, uid: number, expires_at: any }> | null } | null };

export type GetStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatsQuery = { __typename?: 'Query', getStats: { __typename?: 'Stats', users: number, files: number, size: string } };

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
export const RegularInviteFragmentDoc = gql`
    fragment RegularInvite on Invite {
  id
  code
  created_at
  used_by
  uid
  expires_at
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
  invites {
    ...RegularInvite
  }
}
    ${RegularFileFragmentDoc}
${RegularUrlFragmentDoc}
${RegularInviteFragmentDoc}`;
export const CreateInviteDocument = gql`
    mutation CreateInvite {
  createInvite {
    invite
    expires
  }
}
    `;
export type CreateInviteMutationFn = Apollo.MutationFunction<CreateInviteMutation, CreateInviteMutationVariables>;

/**
 * __useCreateInviteMutation__
 *
 * To run a mutation, you first call `useCreateInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInviteMutation, { data, loading, error }] = useCreateInviteMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateInviteMutation(baseOptions?: Apollo.MutationHookOptions<CreateInviteMutation, CreateInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInviteMutation, CreateInviteMutationVariables>(CreateInviteDocument, options);
      }
export type CreateInviteMutationHookResult = ReturnType<typeof useCreateInviteMutation>;
export type CreateInviteMutationResult = Apollo.MutationResult<CreateInviteMutation>;
export type CreateInviteMutationOptions = Apollo.BaseMutationOptions<CreateInviteMutation, CreateInviteMutationVariables>;
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
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!, $invite: String!) {
  register(username: $username, password: $password, invite: $invite) {
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
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *      invite: // value for 'invite'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

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
    users
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