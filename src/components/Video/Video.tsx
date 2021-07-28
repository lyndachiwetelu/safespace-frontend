import { VideoHTMLAttributes, useEffect, useRef } from 'react'
import './Video.css'

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream,
  callState: boolean,
  type: 'string'
}

export default function Video({ srcObject, callState, type, ...props }: PropsType) {
  const refVideo: any = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!refVideo.current) return
    refVideo.current.srcObject = srcObject
  }, [srcObject])

  useEffect(() => {
    if ((!callState && refVideo)) {
        const stream = refVideo.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track:any) => {
            track.stop();
        });
        refVideo.current.srcObject = null
    }
  }, [callState])

  const isMuted = (type:string) => {
      return type === 'activeUser'
  }

  return <video ref={refVideo} {...props} autoPlay playsInline className="VideoPlayer" muted={isMuted(type)}/>
}