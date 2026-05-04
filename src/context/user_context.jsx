// context/user_context.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useUser as useClerkUser, useAuth as useClerkAuth } from "@clerk/react";
import { FetchProfileData } from "../services/Auth/Auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isSignedIn, isLoaded } = useClerkUser();

  const [user_details, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const { getToken } = useClerkAuth();

  const fetchUser = async () => {
    const token = await getToken()
    const res = await FetchProfileData(token);

    if (res.success) {
      setUser(res.data);
      setIsRegistered(true);
    } else {
      setUser(null);
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setIsRegistered(false);
      setIsLoading(false);
      return;
    }

    // signed in → fetch backend user
    fetchUser().finally(() => setIsLoading(false));
  }, [isLoaded, isSignedIn]);

  return (
    <UserContext.Provider
      value={{ user_details, isLoading, isRegistered, isSignedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);