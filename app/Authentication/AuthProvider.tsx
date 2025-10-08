import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BASE_URL } from '../admin_page/newfileloader';

// It was created to prevent break session by reloading,  

type User = {
    id: string;
  name: string;
  email: string;
  role: string;
} | null;

type AuthContextType ={
    authToken: string | null;
    userRole: string | null;
    user: User;
    isLoggedIn: boolean;
    login: (token: string, role: string, user:NonNullable<User>) => Promise<void>;
    logout: () => Promise<void>;
};


export const AuthContext = createContext <AuthContextType>({
    authToken: null,
    userRole: null,
    user: null,
    isLoggedIn: false,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({children} : {children:ReactNode}) => {

    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

   // Load from AsyncStorage on app start 
useEffect( () => {

    const loadstorage = async () => {
        
        try{
            const token = await AsyncStorage.getItem("authToken");
            const role = await AsyncStorage.getItem("userRole");
            const storedUser = await AsyncStorage.getItem("user");

            if (token) setAuthToken(token);
            if (storedUser) setUser(JSON.parse(storedUser));
            if (role) setUserRole(role);
        }
        catch(err){
            console.error("Error loading auth data:", err);
        }finally{
            setLoading(false);
        }
    };

//If the token is expired, it automatically carrys out log out.
    const checkToken = async() => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        // Token invalid or expired → auto logout
        await logout();
      }
    } catch (err) {
      console.warn("Auth check failed:", err);
    }
    };


        checkToken();
    loadstorage();
}, []);

// even if the app reloaded, the token is still valid.
    const login = async (token: string, role:string, userData: NonNullable<User>) => {


        try{
        
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userRole", role);
        await AsyncStorage.setItem("user", JSON.stringify(userData));

 // Also save individual items for convenience if needed later
    await AsyncStorage.setItem("userId", userData.id.toString());
    await AsyncStorage.setItem("userName", userData.name);
    await AsyncStorage.setItem("userEmail", userData.email);


        setAuthToken(token);
        setUserRole(role);
        setUser(userData);
        } catch(err){
            console.error("Error saving login data:", err);
        }

    };

    const logout = async () => {
        await AsyncStorage.multiRemove(["authToken", "userRole", "user"]);
        setAuthToken(null);
        setUserRole(null);
         setUser(null);
    };


    return(
        <AuthContext.Provider
        value={{
            authToken,
            user,
            userRole,
            isLoggedIn: !!authToken,
            login,
            logout,
        }}
        >
            {!loading && children}
        </AuthContext.Provider>

    );

};


export const useAuth = () => useContext(AuthContext);


// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if(!context) throw new Error("useAuth must be used inside AuthProvider");
//     return context;
// };


