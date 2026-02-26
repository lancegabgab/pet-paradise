import { createContext } from "react";

//for sharing data across components
const UserContext = createContext();

//provides data to other components
export const UserProvider = UserContext.Provider;

export default UserContext;
