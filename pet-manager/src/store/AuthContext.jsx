import { useContext, useState, useEffect, createContext } from "react";
import { account } from "../appwriteConfig";
import { ID } from "appwrite";

import { toast, Zoom, Bounce } from "react-toastify";


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
            toast("Welcome Back! <3", {position:'top-center', theme:'colored', closeOnClick: true, transition: Zoom, autoClose: 2000, hideProgressBar: true, theme: "dark"})

        } catch (error) {
            toast.error("Error logging in!", {position:'top-center', hideProgressBar: true, theme:'colored', closeOnClick: true, transition: Bounce, className: "text-center"})
      set({ loading: false });
            console.log("Login error:", error.message);
        }

        setLoading(false);
    };

    const logoutUser = async () => {
        setLoading(true);
        try {
            await account.deleteSession("current");
            setUser(null);
            toast("We will miss you!", {position:'top-center', theme:'colored', closeOnClick: true, transition: Zoom, autoClose: 2000, hideProgressBar: true, theme: "dark"})
            
        } catch (error) {
            console.log("Logout error:", error.message);
            toast.error("Error logging out", {position:'top-center', hideProgressBar: true, theme:'colored', closeOnClick: true, transition: Bounce})
      set({ loading: false });
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
            toast.success("Account created!", {position:'top-center', theme:'colored', closeOnClick: true, transition: Flip, autoClose: 2000, hideProgressBar: true})

        } catch (error) {
            toast.error("Error regestering!", {position:'top-center', hideProgressBar: true, theme:'colored', closeOnClick: true, transition: Bounce})
      set({ loading: false });
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
            toast.error("User is not logged in", {position:'top-center', hideProgressBar: true, theme:'colored', closeOnClick: true, transition: Bounce})
      set({ loading: false });
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
            {loading ? <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars loading-xl"></span>
            </div> : children}

        </AuthContext.Provider>
    )
};

export const useAuth = () => { return useContext(AuthContext) };
export default AuthContext;