import { Col, Layout, Row } from "antd";
import './VoicePanel.css'
import videoImg from '../../images/video.png'
import muteImg from '../../images/mute.png'
import endImg from '../../images/end-call.jpg'
import { useEffect, useRef, useState } from "react";
const { Header } = Layout;


const VoicePanel = ({ username, audioStreamList, image, leaveCall}: { image:string, username: string, audioStreamList: Array<any>, leaveCall: Function} ) => {
    const refAudio: any = useRef<HTMLAudioElement>(new Audio())
    const [callState, setCallState]: any = useState<boolean>(true)
    const localStream = useRef<any>(null)

    useEffect(() => {
        if (!refAudio.current) return

        if (callState && refAudio) {
            if (audioStreamList.length > 0) {
                refAudio.current.srcObject = audioStreamList[0].stream
                const ss = refAudio.current.play();

                ss.then((ee:any) => { }).catch((err:any) => {})
                localStream.current = audioStreamList[1].stream
            }
        }

    }, [audioStreamList, callState]);


    const endAudioStreams = () => {
        if (refAudio.current.srcObject) {
            const stream = refAudio.current.srcObject;
            const tracks = stream.getTracks();

            tracks.forEach((track:any) => {
                track.stop();
            });
            refAudio.current.srcObject = null
       }

     
       if (localStream.current) {
           const localStreamTracks = localStream.current.getAudioTracks();
           localStreamTracks.forEach((track:any) => {
               track.stop();
           })
        }
    }

    return (
       <div className="VoicePanel">
            <Header className="VoicePanel__Header">
            <h3>Voice Call with {username}</h3>
            <span>
                <p>Status: Active Session</p>
                <p>Time Used: 15 Minutes </p>
                <p>Time Remaining: 30 Minutes </p>
            </span>
            </Header>
            <Row className="VoicePanel__Content">
                <Col span={24}>
                    <img src={image} alt="user" className="VoicePanel__Img" />
                </Col>
            </Row>
            <div className="VoicePanel__Controls">
               <img src={videoImg} alt="video" />
               <img src={endImg} alt="end" onClick={
                   () => {
                       setCallState(false)
                       endAudioStreams()
                       leaveCall()
                   }
               } />
               <img src={muteImg} alt="mute" onClick={
                   () => {
                       if (refAudio.current) {
                           refAudio.current.muted = !refAudio.current.muted
                       }
                   }
               } />
            </div>
        </div> 
    )
}

export default VoicePanel;