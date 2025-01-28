import { useContext, useState, useEffect, createContext } from "react";
import { account } from "../appwriteConfig";


const AuthContext = createContext();


export const AuthProvider = ({children}) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(false);

    useEffect(() => {
        checkUserStatus();
  
    }, []);

    const loginUser = async (userInfo) => {
        setLoading(true);

        console.log('USERINFO', userInfo);

        try {
            let response = await account.createEmailPasswordSession(
                userInfo.email,
                userInfo.password
            )
            let accountDetails = await account.get();

            console.log('accountDetails', accountDetails);
            setUser(accountDetails);
            
        }catch(error){
            console.log(error);
        }

        setLoading(false);
    };

    const logoutUser = () => {
        account.deleteSession('current');
        setUser(null);
    };

    const regsterUser = (userInfo) => {};

    const checkUserStatus = async () => {

        try {
            let accountDetails = account.get();
            setUser(accountDetails);
        }catch(error){
            console.log(error);
        }

        setLoading(false);  
    };

    const contextData = {
        user,
        loginUser,
        logoutUser,
        regsterUser
    }
    
    return(
    <AuthContext.Provider value={contextData}>
        {loading ? <p>Loading...</p> : children}

    </AuthContext.Provider>
    )
};

export const useAuth = () => {return useContext(AuthContext)};
export default AuthContext;