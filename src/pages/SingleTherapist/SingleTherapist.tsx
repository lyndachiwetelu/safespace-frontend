import { useParams } from "react-router-dom";

const SingleTherapist = () => {
    let { id } : { id: string} = useParams();
    return (<h1>Single Therapist Page {id}</h1>)
}

export default SingleTherapist