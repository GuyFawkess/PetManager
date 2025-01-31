import { useContext, useState, useEffect, createContext } from "react";
import { account } from "../appwriteConfig";
import { ID } from "appwrite";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(false);

    useEffect(() => {
        checkUserStatus();

    }, []);

    const loginUser = async (userInfo) => {
        setLoading(true);

        try {
            let response = await account.createEmailPasswordSession(
                userInfo.email,
                userInfo.password
            )
            let accountDetails = await account.get();
            setUser(accountDetails);

        } catch (error) {
            console.log("Login error:", error.message);
        }

        setLoading(false);
    };

    const logoutUser = async () => {
        setLoading(true);
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            console.log("Logout error:", error.message);
        }
        setLoading(false);
    };

    const registerUser = async (userInfo) => {
        setLoading(true);

        try {
            let response = await account.create(
                ID.unique(),
                userInfo.email,
                userInfo.password1,
                userInfo.name
            )
            console.log("✅ User registered:", response);


            await account.createEmailPasswordSession(
                userInfo.email,
                userInfo.password1
            )
            let accountDetails = await account.get();
            setUser(accountDetails);

        } catch (error) {
            console.log("Registration error:", error.message);
        }

        setLoading(false);
    };

    const checkUserStatus = async () => {
        setLoading(true);
        try {
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {
            console.log("User is not logged in:", error.message);
            setUser(null);
        }

        setLoading(false);
    };

    const contextData = {
        user,
        loginUser,
        logoutUser,
        registerUser
    }

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}

        </AuthContext.Provider>
    )
};

export const useAuth = () => { return useContext(AuthContext) };
export default AuthContext;