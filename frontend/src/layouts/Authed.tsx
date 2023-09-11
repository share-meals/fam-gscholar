import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Link as ChakraLink,
    Spacer,
} from '@chakra-ui/react';

import {Link as ReactRouterLink} from 'react-router-dom';
import {useAuth} from '../context/auth';
import {useLocation} from 'react-router-dom';

const NavButton = ({
    label,
    path
}) => {
    return (
	<ChakraLink as={ReactRouterLink} to={path}>
	    <Button
		colorScheme={location.pathname.startsWith(path) ? 'green' : 'black'}
		variant={location.pathname.startsWith(path) ? 'solid' : 'outline'}>
		{label}
	    </Button>
	</ChakraLink>
    );
}

const header_pages = {
    '/home': 'Home',
    '/searches': 'Searches',
    '/run': 'Run Search'
};

const internal_pages = {
    '/searches/add': 'Add Search'
};

export default ({children}) => {
    const location = useLocation();
    const {logout} = useAuth();
    return <>
	<Box bg='lightBlue' position='fixed' width='100%' top={0} p={4}>
	    <HStack>
		{Object.keys(header_pages).map((path, index) => <NavButton key={path} path={path} label={header_pages[path]} />)}
		<Spacer />
		<Button onClick={logout}>
		    Logout
		</Button>
	    </HStack>
	</Box>
	<Container my='8rem'>
	    <Heading mb={4}>
		{header_pages[location.pathname] || internal_pages[location.pathname]}
	    </Heading>
	    {children}
	</Container>
    </>;
}
