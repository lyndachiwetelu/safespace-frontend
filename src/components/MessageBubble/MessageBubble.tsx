import './MessageBubble.css'

const MessageBubble = ({ message, type, messageType, emoji = ''} : {message:string, type: string, messageType:string, emoji: string}) => {
    return (
        <div className={`MessageBubble ${type} ${messageType} ${emoji}`}>
            <p>{message}</p>
        </div>
    )
}

export default MessageBubble