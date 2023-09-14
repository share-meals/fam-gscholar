import {
    Route,
    BrowserRouter as Router,
    Navigate,
    Routes
} from 'react-router-dom';
import Home from '@/Home';
import Login from '@/Login';
import Run from '@/Run';
import Search from '@/Searches/Single';
import SearchesManage from '@/Searches/Manage';
import SearchesAdd from '@/Searches/Add';
import AuthedLayout from '@/layouts/Authed';
import UnauthedLayout from '@/layouts/Unauthed';
import {useAuth} from '@/context/auth';

export default () => {
    const {jwt} = useAuth();
    const isLoggedIn = jwt !== null && jwt !== 'null'; // need to check against string because of the way localStorage works?
    return(
	<Router>
	    {!isLoggedIn &&
	     <UnauthedLayout>
		 <Routes>
		     <Route path='/login' exact element={<Login />} />
		     <Route path='*' element={<Navigate to='/login' replace />} />
		 </Routes>
	     </UnauthedLayout>
	    }
	    {isLoggedIn &&
	     <AuthedLayout>
		 <Routes>
		     <Route path='/' exact element={<Home />} />
		     <Route path='/run' exact element={<Run />} />
		     <Route path='/searches' exact element={<SearchesManage />} />
		     <Route path='/searches/:id' exact element={<Search />} />
		     <Route path='/searches/add' exact element={<SearchesAdd />} />
		     <Route path='*' element={<Navigate to='/' replace />} />
		 </Routes>
	     </AuthedLayout>
	    }
	</Router>
    );
}
