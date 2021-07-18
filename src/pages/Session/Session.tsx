import { Button, Form, Input} from "antd";
import Peer from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FullLayout from "../../components/Layout/FullLayout";
import './Session.css'

const Session = () => {
    const { id: sessionId }: {id:any } = useParams()
    const urlArray = process.env.REACT_APP_API_URL?.split(':')
    const host = urlArray?.[1] || '';
    const divRef: any = useRef()
    const [messages, setMessages]: [messages: Array<any>, setMessages: Function] = useState([])
    const [cPeer, setCPeer]: [any, Function] = useState(null)
    const [message, setMessage]: [any, Function] = useState('')

    const serverPort = parseInt(process.env.REACT_APP_SERVER_PORT || '') || 8000
    const userId = sessionStorage.getItem('userId') || ''

    const setUpHostConnection = useCallback( () => {
        const clientConnections: Array<any> = []
        const hostPeer = new Peer(`session-${sessionId}-chat`, {
            host,
            port: serverPort,
            path: '/chat'
        });

        hostPeer.on('connection', function(conn) {
            clientConnections.push(conn);
            conn.on('data', (data:any) => { 
                clientConnections.forEach((clientConn:any) => {
                    clientConn.send(data);

                })
            })
        });
    }, [host, serverPort, sessionId])

    const setUpClientConnection = useCallback( () => {
        const peer = new Peer(userId, {
            host,
            port: serverPort,
            path: '/chat'
        });
    
        peer.on('open', function(id) {
            const conn = peer.connect(`session-${sessionId}-chat`);
            conn.on('open', () => {
                setCPeer(conn)
            });
            conn.on('data', (data:any) => {
               setMessages((messages:Array<any>) => {
                return [...messages, data]
               })
            })
        });
    }, [host, serverPort, userId, sessionId])

    useEffect(() => {
        setUpHostConnection()
        setUpClientConnection()
    }, [setUpClientConnection, setUpHostConnection])

    const sendMessage = () => {
        console.log(`Sending message: ${message}`)
        if (message) {
            cPeer.send(message)
        }
     }

    return (
        <FullLayout>
            <h1>Session</h1>
            <div ref={divRef}>
                <h1>Messages</h1>
                { messages.map((message:any) => {
                    return <p key={message}> {message}</p>
                })}
            </div>
            <Form>
                <Form.Item label='Add a Message' name='message'>
                    <Input value={message} onChange={(e) => {
                        setMessage(e.target.value)
                    }
                    }>
                    </Input>
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit' onClick={() => sendMessage()}>Send</Button>
                </Form.Item>
            </Form>
        </FullLayout>
    );
}

export default Session