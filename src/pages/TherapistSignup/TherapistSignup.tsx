import { Col, Row } from "antd"
import FullLayout from "../../components/Layout/FullLayout"
import "./TherapistSignup.css"
import { Form, Input, Button, Layout } from 'antd';
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const TherapistSignup = () => {
    const { Header } = Layout

    const history = useHistory()
    const [loginError, setLoginError] = useState('')

    const onFinish = async (values: any) => {
        const baseUrl = process.env.REACT_APP_API_URL
        try {
            const response = await axios.get(`${baseUrl}/api/v1/invite/check/${values.invite}`, {withCredentials: true})
            if (response.status === 200) {
                history.push({pathname: '/therapists/set-password', state: {invite: values.invite, email: values.email}})
            } else {
                setLoginError('There was an error signing you up')
            }
            
        } catch (err) {
            setLoginError('Invalid Code!')
        }
        
      };
    
    const onFinishFailed = (errorInfo: any) => {
        // handle error
    };

    return (
        <FullLayout>
            <Row className="TSignup">
                <Col lg={4} xs={2}></Col>
                <Col lg={16} xs={20}>
                    <Header className="TSignup__Col__Header">  
                    <h1>Welcome to Therapist first time signup on Safespace!</h1> 
                    </Header> 
                    <Row>
                    <Col lg={4}></Col>
                        <Col lg={16} xs={24} className="TSignup__Col__Form">
                        <span style={{color:'red'}}>{loginError}</span>
                          <Form
                            name="basic"
                            size="large"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout="vertical"
                            >

                            <Form.Item
                                label="Enter invite code"
                                name="invite"
                                rules={[{ required: true, message: 'Please enter invite code.' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Enter your email address"
                                name="email"
                                rules={[{ required: true, type: 'email', message: 'Please enter a valid email address.' }]}
                            >
                                <Input />
                            </Form.Item>

                        
                            <Form.Item wrapperCol={{ span: 24 }} className="TSignup__Col__Form__Button">
                            <Button type="default" htmlType="submit">
                                CONTINUE TO SIGNUP
                                </Button>
                            </Form.Item>
                            </Form>

                            <p>Already have a therapist account?</p>
                            <Button className="TSignup__Col__Form__Button--Login" size="large" onClick={() => history.push('/therapists/login')}>
                                LOG IN
                            </Button>
                        </Col>
                        <Col lg={4}></Col>
                    </Row> 
                </Col>
                <Col></Col>
            </Row>

        </FullLayout>
    )
}

export default TherapistSignup