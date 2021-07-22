import { Button, Col, Form, Input, Layout, Row, Spin} from "antd";
import moment from "moment";
import Peer from "peerjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FullLayout from "../../components/Layout/FullLayout";
import MessageBubble from "../../components/MessageBubble/MessageBubble";
import './Session.css'
import telephoneImg from '../../images/telephone.png'
import videoImg from '../../images/video.png'
import avatar1 from '../../images/avatar1.png'
import avatar2 from '../../images/avatar2.png'
import avatar3 from '../../images/avatar3.png'
import avatar4 from '../../images/avatar4.png'
import axios from "axios";
import { io } from "socket.io-client";


const serverUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const urlArray = serverUrl?.split(':')
const host = urlArray?.[1] || '';
const socketIOClient = io(host+':'+urlArray?.[2]);

const Session = () => {
    const { Header } = Layout
    const { id: sessionId }: {id:any } = useParams()
   
    const CHAT_ROOM = `session-${sessionId}-chat`
    const divRef: any = useRef()
    const messagesEndRef: any = useRef()
    const [form] = Form.useForm()
    const [avatars] = useState([avatar1, avatar2, avatar3, avatar4])

    const [messages, setMessages]: [messages: Array<any>, setMessages: Function] = useState([])
    const [message, setMessage]: [any, Function] = useState('')
    const [loading, setLoading]: [any, Function] = useState(true)
    const [peer, setPeer]: [any, Function] = useState(null)
    const [userSessions, setUserSessions]: [Array<any>, Function] = useState([])
    const [userSettings, setUserSettings]: [any , Function] = useState({ailments: [], media: [], hasHadTherapy: false, religiousTherapy: ''})


    const serverPort = parseInt(process.env.REACT_APP_SERVER_PORT || '') || 8000
    const userId = sessionStorage.getItem('userId') || ''

    const [connectedUsers, setConnectedUsers]: [Array<any>, Function] = useState([])
    const [connectTo, setConnectTo]: [Array<any>, Function] = useState([])

    const getSessionDetails = useCallback( async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/sessions/${sessionId}`, {withCredentials:true})
            if (response.status === 200) {
                const theUserId = response.data.requestedBy
                const therapistId = response.data.therapist
                let sessionsUrl
                let settingsUrl
                
                if (parseInt(userId) === theUserId) {
                    sessionsUrl = `${process.env.REACT_APP_API_URL}/api/v1/sessions/therapist/${therapistId}?userId=${theUserId}`
                    settingsUrl = `${process.env.REACT_APP_API_URL}/api/v1/therapists/${therapistId}/settings`
                } else {
                    sessionsUrl = `${process.env.REACT_APP_API_URL}/api/v1/sessions/patient/${theUserId}?therapist=${therapistId}`
                    settingsUrl = `${process.env.REACT_APP_API_URL}/api/v1/users/${theUserId}/settings`

                }
                const resp = await axios.get(sessionsUrl, {withCredentials: true})
                if (resp.status === 200) {
                    setUserSessions(resp.data)
                    const res = await axios.get(settingsUrl, {withCredentials: true})
                    if (res.status === 200) {
                        setUserSettings(res.data)
                    }

                }
            }
        } catch (err) {
            // TODO: handle error
        }
    }, [sessionId, userId])


    const updateConnectedUsers = (conn:any) => {
        setConnectedUsers((users:any) => {
            return [...users, conn]
        })
    }

    const updateMessages= (message:any) => {
        setMessages((theMessages:any) => {
            return [...theMessages, message]
        })
    }

    useEffect(() => {
        getSessionDetails()
    }, [])

    useEffect(() => {
        const peer = new Peer(`${userId}${moment().format('x')}`, {
            debug: 1,
            host,
            port: serverPort,
            path: '/chat'
        });

        peer.on('open', (id) => {
            setPeer(peer)
            socketIOClient.emit('join-room', CHAT_ROOM, id, userSettings.name)
        })

        peer.on('connection', (conn: any) => {    
            setLoading(false)
            updateConnectedUsers(conn)
            conn.on('data', (data:any) => {
                updateMessages(data)
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            });

        })  

    }, [])

    useEffect(() => {
        socketIOClient.on("user-connected", (user:any, roomId: any, username: string) => {
            updateMessages({message:`${username} joined!`, key: moment().format('x'), type: 'notification-joined'})
            setConnectTo((connectTo:any) => [...connectTo, user])
        });
    }, [])

    useEffect(() => {
        if (!peer) {
            return
        }

        const newConnectTo = connectTo
        newConnectTo.forEach((id:any, index:number) => {
            const conn = peer.connect(id, {metadata: { name: userSettings.name, id: userId}});
            conn.on('open', () => {
                setLoading(false)
                setConnectedUsers((connectedUsers:any) => [...connectedUsers, conn])
            });

            conn.on('data', (data:any) => {
                updateMessages(data)
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            })

            delete newConnectTo[index]
        })

        setConnectTo(newConnectTo)
    }, [connectTo, peer])

    const sendMessage = () => {
        if (message && connectedUsers) {
            const theMessage = {message, userId, key: moment().format('x') + userId}
            connectedUsers.forEach((user:any) => {
               user.send(theMessage)
            })
            updateMessages(theMessage)
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        form.setFieldsValue({message: ''})
    }

    const capitalize = (str:string) => {
        if (typeof str === 'string' && str.length > 0) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
        return str
    }

   const getRandomAvatar = useMemo(() => {
        return avatars[Math.floor(Math.random() * avatars.length)]
   }, [avatars])

    const countSessions = (type: string): number => {
        switch (type) {
            case 'upcoming':
                return userSessions.filter((session:any) => session.status === 'confirmed' && moment(session.day).diff(moment().format('YYYY-MM-DD'), 'days') > 0).length
            case 'past':
                return userSessions.filter((session:any) => moment(session.day).diff(moment().format('YYYY-MM-DD'), 'days') <= 0).length
            case 'cancelled':
                return userSessions.filter((session:any) => session.status === 'cancelled)').length
                default:
                    return 0
     }
    }

    return (
        <Spin spinning={loading} tip={`Waiting for ${userSettings.name} to join the session`}>
        <FullLayout>
            <Row className="Session">
                <Col span={6} className="Session__Col--UserData">
                    <img src={userSettings.imageUrl || getRandomAvatar} alt="user" />
                    <h3>{userSettings.name} ({userSettings.age || `${userSettings.ageFrom} - ${userSettings.ageTo} yrs`})</h3>
                    <div className="Media">
                        <img src={telephoneImg} alt="telephone" />
                        <img src={videoImg} alt="video" />
                    </div>
                    <h4>{countSessions('upcoming')} Upcoming Sessions</h4>
                    <h4 style={{color: 'green'}}>{countSessions('past')} Completed Sessions</h4>
                    <h4 style={{color: 'red'}}>{countSessions('cancelled')} Cancelled Sessions</h4>

                    <h3 style={{textTransform: 'capitalize'}}>About {userSettings.name}</h3>
                    <p>{userSettings?.ailments.map((ailment:any) => ailment.name).join(', ')}</p>
                    <p>Accepts {userSettings?.media.map((medium:any) => medium.name).join(', ')}</p> 
                    <p>{userSettings.hasHadTherapy ? 'Been in Therapy before': null}</p>
    <p>{userSettings.religiousTherapy !== 'none' ? capitalize(userSettings.religiousTherapy) : 'No'} Religion Based Therapy</p>
                    
                   
                </Col>
                <Col span={18} className="Session__Col--Messages">
                    <Header className="Session__Col__Header">
                        <p>Status: Active Session</p>
                        <p>Time Used: 15 Minutes </p>
                        <p>Time Remaining: 30 Minutes </p>
                    </Header>
                    <div ref={divRef} className="Session__Col__MessageList">
                        { messages.map((theMessage:any) => {
                            return <MessageBubble type={theMessage.userId !== userId ? 'other': 'same'} message={theMessage.message} key={theMessage.key} messageType={theMessage.type}/>
                        })}
                        <div ref={messagesEndRef} style={{marginBottom:'80px'}}></div>
                    </div>
                    <Form form={form} layout="inline" className="Session__Form" >
                        <Form.Item name='message' style={{ width: "60%" }}>
                        <Input size="large" value={message} onChange={(e) => {
                                setMessage(e.target.value)
                            }
                            } disabled={connectedUsers.length < 1}/>
                        </Form.Item>

                        <Form.Item>
                            <Button size="large" className="Session__Form__Button" htmlType='submit' onClick={() => sendMessage()}>Send Message</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            
        </FullLayout>
        </Spin>
    );
}

export default Session