import {
    Container,
    Heading
} from '@chakra-ui/react';
import {useLocation} from 'react-router-dom';

const header_pages = {
    '/login': 'Login',
};

const internal_pages = {
    '/login': 'Login',
};


export default ({children}) => {
    const location = useLocation();
    return (
	<>
	    <Container my='8rem'>
		<Heading mb={4}>
		    {header_pages[location.pathname] || internal_pages[location.pathname]}
		</Heading>
		{children}
	    </Container>
	</>
    )
}
