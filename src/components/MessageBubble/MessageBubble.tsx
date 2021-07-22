import './MessageBubble.css'

const MessageBubble = ({ message, type, messageType} : {message:string, type: string, messageType:string}) => {
    return (
        <div className={`MessageBubble ${type} ${messageType}`}>
            <p>{message}</p>
        </div>
    )
}

export default MessageBubble