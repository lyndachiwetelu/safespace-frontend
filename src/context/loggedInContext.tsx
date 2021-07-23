import { createContext } from "react";
const loggedInContext = createContext<boolean | null>(null);

export { loggedInContext };