import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
    gql
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {ChakraProvider} from '@chakra-ui/react';
import {AuthProvider, useAuth} from './context/auth';

const httpLink = createHttpLink({
    uri: `${import.meta.env.VITE_STRAPI_URI}/graphql`
});

const authLink = setContext((_, {headers}) => {
    const jwt = localStorage.getItem('jwt');
    const hasJwt = jwt !== null && jwt !== 'null'; // need to check for string because of localstorage
    return {
	headers: {
	    ...headers,
	    authorization: hasJwt ? `Bearer ${jwt}` : ''
	}
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
	<AuthProvider>
	    <ApolloProvider client={client}>
		<ChakraProvider>
		    <Router />
		</ChakraProvider>
	    </ApolloProvider>
	</AuthProvider>
    </React.StrictMode>,
);
