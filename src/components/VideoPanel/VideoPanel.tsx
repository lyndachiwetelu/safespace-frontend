import Video from '../Video/Video'
import { Layout } from 'antd'
import './VideoPanel.css'
import endCallImage from '../../images/end-call.jpg'
import { useEffect, useState } from 'react'

const { Header }  = Layout

const VideoPanel = ({videoStreamList, endCall, username} : {videoStreamList:any, endCall:Function, username: string}) => {
    const [callState, setCallState] = useState(true)

    useEffect(() => {
        if (!callState) {
            endCall()
        }
    }, [callState, endCall])
    return (
        <>
        <Header className="VideoPanel__Header">
        <h3>Video Call with {username}</h3>
        <span>
            <p>Status: Active Session</p>
            <p>Time Used: 15 Minutes </p>
            <p>Time Remaining: 30 Minutes </p>
        </span>
        </Header>
        <div className="VideoPanel">
            <div className="VideoPanel__VideoList">
            {
                 <div className={`VideoPanel-item ${videoStreamList[0]?.type}`}>
                 <Video srcObject={videoStreamList[0]?.stream} callState={callState} type={videoStreamList[0]?.type}/>
                 <h2>{username}</h2>
                </div>
            }
            </div>
            <div className="VideoPanel__ActiveUserPanel">
               
                <div className="VideoPanel__ActiveUser">
                    <Video srcObject={videoStreamList[1]?.stream} callState={callState} type={videoStreamList[1]?.type}/>
                    <h2>You</h2>
                </div>
                <div className="VideoPanel__EndCall">
                    <img src={endCallImage} className="VideoPanel__EndCallImg" alt='endcall'  onClick={() => {
                        setCallState(false)
                    }}/>
                </div>

            </div>
                
            </div>
            </>
       
    ) 
}

export default VideoPanel