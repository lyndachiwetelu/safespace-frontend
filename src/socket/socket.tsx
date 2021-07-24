import { io } from "socket.io-client";
const serverUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const urlArray = serverUrl?.split(':')
const host = urlArray?.[1] || '';
const socketIOClient = io(host + ':' + urlArray?.[2]);

export default socketIOClient;