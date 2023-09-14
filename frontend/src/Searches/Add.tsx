import {InputComponent} from '@sharemeals/frg-react';
import {
    Button,
    Stack,
    useToast
} from '@chakra-ui/react';
import {
    FieldValues,
    useForm
} from 'react-hook-form';
import {
    gql,
    useMutation
} from '@apollo/client';

const CREATE_SEARCH = gql`
    mutation CreateSearch(
	$query: String!
	$year_min: Int
	$year_max: Int
    ) {
	createSearch(
	    data: {
		query: $query
		year_min: $year_min
		year_max: $year_max
	    }
	) {
	    data {
		attributes {
		    query
		    year_min
		    year_max
		}
	    }
	}
    }
`

export default () => {
    const toast = useToast();
    const {
	control,
	handleSubmit,
	reset
    } = useForm<any>({
	defaultValues: {
	    query: '',
	    year_min: '',
	    year_max: ''
	}
    });

    const [createSearch, {
	data,
	error,
	loading,
    }] = useMutation(CREATE_SEARCH);
    const onSubmit = handleSubmit(async (data) => {
	createSearch({
	    variables: {
		query: data.query,
		year_min: data.year_min !== '' ? parseInt(data.year_min) : undefined,
		year_max: data.year_max !== '' ? parseInt(data.year_max) : undefined
	    }
	});
	toast({
	    title: 'Success',
	    description: 'Search created',
	    status: 'success'
	});
	reset();
    });
    return(
	<>
	    <form onSubmit={onSubmit}>
		<Stack>
		<InputComponent
		control={control}
		type='text'
		label='Query'
		name='query'
		placeholder='comma separated list of keywords'
		/>
		<InputComponent
		control={control}
		type='number'
		label='Starting Year'
		name='year_min'
		/>
		<InputComponent
		control={control}
		type='text'
		label='Ending Year'
		name='year_max'
		/>
		<Button
		    colorScheme='green'
		    type='submit'>
		    Go
		</Button>
		</Stack>
	    </form>
	</>
    );
}
