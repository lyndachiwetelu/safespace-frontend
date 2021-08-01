import { Button, Col, Form, Input, Layout, Row, Spin, Modal, message as Antmessage} from "antd";
import moment from "moment";
import Peer from "peerjs";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PhoneOutlined } from '@ant-design/icons';
import { useHistory, useLocation, useParams } from "react-router-dom";
import FullLayout from "../../components/Layout/FullLayout";
import MessageBubble from "../../components/MessageBubble/MessageBubble";
import './Session.css'
import telephoneImg from '../../images/telephone.png'
import videoImg from '../../images/video.png'
import chatImg from '../../images/chat.png'
import avatar1 from '../../images/avatar1.png'
import avatar2 from '../../images/avatar2.png'
import avatar3 from '../../images/avatar3.png'
import avatar4 from '../../images/avatar4.png'
import axios from "axios";
import socketContext from "../../context/socketContext";
import VideoPanel from "../../components/VideoPanel/VideoPanel";
import VoicePanel from "../../components/VoicePanel/VoicePanel";

const serverUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const urlArray = serverUrl?.split(':')
const host = urlArray?.[1] || '';

const Session = () => {
    const socketIOClient = useContext(socketContext);
    const { Header } = Layout
    const { id: sessionId }: {id:any } = useParams()
    const history = useHistory()
    const CHAT_ROOM = `session-${sessionId}-chat`
    const divRef: any = useRef()
    const inputRef: any = useRef()
    const messagesEndRef: any = useRef()
    const [form] = Form.useForm()
    const [avatars] = useState([avatar1, avatar2, avatar3, avatar4])

    const [messages, setMessages]: [messages: Array<any>, setMessages: Function] = useState([])
    const [message, setMessage]: [any, Function] = useState('')
    const [loading, setLoading]: [any, Function] = useState(true)
    const [activePeer, setActivePeer]: [any, Function] = useState(null)
    const [userSessions, setUserSessions]: [Array<any>, Function] = useState([])
    const [userSettings, setUserSettings]: [any , Function] = useState({ailments: [], media: [], hasHadTherapy: false, religiousTherapy: ''})
    const { state } :  { state: any } = useLocation()

    const userId = sessionStorage.getItem('userId') || ''
    const isTherapist = sessionStorage.getItem('isTherapist') || ''

    const [connectedUsers, setConnectedUsers]: [Array<any>, Function] = useState([])
    const [connectTo, setConnectTo]: [Array<any>, Function] = useState([])
    const [activeVideoCall, setActiveVideoCall]: [boolean, Function] = useState(false)
    const [activeVoiceCall, setActiveVoiceCall]: [boolean, Function] = useState(false)
    const [videoStreamList, setVideoStreamList]: [Array<any>, Function] = useState([])
    const [audioStreamList, setAudioStreamList]: [Array<any>, Function] = useState([])
   

    const { confirm } = Modal;

    let loginUrl: string = '/login'
    if (isTherapist === 'true') {
        loginUrl = '/therapists/login'
    }

    const endVideoCall = () => {
        if (activeVideoCall) {
            socketIOClient.emit('user-left-video-call', {
                sessionId: sessionId,
                userId: userId,
                room: CHAT_ROOM
            })
            setActiveVideoCall(false)
        }
    }

    const leaveVoiceCall = () => {
        if (activeVoiceCall) {
            socketIOClient.emit('user-left-voice-call', {
                sessionId: sessionId,
                userId: userId,
                room: CHAT_ROOM
            })
            setActiveVoiceCall(false)
        }
    } 

    const callUser = async (user:any, audioOnly:boolean) => {
        const mediaDevices: MediaDevices = navigator.mediaDevices
        const getUserMedia:any = mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        
        try {
            const stream = await getUserMedia({video: !audioOnly ? { width: 938, height: 536 } : false, audio: {
                mandatory: {
                    googEchoCancellation: false,
                    googAutoGainControl: false,
                    googNoiseSuppression: false,
                    googHighpassFilter: false
                },
                optional: []
            }})
            
            const call = activePeer.call(user.peer, stream, {metadata: {audioOnly}});
            if (!call) {
                return
            }
            call.on('stream', function(remoteStream:any) {
                setLoading(false)
                if (audioOnly) {
                    setActiveVoiceCall(true)  
                    setAudioStreamList([{stream:remoteStream}, {stream}])
                } else {
                     //remote stream is callee video
                    setActiveVideoCall(true)
                    setVideoStreamList([{stream:remoteStream, type:'other'}, {stream, type:'activeUser'}])
                }
            });
        } catch (err) {
            console.log(err)
            Antmessage.error('You are not able to make a call')
        }
    }

    const filterUniqueConnectedUsersByIdPrefix = (connectedUsers: Array<any>) => {
        const filteredConnectedUsers: any = []
        const connectedUsersMap: any = {}
        connectedUsers.forEach(user => {
            const id: number = user.peer.substring(0, user.peer.indexOf('-'))
            if (!connectedUsersMap[id]) {
                connectedUsersMap[id] = true
                filteredConnectedUsers.push(user)
            }
        })

        return filteredConnectedUsers
    }

    const callConnectedUsersOrAnswerCall = (audioOnly:boolean = false) => {
        setLoading(true)
        const filteredConnectedUsers = filterUniqueConnectedUsersByIdPrefix(connectedUsers)
        filteredConnectedUsers.forEach((user: any) => {
            callUser(user, audioOnly)
        })
    }

    
    const getSessionDetails = useCallback( async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/sessions/${sessionId}`, {withCredentials:true})
            if (response.status === 200) {
                const theUserId = response.data.requestedBy
                const therapistId = response.data.therapist

                if ([theUserId, therapistId].indexOf(parseInt(userId)) === -1) {
                    history.push('/home')
                }
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
            history.push(loginUrl)
        }
    }, [sessionId, userId, history, loginUrl])


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
    }, [getSessionDetails])

    const receiveCall = useCallback(async (getUserMedia:any, call:any) => {

        try {
            const stream = await getUserMedia({ video: !call.metadata.audioOnly ? { width: 938, height: 536 } : false, audio: {
                mandatory: {
                    googEchoCancellation: false,
                    googAutoGainControl: false,
                    googNoiseSuppression: false,
                    googHighpassFilter: false
                },
                optional: []
            }
        })
            call.answer(stream); 
            call.on('stream', function(remoteStream:any) {
                if (call.metadata.audioOnly) {
                    setActiveVoiceCall(true)
                    setAudioStreamList([{stream:remoteStream}, {stream}])
                } else {
                    setActiveVideoCall(true)  
                    setVideoStreamList([{stream:remoteStream, type:'other'}, {stream, type:'activeUser'}])

                }
            });

        } catch (err) {
            console.log(err)
            Antmessage.error('You are not able to make a call')
        }
    }, [])


    const showConfirm = useCallback((getUserMedia:any, call:any) => {
        confirm({
          title: `${state?.username} is calling you, do you want to pick the call?`,
          icon: <PhoneOutlined />,
          content: 'Click to pick call or cancel',
          cancelText: 'Reject Call',
          okText:'Accept Call',
          onOk() {
            receiveCall(getUserMedia, call)
          },
          onCancel() {
            // do nothing
          },
        });
      }, [confirm, receiveCall, state?.username])

    useEffect(() => {
        if (activePeer) {
            return
        }
        const peer = new Peer(`${userId}-${moment().format('x')}`, {
            debug: 1,
            port: parseInt(process.env.REACT_APP_PEER_PORT || '') || 8000,
            host,
            path: '/chat'
        });

        peer.on('open', (id) => {
            setActivePeer(peer)
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

        peer.on('disconnected', () => {
            socketIOClient.emit('user-disconnected', { room: CHAT_ROOM, id: activePeer.id ? activePeer.id : 'Unknown ID' })
        })

        const getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        peer.on('call', function(call:any) {
         showConfirm(getUserMedia, call)
        });

    }, [CHAT_ROOM, userId, userSettings.name, activePeer, socketIOClient, showConfirm])

    useEffect(() => {
        socketIOClient.on("user-connected", (user:any, roomId: any, username: string) => {
            updateMessages({message:`${state?.username ? state?.username : 'User'} joined!`, key: moment().format('x'), type: 'notification-joined'})
            setConnectTo((connectTo:any) => [...connectTo, user])
        });

        socketIOClient.on("user-left-the-video-call", () => {
            if (activeVideoCall) {
                Antmessage.warning(state?.username + ' left the call!', 5)
            }
            
        });

        socketIOClient.on("user-left-the-voice-call", () => {
            if (activeVoiceCall) {
                Antmessage.warning(state?.username + ' left the call!', 5)
            }
        });

        socketIOClient.on('peer-disconnected', (peerId) => {
            setConnectedUsers((users:any) => {
                return users.filter((user:any) => user.id !== peerId)
            })
        })

    }, [socketIOClient, state?.username, activeVoiceCall, activeVideoCall])

    useEffect(() => {
        if (!activePeer) {
            return
        }

        const newConnectTo = connectTo
        newConnectTo.forEach((id:any, index:number) => {
            const conn = activePeer.connect(id, {metadata: { name: userSettings.name, id: userId}});
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
    }, [connectTo, activePeer, userId, userSettings.name])

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
        { activeVoiceCall && activePeer ? <> 
            <VoicePanel audioStreamList={audioStreamList} username={state?.username} image={userSettings.imageUrl || getRandomAvatar} leaveCall={leaveVoiceCall} />
            </> :

         activeVideoCall && activePeer ? <> 
            <VideoPanel videoStreamList={videoStreamList} username={state?.username} endCall={endVideoCall} />
        
        </> :
            <Row className="Session">
                <Col lg={6} sm={24} md={6} className="Session__Col--UserData">
                    <img src={userSettings.imageUrl || getRandomAvatar} alt="user" />
                    <h3>{userSettings.name} ({userSettings.age || `${userSettings.ageFrom} - ${userSettings.ageTo} yrs`})</h3>
                    <div className="Media">
                        <img src={telephoneImg} alt="telephone" onClick={() => {
                            callConnectedUsersOrAnswerCall(true)
                        }} />
                        <img src={chatImg} alt="chat" onClick={() => {
                            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
                            inputRef.current?.focus()
                        }}/>
                        <img src={videoImg} alt="video" onClick={() => {
                            callConnectedUsersOrAnswerCall()
                        }} />
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
                <Col lg={18} sm={24} md={18} className="Session__Col--Messages">
                    <Header className="Session__Col__Header">
                        <p>Status: Active Session</p>
                        <p>Time Used: 15 Minutes </p>
                        <p>Time Remaining: 30 Minutes </p>
                    </Header>
                    <div ref={divRef} className="Session__Col__MessageList">
                        { messages.map((theMessage:any, index:number) => {
                            return <MessageBubble type={theMessage.userId !== userId ? 'other': 'same'} message={theMessage.message} key={theMessage.key + index} messageType={theMessage.type}/>
                        })}
                        <div ref={messagesEndRef} style={{marginBottom:'80px'}}></div>
                    </div>
                    <Form form={form} layout="horizontal" className="Session__Form" >
                        <Row>
                            <Col span={18}>
                            <Form.Item name='message' wrapperCol={{ sm: 24, lg:24 }} style={{ width: "100%"}}>
                                <Input ref={inputRef} placeholder='Enter your Message' size="large" value={message} onChange={(e) => {
                                        setMessage(e.target.value)
                                    }
                                    } disabled={connectedUsers.length < 1}/>
                        </Form.Item>
                         </Col>
                            <Col span={6}> 
                                <Form.Item>
                                    <Button size="large" className="Session__Form__Button" htmlType='submit' onClick={() => sendMessage()}>Send</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row> }
            
        </FullLayout>
        </Spin>
    );
}

export default Session