import { Col, Row, Layout, Button} from "antd"
import axios from "axios"
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import FullLayout from "../../components/Layout/FullLayout"
import './BookingConfirmation.css'
const { Header } = Layout

const BookingConfirmation = () => {
    const [sessionData, setSessionData]: [sessionData:any, setSessionData:any] = useState(null)
    const [paymentMethod, setPaymentMethod]: [paymentMethod:any, setPaymentMethod:any] = useState('paypal')
    const history = useHistory()

    const getItemFromSessionStorage = useCallback((key: string) => {
        let sessionData: any = sessionStorage.getItem(key)
        if (!sessionData) {
            history.push('/login')
        }
        const getSessionData: any = JSON.parse(sessionData)
        setSessionData(getSessionData) 
    }, [history])

    const handlePayment = async() => {
        // store payment method also - non mvp
        console.log(paymentMethod)
        const savedSessions = []
        const url = `${process.env.REACT_APP_API_URL}/api/v1/sessions`
        for (const selection of sessionData.sessions) {
            const session = {
                from: moment(selection.start).format('HH:mm'),
                to: moment(selection.end).format('HH:mm'),
                requestedBy: sessionData.userId,
                availabilityId: selection.availabilityId,
                status: "confirmed"
            }
            try {
                 const response = await axios.post(url, session, {withCredentials: true})
                 if (response.status === 201) {
                    savedSessions.push(response.data)
                 }
            } catch (err) {
               // handle error 
            }
        }

        if(savedSessions.length > 0) {
            sessionStorage.setItem('confirmedBookings', JSON.stringify(savedSessions))
            history.push('/booking/confirmed')
        }
    }

    useEffect(() => {
        getItemFromSessionStorage("sessionData")
    }, [getItemFromSessionStorage])


    return (
        <FullLayout>
                <Row>
                <Col lg={4}></Col>
                <Col lg={16} className="BookingConfirmation">
                    <Header className="BookingConfirmation__Header">
                        <h1>PAY FOR SESSIONS WITH YOU AND {sessionData?.therapist.name.substring(0, 10).toUpperCase()}</h1> <img src={sessionData?.therapist?.therapistSetting?.imageUrl} width="50" height="50" style={{objectFit:'cover', borderRadius:'50%'}} alt="therapist" />
                    </Header>
                    <h1>TOTAL FEE: ${sessionData?.price}</h1>
                    <p>You have selected { sessionData?.sessions?.length } therapy sessions with {sessionData?.therapist.name}. Select a payment method and pay to confirm your booking.</p>
                    <h1>SELECT PAYMENT METHOD</h1>

                    <label className="container">PAYPAL
                    <input type="radio" checked={true} name="radio" readOnly />
                    <span className="checkmark" onClick={() => setPaymentMethod('paypal')}></span>
                    </label>
                    <label className="container">CREDIT CARD
                    <input type="radio" name="radio" readOnly />
                    <span className="checkmark" onClick={() => setPaymentMethod('credit')}></span>
                    </label>

                    <Button size="large" className="BookingConfirmation_Button" onClick={handlePayment}>CONTINUE TO PAYMENT</Button>
                      
                        </Col>
                <Col lg={4}></Col>
            </Row>
        </FullLayout>
    )
    
}

export default BookingConfirmation