import {useParams} from 'react-router-dom';
import {
    useState
} from 'react';
import {
    useQuery,
    gql
} from '@apollo/client';
import {
    Box,
    Button,
    HStack,
    Icon,
    InputGroup,
    InputRightElement,
    Link,
    SkeletonText,
    Spacer,
    Text,
} from '@chakra-ui/react';
import {
    FieldValues,
    useForm
} from 'react-hook-form';
import {InputComponent} from '@sharemeals/frg-react';
import Info from './Info';
import {
    MdArrowOutward
} from 'react-icons/md';

const GET_RESULTS = gql`
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
  	    data {
		id
		attributes {
		    title
		    snippet
		    link
		    publication_info {
			summary
		    }
		}
	    }
	}
    }
`

export default () => {
    const {id} = useParams();
    const [query, setQuery] = useState('');
    const {
	control,
	handleSubmit,
	getValues,
	reset
    } = useForm<any>({
	defaultValues: {
	    query: '',
	    //year_min: 2023,
	    //year_max: 2023
	}
    });

    const {
	loading: results_loading,
	error: results_error,
	data: results_data,
	refetch: results_refetch,
	fetchMore: results_fetchMore
    } = useQuery(GET_RESULTS, {
	variables: {
	    search_id: id,
	    query: query
	}
    });
    
    if(results_loading || results_data === undefined){
	return (
	    <SkeletonText />
	);
    }

    const onSubmit = handleSubmit((data) => {
	setQuery(data.query);
    });
    
    return (
	<>
	    <form onSubmit={onSubmit}>
		<HStack align='flex-end' mb={4}>
		    <InputComponent
			control={control}
			type='text'
			name='query'
			placeholder='filter results'
		    />
		    <Button colorScheme='green' type='submit'>
			filter
		    </Button>
		</HStack>
	    </form>
	    <Info id={id} query={query}/>
	    {
	    results_data.results.data.map((result) =>
		<Box key={result.id} mt={8}>
		    <Text fontSize='xl'>
			{result.attributes.title}
		    </Text>
		    <Box ml={8}>
			<Text mb={2}>
			    {result.attributes.publication_info.summary}
			</Text>
			<Text>
			    {result.attributes.snippet}
			</Text>
			<Link href={result.attributes.link} isExternal>
			    <Button
				colorScheme='green'
				leftIcon={<Icon as={MdArrowOutward} />}
			    >
				read
			    </Button>
			</Link>
		    </Box>
		</Box>
	    )
	    }
	    
	</>
    );
}
