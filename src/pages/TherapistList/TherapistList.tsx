import { Col, Row, Layout, Button } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import FullLayout from "../../components/Layout/FullLayout"
import './TherapistList.css'
import {
    Form,
    Select,
    Switch,
  } from 'antd';

const { Header } = Layout
const { Option } = Select;


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
    }, [userId])

    const fetchTherapists = async (userId: number) => {
        const baseUrl = 'http://localhost:8000'
        try {
            const response = await axios.get(`${baseUrl}/api/v1/therapists/list/${userId}`, { withCredentials: true })
            setTherapists(response.data)
        } catch (err) {
        }
    }
    return (
        <FullLayout>
            <Row className='Therapist_List'>
                <Col lg={5} xs={24} md={8} className='Therapist_List__Col__Criteria'>
                    <h1>YOUR CRITERIA</h1>
                    <Form
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        layout="vertical"
                        className="Therapist_List__Col__Criteria__Form"
                    >
                    <Form.Item
                            name="ailments"
                            label="Select all ailments"
                            labelCol={{lg: {span:24}}}
                            rules={[{ required: true, message: 'Please select which of these apply to you', type: 'array' }]}
                            initialValue={['depression', 'anxiety', 'eating-disorder']}
                        >
                        <Select mode="multiple" placeholder="Please select all those that apply">
                            <Option value="depression">Depression</Option>
                            <Option value="anxiety">Anxiety</Option>
                            <Option value="bipolar">Bipolar Disorder</Option>
                            <Option value="eating-disorder">Anorexia, bulimia, and other eating disorders</Option>
                            <Option value="ptsd">Posttraumatic stress disorder (PTSD)</Option>
                            <Option value="addiction">Addictions</Option>
                            <Option value="personality-disorder">Personality disorders</Option>
                        </Select>
                        </Form.Item>

                        <Form.Item
                                name="religiousTherapy"
                                label="Religion Based Therapy?"
                                hasFeedback
                                labelCol={{lg: {span:24}}}
                                rules={[{ required: true, message: 'This is required!' }]}
                            >
                                <Select placeholder="Select">
                                <Option value="none">No</Option>
                                <Option value="christian">Yes, Christian</Option>
                                <Option value="muslim">Yes, Muslim</Option>
                                <Option value="hindu">Yes, Hindu</Option>
                                <Option value="buddhist">Yes, Buddhist</Option>
                                </Select>
                            </Form.Item>


                        <Form.Item
                            name="media"
                            label="Voice Video or Text"
                            labelCol={{lg: {span:24}}}
                            rules={[{ required: true, message: 'Please select your preferred media.', type: 'array' }]}
                            initialValue={['video', 'voice']}
                        >
                        <Select mode="multiple" placeholder="Please select all preferred media">
                            <Option value="video">Video</Option>
                            <Option value="voice">Voice</Option>
                            <Option value="text">Text</Option>
                        </Select>
                        </Form.Item>
                            
                        <Form.Item valuePropName="checked" name="couplesTherapy" label="Looking for Couples Therapy?" labelCol={{lg: {span:24}}}>
                            <Switch />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" className="Criteria__Form__Button" size='large'>APPLY</Button>
                        </Form.Item>
                            </Form>
                </Col>

                <Col lg={18} md={14}>
                    <Header className='TherapistList__Col__Header'>
                         <h1>{therapists.length} Therapists Match Your Profile. Click on See More to view more details about any and book a session</h1>
                    </Header>
                    <Row gutter={3}>
                        {therapists.map((therapist: { id:number, name: string, therapistSetting: any}) => (<Col lg={8} md={12} xs={24} key={therapist.id}>
                            <div className="TherapistList__therapistBox" >
                                <img src={therapist.therapistSetting.imageUrl} alt='Therapist' className="TherapistBox__Image"/>
                                <h3>{therapist.name} {therapist.therapistSetting.qualifications}</h3>
                                <h3>${therapist.therapistSetting.pricePerSession} / {therapist.therapistSetting.timePerSession} Minutes</h3>
                                <p>{therapist.therapistSetting.summary.substring(0, 150)}</p>
                                <Button className="TherapistBox__Button" size='large'>See More</Button>
                            </div>
                        </Col> ))}
                    </Row>
                </Col>

                <Col lg={1}>
                </Col>
            </Row>
        </FullLayout>
    )
}

export default TherapistList