import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    Stack,
    Text
} from '@chakra-ui/react';
import {InputComponent} from '@sharemeals/frg-react';
import {
    FieldValues,
    useForm
} from 'react-hook-form';
import {
    gql,
    useMutation
} from '@apollo/client';
import {useAuth} from './context/auth';

const LOGIN_USER = gql`
    mutation LoginUser(
	$email: String!
	$password: String!
    ) {
	login(
	    input: {
		identifier: $email,
		password: $password
	    }
	) {
	    jwt
	}
    }
`;


export default () => {
    const {control, handleSubmit} = useForm<any>({
	defaultValues: {
	    email: 'jon@sharebyteaching.org',
	    password: 'ragnorakX1'
	}
    });
    const [loginUser, {
	data,
	error,
	loading,
    }] = useMutation(LOGIN_USER);
    const {login} = useAuth();
    const onSubmit = handleSubmit(async (data) => {
	loginUser({
	    variables: data
	});
    });

    if(data){
	login(data.login.jwt);
    }
    return (
	<>
	    <form onSubmit={onSubmit}>
		<Stack>
		    <InputComponent
		    control={control}
		    type='text'
		    label='Email'
			name='email'
		    disabled={loading}
		    />
		    <InputComponent
		    control={control}
		    type='password'
		    label='Password'
			name='password'
		    disabled={loading}
		    />
		    <Button
			colorScheme='green'
			isLoading={loading}
			type='submit'>
			Login
		    </Button>
		    {error &&
		     <Alert status='error'>
			 <AlertIcon />
			 <AlertTitle>Error</AlertTitle>
			 <AlertDescription>{error.graphQLErrors.map(e => <Text>{e.message}</Text>)}</AlertDescription>
		     </Alert>
	    }
		</Stack>
	    </form>
	</>
    );
};
