import Video from '../Video/Video'
import { Layout } from 'antd'
import './VideoPanel.css'
import endCallImage from '../../images/end-call.jpg'
import { useState } from 'react'

const { Header }  = Layout

const VideoPanel = ({videoStreamList, endCall, username} : {videoStreamList:any, endCall:Function, username: string}) => {
    const [callState, setCallState] = useState(true)
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
                        <div className="VideoPanel-item" key={index}>
                            <Video srcObject={videoStream.stream} callState={callState} />
                            <h2>{videoStream.type === 'caller' ? 'You': 'Other user'}</h2>
                        </div>
                    )
                })
            }
            </div>
            <div className="VideoPanel__EndCall">
                <img src={endCallImage} className="VideoPanel__EndCallImg" alt='endcall'  onClick={() => {
                    endCall()
                    setCallState(false)
                }}/>
            </div>
            
        </div>
       
    ) 
}

export default VideoPanel