import { Button, Col, Form, Input, Layout, Row} from "antd";
import moment from "moment";
import Peer from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import FullLayout from "../../components/Layout/FullLayout";
import MessageBubble from "../../components/MessageBubble/MessageBubble";
import './Session.css'

const Session = () => {
    const history = useHistory();
    const { Header } = Layout
    const { id: sessionId }: {id:any } = useParams()
    const urlArray = process.env.REACT_APP_API_URL?.split(':')
    const host = urlArray?.[1] || '';
    const divRef: any = useRef()
    const messagesEndRef: any = useRef()
    const [messages, setMessages]: [messages: Array<any>, setMessages: Function] = useState([])
    const [cPeer, setCPeer]: [any, Function] = useState(null)
    const [message, setMessage]: [any, Function] = useState('')
    const [form] = Form.useForm()

    const serverPort = parseInt(process.env.REACT_APP_SERVER_PORT || '') || 8000
    const userId = sessionStorage.getItem('userId') || ''

    const setUpHostConnection = useCallback( () => {
        const clientConnections: Array<any> = []
        const hostPeer = new Peer(`session-${sessionId}-chat`, {
            debug: 3,
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
            debug: 3,
            host,
            port: serverPort,
            path: '/chat'
        });
    
        peer.on('open', (id) => {
            const conn = peer.connect(`session-${sessionId}-chat`);
            conn.on('open', () => {
                setCPeer(conn)
            });
            conn.on('data', (data:any) => {
               setMessages((messages:Array<any>) => {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
                return [...messages, data]
               })
            })
        });
    }, [host, serverPort, userId, sessionId])

    useEffect(() => {
        setUpHostConnection()
        setUpClientConnection()
    }, [setUpClientConnection, setUpHostConnection, history.location.pathname])

    const sendMessage = () => {
        if (message && cPeer) {
            cPeer.send({message, userId, key: moment().format('x') + userId})
        }
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        form.setFieldsValue({message: ''})
    }

    return (
        <FullLayout>
            <Row className="Session">
                <Col span={6}></Col>
                <Col span={18} className="Session__Col--Messages">
                    <Header className="Session__Col__Header">
                        <p>Status: Active Session</p>
                        <p>Time Used: 15 Minutes </p>
                        <p>Time Remaining: 30 Minutes </p>
                    </Header>
                    <div ref={divRef} className="Session__Col__MessageList">
                        { messages.map((message:any) => {
                            return <MessageBubble type={message.userId !== userId ? 'other': 'same'} message={message.message} key={message.key}/>
                        })}
                        <div ref={messagesEndRef} style={{marginBottom:'80px'}}></div>
                    </div>
                    <Form form={form} layout="inline" className="Session__Form" >
                        <Form.Item name='message' style={{ width: "60%" }}>
                        <Input size="large" value={message} onChange={(e) => {
                                setMessage(e.target.value)
                            }
                            } />
                        </Form.Item>

                        <Form.Item>
                            <Button size="large" className="Session__Form__Button" htmlType='submit' onClick={() => sendMessage()}>Send Message</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            
        </FullLayout>
    );
}

export default Session