import { Button, Col, Rate, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import FullLayout from "../../components/Layout/FullLayout";
import './SingleTherapist.css'
import checked from './../../images/checked.png'

const SingleTherapist = () => {
    let { id } : { id: string} = useParams();
    const history = useHistory();

    const [therapist, setTherapist]: [therapist:any, setTherapist:any] = useState(null)

    useEffect(() => {
        fetchData(parseInt(id))
    }, [id])

    const fetchData = async(id: number) => {
        const baseUrl = process.env.REACT_APP_API_URL
        try {
            const response = await axios.get(`${baseUrl}/api/v1/therapists/${id}`, { withCredentials: true})
            if (response.status === 200) {
                setTherapist(response.data)
            }

        } catch (err) {
            // Handle Error
        }

    }
    return (<FullLayout>
        <Row className="Therapist" gutter={15}>
            <Col lg={3} md={3}></Col>
            <Col lg={11} md={13} xs={24}>
                {therapist ? (
                    <div className="Therapist__Col__About">
                        <img src={therapist.therapistSetting.imageUrl} alt='Therapist' className="Therapist__Col__About__Image"/>
                        <div className="Therapist__Col__About__Info">
                    
                            <h3>{therapist.name} {therapist.therapistSetting.qualifications}</h3> 
                            <Rate allowHalf defaultValue={2.5} style={{lineHeight:0, fontSize:'16px', padding: '3px'}}/>
                            <div className="Therapist__Col__About__Info--Price">
                            <h3>${therapist.therapistSetting.pricePerSession} / {therapist.therapistSetting.timePerSession} Minutes</h3>
                            </div>
                            
                        </div>
                         
                         
                         <p>{therapist.therapistSetting.summary.substring(0, 300).repeat(3)}</p>
                         <Button className="Therapist__Col__About__Button" size="large" onClick={() => history.push(`/therapists/${therapist.id}/availability`)}>BOOK A SESSION</Button>
                    </div>
                ) : null}
            </Col>
            <Col lg={9} md={8} xs={24}>
            {therapist ? (
                <div className="TherapistOtherDetails">
                <h2> {therapist.name} specializes in: </h2>
                <ul>
                    {therapist.ailments.map((ailment:any) => {
                    return (
                        <li key={ailment.ailmentKey}>{ailment.name}</li>
                    )
                }) }
                </ul>
                <p>Uses: {therapist.media.map((medium: any) => medium.name).join(', ')}</p>
                <div className="TherapistOtherDetails__CompletedSessions">
                    <img src={checked} alt='checked' width='30px' height='30px' />
                    <h2>1580 completed Sessions</h2>
                </div>

                <div className="Reviews">
                    <p>What People are saying about their sessions with {therapist.name}</p>
                    <p>"Admiration we surrounded possession frequently he. Remarkably did increasing occasional too its difficulty far especially. Known tiled but sorry joy balls. Bed sudden manner indeed fat now feebly"</p>
                    <p>"Conveying or northward offending admitting perfectly my. Colonel gravity get thought fat smiling add but. Wonder twenty hunted and put income set desire expect"</p>
                    <p>"Cottage out enabled was entered greatly prevent message. No procured unlocked an likewise. Dear but what she been over gay felt body"</p>
                    </div>

                </div>
                
            ) : null}
            
            
            
            </Col>
        </Row>
        
    </FullLayout>)
}

export default SingleTherapist