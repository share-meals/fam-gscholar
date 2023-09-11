import {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [jwt, setJwt] = useState(null);
    if(localStorage.getItem('jwt') !== null && jwt === null){
	setJwt(localStorage.getItem('jwt'));
    }
    const value = useMemo(
	() => ({
	    login: (newJwt) => {
		setJwt(newJwt);
		localStorage.setItem('jwt', newJwt);
	    },
	    logout: () => {
		localStorage.setItem('jwt', null);
	    },
	    isLoggedIn: localStorage.getItem('jwt') !== null,
	    jwt
	}),
	[jwt, setJwt]
    );
    
    return <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext);
};
