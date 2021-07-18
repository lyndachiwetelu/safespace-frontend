import FullLayout from '../../components/Layout/FullLayout'
import './Availability.css'
import { Button, Col, DatePicker, Form, Layout, Row } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
const {Header} = Layout

const Availability = () => {
    const MAX_SIZE = 2
    let { id } : { id: string} = useParams();
    const [therapist, setTherapist]: [therapist:any, setTherapist:any] = useState(null)
    const [availabilities, setAvailabilities]: [availabilities:any, setAvailabilities:any] = useState([])
    const [selection, setSelection]: [selection:any, setSelection:any] = useState([])
    const [dayAvails, setDayAvails]: [dayAvails:any, setDayAvails:any] = useState([])
    const history = useHistory()

    const fetchAvailabilitiesFortherapist = async(id:number) => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/v1/availabilities/${id}`
            const response = await axios.get(url, {withCredentials: true})
            if (response.status === 200) {
                setAvailabilities(response.data)
            } else {
                // handle unexpected response
            } 
        } catch (err) {
            // handle error
        }
    }

    const fetchTherapistData = useCallback(
        async(id: number) => {
            const baseUrl = process.env.REACT_APP_API_URL
            try {
                const response = await axios.get(`${baseUrl}/api/v1/therapists/${id}`, { withCredentials: true})
                if (response.status === 200) {
                    setTherapist(response.data)
                }
    
            } catch (err) {
                // Handle Error
            }
        }, [setTherapist])

        useEffect(() => {
            fetchTherapistData(parseInt(id))
            fetchAvailabilitiesFortherapist(parseInt(id))
        }, [id, fetchTherapistData])


        useEffect(() => {
            if (therapist && !therapist.id) {
                history.push('/login')
            }
        }, [history, therapist, fetchTherapistData])

    const onFinish = (date: any) => {
        const formattedDate = date.format('YYYY-MM-DD')
        const dayAvailabilities = availabilities.filter((avail:any) => {
            return avail.day === formattedDate
        })
        const times = dayAvailabilities.map((avail:any) => {
            return avail.times.map((time:any) => {
                time.availabilityId = avail.id
                return time
            })
        })
        setDayAvails(times.flat())
    }

    const getFriendlyTime = (date:string) => {
        const formatted = moment(date, 'YYYY-MM-DD HH:mm:ss').format('HH:mm A')
        return formatted
    }

    const addSelection = (start: any, end: any, availabilityId: number) => {
        setSelection((selection:any) =>  [{start, end, availabilityId}, ...selection])
    }

    const removeSelection = (start: any, end: any) => {
        setSelection((selection:any) => {
            const updatedSelection = selection.filter((select:any) => {
                return !(select.start === start && select.end === end)
            })

            return updatedSelection
        })
    }

    const inSelection = (start: any, end: any): boolean => {
        return selection.filter((select:any) => {
            return (select.start === start && select.end === end)
        }).length > 0
    }

    const disabledDate = (current:any) => {
        return availabilities.filter((avail:any) => { 
            return current && moment(avail.day).isSame(current.format('YYYY-MM-DD'), 'day')
        }).length <= 0 || current.diff(moment(), 'days') < 0
    }

    const continueToBookingConfirmation = (): void => {
       const dataToStore = {
           userId: sessionStorage.getItem('userId'),
           therapist,
           sessions: selection,
           price: therapist.therapistSetting.pricePerSession * selection.length
       }

       sessionStorage.setItem('sessionData', JSON.stringify(dataToStore))
       history.push('/booking/confirmation')
    }

    return (
        <FullLayout>
            <Row className="Availability">
                <Col lg={5}></Col>
                <Col lg={14}>
                    <Header className="heading">
                        <p>Pick a time or two on {therapist?.name}’s free Calendar. </p>
                        <p>You may pick a maximum of 2 times since this is your first time talking to {therapist?.name}</p>
                    </Header>
                    <Row className="TherapistInfo">
                        <Col lg={6} xs={24}><img width="50" height="50" style={{borderRadius:"50%"}} src={therapist?.therapistSetting.imageUrl} alt="therapist" /></Col>
                        <Col lg={12} xs={24}><h2>{therapist?.name.toUpperCase()}'s CALENDAR</h2></Col>
                        <Col lg={6} xs={24}><h2>${therapist?.therapistSetting.pricePerSession} / {therapist?.therapistSetting.timePerSession} minutes</h2></Col>
                    </Row>
                    <Row className="SelectAvailability">
                        <Col  lg={12} md={12} xs={24} className="Availabilities">
                        <Form
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 12 }}
                            layout="vertical"
                            className="Therapist_List__Col__Criteria__Form"
                        >
                            <Form.Item label="Enter Date:">
                                <DatePicker onSelect={onFinish} disabledDate={(d:any) => disabledDate(d)}></DatePicker>
                            </Form.Item>
                        </Form>

                        <h3>Availabilities:</h3>
                        { dayAvails.length > 0 ? (
                        <div className="List">
                            { dayAvails.map((avail:any) => (
                                <div key={avail.start + avail.end}>
                                <p>{getFriendlyTime(avail.start)} - {getFriendlyTime(avail.end)}</p> 
                                <Button 
                                    className={inSelection(avail.start, avail.end) ||  selection.length === MAX_SIZE ? 'disabled': ''} 
                                    disabled={inSelection(avail.start, avail.end) || selection.length === MAX_SIZE} 
                                    onClick={() => {addSelection(avail.start, avail.end, avail.availabilityId)}}
                                    >Select</Button>
                            </div>
                            )) }
                            
                        </div>) : (<h3>Select a Date to View</h3>) }
                        
                        </Col>
                        <Col lg={12} md={12} xs={24} className="Summary">
                        <Header className="Summary__Header">
                            <p>Sessions: {selection.length}</p>
                            <p>Total: ${therapist?.therapistSetting.pricePerSession * selection.length}</p>
                        </Header>

                        <h3>YOUR SELECTION:</h3>
                        {
                            selection.length > 0 ? (<div className="List">
                                {selection.map((select:any) => {
                                    return (
                                    <div key={select.start + select.end}>
                                        <p>{getFriendlyTime(select.start)} - {getFriendlyTime(select.end)}</p> 
                                        <Button onClick={() => {removeSelection(select.start, select.end)}}>Remove</Button>
                                    </div>)
                                })}
                        </div>) : (<h3>You have not selected any sessions</h3>)
                        }
                        
                        
                        </Col>
                    </Row>
                    <Row className="Links">
                        <Col>
                            <Button size="large" onClick={() => {history.push(`/therapists/${therapist?.id}`)}}>GO BACK TO THERAPIST PROFILE</Button>
                        </Col>
                        <Col>
                            <Button size="large" onClick={() => continueToBookingConfirmation()}>CLICK TO CONTINUE BOOKING</Button>
                        </Col>
                    </Row>
                </Col>
                <Col lg={5}></Col>
            </Row>
        </FullLayout>
    )
}

export default Availability
