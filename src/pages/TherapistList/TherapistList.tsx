import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const TherapistList = () => {
    const { state } :  {state: any } = useLocation()
   
    let userId : number | null = null
    if (state !== undefined) {
        userId = state.userId
    }
    
    const [therapists, setTherapists] = useState([])

    useEffect(() => {
        if (userId !== null) {
            fetchTherapists(userId)
        }
    }, [])

    const fetchTherapists = async (userId: number) => {
        const baseUrl = 'http://localhost:8000'
        try {
            const response = await axios.get(`${baseUrl}/api/v1/therapists/list/${userId}`, { withCredentials: true })
            setTherapists(response.data)
        } catch (err) {
        }
    }
    return (<h1>{therapists.length} Therapists Found</h1>)
}

export default TherapistList