import {
    Box,
    Button,
    Flex,
    Link as ChakraLink,
    Spacer
} from '@chakra-ui/react';
import {
    AddIcon
} from '@chakra-ui/icons';
import {Link as ReactRouterLink} from 'react-router-dom';

import ExistingSearches from './Existing';
//import AddSearch from './Add';

export default () => {
    return <>
	<Flex mb={4}>
	    <Spacer />
	    <ChakraLink as={ReactRouterLink} to='/searches/add'>
		<Button
		    colorScheme='green'
		    leftIcon={<AddIcon />}
		    variant='outline'>
		    Add New Search
		</Button>
	    </ChakraLink>
	</Flex>
	<Box borderWidth='1px' p={4}>
	    <ExistingSearches />
	</Box>
    </>;
}
