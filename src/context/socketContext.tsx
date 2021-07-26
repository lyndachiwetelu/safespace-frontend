import { createContext } from "react";
import { io } from "socket.io-client";
const serverUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const socketIOClient = io(serverUrl);

const socketContext = createContext(socketIOClient);

export default socketContext;
