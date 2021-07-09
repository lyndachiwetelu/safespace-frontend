import './Reminder.css'

const Reminder = ({title, imgSrc}: {title: string, imgSrc:string}) => {
    return (
        <div className="Reminder">
            <img src={imgSrc} width="50" height="50" alt="calendar"/>
            <h2>{title}</h2>
         </div>
    )
}

export default Reminder