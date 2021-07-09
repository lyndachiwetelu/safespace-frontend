import { Col, Row, Layout} from 'antd'
import axios from 'axios'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import FullLayout from '../../components/Layout/FullLayout'
import SessionBox from '../../components/SessionBox/SessionBox'
import './Sessions.css'
const { Header } = Layout

const Sessions = () => {

    const [sessions, setSessions]: [sessions: {upcoming:any, past:any, active:any}, setSessions:any ] = useState({
        upcoming: [],
        past: [],
        active: [],
    })

    const groupSessions = (sessions: Array<object>) => {
        const upcoming:Array<object> = []
        const past: Array<object> = []
        const active:Array<object> = []
        sessions.forEach((session:any) => {
            if(session.status !== 'cancelled') {
                let day = session.day
                const fromDate = `${day} ${session.from}`
                const fromDateFormatted  = moment(fromDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss')
                const timeDiff = moment().diff(fromDateFormatted, 'minutes')
                if (timeDiff < 0) {
                    upcoming.push(session)
                } else if (timeDiff > 0) {
                    const toDate = `${day} ${session.to}`
                    const toDateFormatted  = moment(toDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss')
                    const diff = moment().diff(toDateFormatted, 'minutes') 
                    if (diff > 0) {
                        past.push(session)
                    } else {
                        active.push(session)
                    }
                } else {
                    active.push(session)
                }
        }
        })

        return {upcoming, past, active}
    }    

    const fetchSessions = useCallback( async () => {
        const userId = sessionStorage.getItem('userId')
        const url = `http://localhost:8000/api/v1/sessions/patient/${userId}`
        try {
            const response = await axios.get(url, {withCredentials: true})
            if (response.status === 200) {
                setSessions(groupSessions(response.data))
            }
        } catch(err) {
            // Handle Error Occurred
        }   
    }, [])

    useEffect(() => {
        fetchSessions()
    }, [fetchSessions])
    
    return (
        <FullLayout>
            <Row>
                <Col lg={2}  md={2}></Col>
                <Col lg={20} md={24} xs={24} className="Sessions">
                    <Header className="Sessions__Header">
                        <h1>ACTIVE SESSIONS</h1>
                    </Header>
                    {sessions.active.length < 1 ? <h2>You have no Active Sessions</h2> : null}
                    {
                    sessions.active.map((session:any) => (
                        <SessionBox session={session} type="active" key={session.id} fetch={fetchSessions} />
                    )) 
                   }
                    
                    <Header className="Sessions__Header">
                        <h1>UPCOMING SESSIONS</h1>
                    </Header>
                    {sessions.upcoming.length < 1 ? <h2>You have no Upcoming Sessions</h2> : null}

                    {
                        sessions.upcoming.map((session:any) => (
                            <SessionBox session={session} type="upcoming" key={session.id} fetch={fetchSessions} />
                        )) 
                    }

                    <Header className="Sessions__Header">
                        <h1>PAST SESSIONS</h1>
                    </Header>
                    {sessions.past.length < 1 ? <h2>You have not had any sessions yet</h2> : null}

                    {
                        sessions.past.map((session:any) => (
                            <SessionBox session={session} type="past" key={session.id} fetch={fetchSessions} />
                        )) 
                    }

                </Col>
                <Col lg={2}></Col>
            </Row>
        </FullLayout>
    )
}

export default Sessions