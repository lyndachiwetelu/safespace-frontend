import './MessageBubble.css'

const MessageBubble = ({ message, type, messageType, time, emoji = ''} : {message:string, type: string, time:string, messageType:string, emoji: string}) => {
    return (
        <div className={`MessageBubble ${type} ${messageType} ${emoji}`}>
            <p>{message}</p>
            <p>{time}</p>
        </div>
    )
}

export default MessageBubble