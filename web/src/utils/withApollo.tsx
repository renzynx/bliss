import {
	ApolloClient,
	ApolloProvider,
	HttpLink,
	InMemoryCache,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { useRouter } from 'next/router';
import nextWithApollo from 'next-with-apollo';

const withApollo = nextWithApollo(
	({ initialState, headers }) => {
		return new ApolloClient({
			ssrMode: typeof window === 'undefined',
			// link: new HttpLink({
			// 	uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
			// 	credentials: 'include',
			// }),
			link: createUploadLink({
				uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
				credentials: 'include',
			}),
			headers: {
				...(headers as Record<string, string>),
			},
			cache: new InMemoryCache().restore(initialState || {}),
		});
	},
	{
		render: ({ Page, props }) => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const router = useRouter();
			return (
				<ApolloProvider client={props.apollo}>
					<Page {...props} {...router} />
				</ApolloProvider>
			);
		},
	}
);

export default withApollo;
