import { Col, Row } from 'antd'
import FullLayout from '../../components/Layout/FullLayout'
import './BookingConfirmed.css'
import checked from './../../images/checked.png'
import googleIcon from './../../images/google-icon.png'
import appleIcon from './../../images/apple-icon.png'
import Reminder from '../../components/Reminder/Reminder'
import { useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'

const BookingConfirmed = () => {
    const history = useHistory()
    const [sessions, setSessions] = useState([])
    const [therapistName, setTherapistName] = useState('')
    const [therapistPic, setTherapistPic] = useState('')

    useEffect(()=> {
        let bookings: any = sessionStorage.getItem('confirmedBookings');
        bookings = JSON.parse(bookings)
        if (bookings.length < 1) {
            history.push('/therapists')
        }
        const therapistName = bookings[0].therapist.name
        const therapistPic = bookings[0].therapist.setting.imageUrl
        console.log(bookings)
        setTherapistName(therapistName)
        setTherapistPic(therapistPic)
        setSessions(bookings)
    }, [history])

    return (
        <FullLayout>
            <Row>
                <Col lg={4}></Col>
                <Col lg={16} className="BookingConfirmed">
                    <img src={checked} width="50" height="50" alt="checked" />
                    <h1>Booking Confirmed!</h1>
                    <div className="BookingConfirmed__Info">
                        <h1>YOU + {therapistName} </h1>
                        <img src={therapistPic} width="50" height="50" alt="therapist" style={{borderRadius: "50%"}} />
                    </div>
                    <p>Your Booking for {sessions.length} Sessions with {therapistName} is confirmed. You can add these to your Calendar below so that that you don’t forget</p>
                    <Row>
                        <Col lg={7} md={3} xs={2}></Col>
                        <Col lg={10} md={18} xs={20}>
                            <Reminder title="Add to Google" imgSrc={googleIcon} />
                            <Reminder title="Add to Apple" imgSrc={appleIcon} />
                        </Col>
                        <Col lg={7} md={3} xs={2}></Col>
                    </Row>
                  
                </Col>
                <Col lg={4}></Col>

            </Row>
        </FullLayout>
    )
}

export default BookingConfirmed