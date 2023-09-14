import {
    useMutation,
    useQuery,
    gql
} from '@apollo/client';
import Info from '@/Searches/Info';
import {
    useState
} from 'react';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    Button,
    HStack,
    Icon,
    Link as ChakraLink,
    SkeletonText,
    Spacer,
    Stack,
    StackDivider,
    Text,
    useToast
} from '@chakra-ui/react';
import {Link as ReactRouterLink} from 'react-router-dom';
import {
    MdOutlineVisibility,
    MdPlayArrow
} from 'react-icons/md';
import {format} from 'date-fns';
import {useAuth} from '@/context/auth';
import qs from 'qs';

const GET_SEARCHES = gql`
    query GetSearches {
	searches {
	    data {
		id
		attributes {
		    query
		    year_min
		    year_max
		    last_run
		    page
		    responses {
			data {
			    id
			}
		    }
		}
	    }
	}
    }
`;

const UPDATE_SEARCH_RESPONSES = gql`
    mutation (
	$id: ID!,
	$last_run: DateTime!,
	$responses: [ID],
	$page: Int
    ) {
	updateSearch(
	    id: $id,
	    data: {
		last_run: $last_run
		responses: $responses
		page: $page
	    }
	) {
	    data {
		id
	    }
	}
    }
`;

const CREATE_RESPONSE = gql`
    mutation CreateResponse(
	$data: ResponseInput!
    ) {
	createResponse(
	    data: $data
	) {
	    data {
		id
	    }
	}
    }
`;

const CREATE_RESULT = gql`
    mutation CreateResult(
	$data: ResultInput!
    ) {
	createResult(
	    data: $data
	) {
	    data {
		id
	    }
	}
    }
`;


//import test_data from '../test';

const normalizeResponseData = (data) => {
    const dataCopy = structuredClone(data);
    dataCopy.search_metadata.serpapi_id = dataCopy.search_metadata.id;
    delete dataCopy.search_metadata.id;
    dataCopy.search_metadata.serpapi_created_at = new Date(dataCopy.search_metadata.created_at);
    delete dataCopy.search_metadata.created_at;
    dataCopy.search_metadata.serpapi_processed_at = new Date(dataCopy.search_metadata.processed_at);
    delete dataCopy.search_metadata.processed_at;

    dataCopy.pagination.other_pages = Object.values(dataCopy.pagination.other_pages).map((link) => {return {link};});
    dataCopy.serpapi_pagination.other_pages = Object.values(dataCopy.serpapi_pagination.other_pages).map((link) => {return {link};});
    delete dataCopy.organic_results;
    return dataCopy;
}

const normalizeResultData = (data) => {
    return data;
};


const getResponse = async (search, jwt) => {
    const params = {
	engine: 'google_scholar',
	q: search.attributes.query,
	api_key: import.meta.env.VITE_SERPAPI_KEY,
	as_ylo: search.attributes.year_min,
	as_yhi: search.attributes.year_max,
	scisbd: 1,
	num: 20,
	start: search.attributes.page ? search.attributes.page * 20 : 0
    };

    const response = await fetch(`${import.meta.env.VITE_STRAPI_URI}/api/search/run`,
				 {
				     method: 'POST',
				     headers: {
					 "Content-Type": 'application/json',
					 Authorization: `Bearer ${jwt}`
				     },
				     body: JSON.stringify(params)
				 }
    );
    return (await response.json()).data.attributes;
}

export default () => {
    const {jwt} = useAuth();
    const {
	loading: search_loading,
	error: search_error,
	data: search_data,
	refetch: search_refetch
    } = useQuery(GET_SEARCHES);
    const [updateSearchResponses, {

    }] = useMutation(UPDATE_SEARCH_RESPONSES);
    const [createResponse, {
	loading: createResponseLoading,
	error: createResponseError,
	data: createResponseData
    }] = useMutation(CREATE_RESPONSE);
    const [createResult] = useMutation(CREATE_RESULT);
    const [responseLoadingId, setResponseLoadingId] = useState(null);
    const toast = useToast();
    
    const runSearch = async (search) => {
 	setResponseLoadingId(search.id);
	const response_data = await getResponse(search, jwt);
	console.log(response_data);
	const result_responses = await Promise.all(
	    response_data.organic_results.map(
		(result) => {
		    return createResult({
			variables: {
			    data: {
				...normalizeResultData(result),
				search: search.id
			    }
			}
		    });
	}));
	const ids = result_responses.map((result) => parseInt(result.data.createResult.data.id));
	const response = await createResponse({
	    variables: {
		data: {
		    ...normalizeResponseData(response_data),
		    organic_results: ids,
		    search: search.id
		}
	    }
	});
	const existing_responses = search.attributes.responses.data.map((response) => response.id);
	await updateSearchResponses({
	    variables: {
		id: search.id,
		last_run: new Date(),
		responses: [...existing_responses, response.data.createResponse.data.id],
		page: response_data.serpapi_pagination.current
	    }
	});
	await search_refetch();
	setResponseLoadingId(-999);
	toast({
	    title: 'Success',
	    description: 'Search ran',
	    status: 'success'
	});
    }
    
    if(search_loading || search_data === undefined){
	return(
	    <SkeletonText />
	);
    }

    if(search_error){
	return(
	    <Alert status='error'>
		<AlertIcon />
		<AlertTitle>Error</AlertTitle>
		<AlertDescription>{search_error.message}</AlertDescription>
	    </Alert>
	)
    }

    if(search_data?.searches.data.length === 0){
	return (
	    <Text>
		no searches yet
	    </Text>
	);
    }
    return(
	<>
	    <Stack divider={<StackDivider />}>
		{
		    search_data.searches.data.map((search) => <Box key={search.id}>
			<HStack>
			    <Info id={search.id} />
			    <Spacer />
			    <HStack>
				<ChakraLink as={ReactRouterLink} to={`/searches/${search.id}`}>
				    <Button
					colorScheme='green'
					variant='outline'
					leftIcon={<Icon as={MdOutlineVisibility} />}				    
				    >
				    View Results
				    </Button>
				</ChakraLink>
				<Button
				    colorScheme='green'
				    isLoading={search.id === responseLoadingId}
				    leftIcon={<Icon as={MdPlayArrow} />}
				    onClick={() => runSearch(search)}
				>
				    Run
				</Button>
			    </HStack>
			</HStack>
		    </Box>)
		}
	    </Stack>
	</>
    );
}
