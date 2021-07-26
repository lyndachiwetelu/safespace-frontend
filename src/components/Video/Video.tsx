import { VideoHTMLAttributes, useEffect, useRef } from 'react'
import './Video.css'

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream,
  callState: boolean
}

export default function Video({ srcObject, callState, ...props }: PropsType) {
  const refVideo: any = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!refVideo.current) return
    refVideo.current.srcObject = srcObject
  }, [srcObject])

  useEffect(() => {
    if (!callState && refVideo) {
        refVideo.current.srcObject = null
    }
  }, [callState])

  return <video ref={refVideo} {...props} controls autoPlay playsInline className="VideoPlayer" />
}