import FullLayout from "../../components/Layout/FullLayout"
import './Home.css'
import banner from '../../images/banner.png'
import { Button, Col, Row } from "antd"
import { useHistory } from "react-router-dom"
import imgChecked from '../../images/checked.png'
import imgConversation from '../../images/conversation.png'
import imgStar from '../../images/star.png'

const Home = () => {
    const history  = useHistory()
    
    const gotoQuestionnaire = () => {
       history.push("/get-started")
    }

    return (
    <FullLayout>
        <div className='HomeContent'>
        <Row>
            <Col lg={12} xs={20} className="HomeContent__Col__Heading">
                <h1 className="HomeContent__Heading">FIND THE PERFECT THERAPIST ONLINE</h1>
                <p>Just answer a few questions about yourself and we will find you the perfect therapist. Online and Affordable!</p>
                <Row className="Statistics">
                <Col lg={2} xs={2}></Col>
                <Col lg={18} xs={18}>
                     <Button className="HomeContent__Col__Heading__Button" size="large" onClick={() => gotoQuestionnaire()}>GET STARTED</Button>
                </Col>
                </Row>
                </Col>
            <Col lg={12} xs={20} className="HomeContent__Col__Image"><img src={banner} alt="banner" className="HomeContent__Image"/></Col>
        </Row>
        <Row className="Statistics">
            <Col lg={8} xs={8}>
                <img src={imgChecked} alt='checked' /> 
                <h1>12,000 Completed Sessions</h1>
            </Col>
            <Col lg={8} xs={8}>
                <img src={imgConversation} alt='active sessions' /> 
                <h1>1200 Active Sessions</h1>
            </Col>
            <Col xs={8}>
                <img src={imgStar} alt='stars' /> 
                <h1>500 5 Star Reviews</h1>
            </Col>
        </Row>
        </div>
    </FullLayout>
    )
}

export default Home