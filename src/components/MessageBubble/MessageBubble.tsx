import './MessageBubble.css'

const MessageBubble = ({ message, type} : {message:string, type: string}) => {
    return (
        <div className={`MessageBubble ${type}`}>
            <p>{message}</p>
        </div>
    )
}

export default MessageBubble