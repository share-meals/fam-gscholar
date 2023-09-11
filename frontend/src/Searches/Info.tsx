import {
    useQuery,
    gql
} from '@apollo/client';
import {
    Box,
    SkeletonText,
    Text,
    VStack,
} from '@chakra-ui/react';

import {format} from 'date-fns';

const GET_SEARCH = gql`
    query (
	$id: ID!
    ) {
	search(id: $id) {
	    data {
		id
		attributes {
		    query
		    year_min
		    year_max
		    last_run
		}
	    }
	}
    }
`;

const COUNT_RESULTS = gql`
    query (
	$search_id: ID!,
	$query: String
    ) {
	results (
	    filters: {
		search: {
		    id: {
			eq: $search_id
		    }
		},
		title: {
		    containsi: $query
		},
		snippet: {
		    containsi: $query
		}
	    }
	) {
	    meta {
		pagination {
		    total
		}
	    }
	    data {
		id
	    }
	}
    }
`

export default ({
    id,
    query = ''
}) => {
    const {
	loading: search_loading,
	error: search_error,
	data: search_data,
	refetch: search_refetch
    } = useQuery(GET_SEARCH, {
	variables: {
	    id,
	    query
	}
    });

    const {
	loading: results_count_loading,
	error: results_count_error,
	data: results_count_data,
	refetch: results_count_refetch
    } = useQuery(COUNT_RESULTS, {
	variables: {
	    search_id: id,
	    query
	}
    });

    if(search_loading || search_data === undefined){
	return (
	    <SkeletonText />
	);
    }
    return (
	<Box>
	    <Text fontSize='xl'>
		{search_data.search.data.attributes.query}
	    </Text>
	    {
		(results_count_loading || results_count_data === undefined)
		? <SkeletonText />
		: <Text fontSize='sm'>
		    {results_count_data.results.meta.pagination.total} result{results_count_data.results.meta.pagination.total === 1 ? '' : 's'}
		</Text>
	    }
	    <Text fontSize='sm' as='i'>
		{
		    search_data.search.data.attributes.last_run === null ?
		    'never run before'
		    :
		    format(new Date(search_data.search.data.attributes.last_run), `'last ran' MMM d 'at' h:mm aa`)
		}
	    </Text>
	</Box>
    );
}
