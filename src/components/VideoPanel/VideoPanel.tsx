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
        <div className="VideoPanel">
            <Header className="VideoPanel__Header">
            <h3>Video Call with {username}</h3>
            <span>
                <p>Status: Active Session</p>
                <p>Time Used: 15 Minutes </p>
                <p>Time Remaining: 30 Minutes </p>
            </span>
            </Header>
            <div className="VideoPanel__VideoList">
            {
                videoStreamList.map((videoStream:any, index:number) => {
                    return (
                        <div className={`VideoPanel-item ${videoStream.type}`} key={index}>
                            <Video srcObject={videoStream.stream} callState={callState} type={videoStream.type}/>
                            <h2>{videoStream.type === 'activeUser' ? 'You' : username}</h2>
                        </div>
                    )
                })
            }
            </div>
            <div className="VideoPanel__EndCall">
                <img src={endCallImage} className="VideoPanel__EndCallImg" alt='endcall'  onClick={() => {
                    setCallState(false)
                }}/>
            </div>
            
        </div>
       
    ) 
}

export default VideoPanel