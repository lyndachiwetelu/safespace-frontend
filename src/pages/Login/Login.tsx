import { Col, Row } from "antd"
import FullLayout from "../../components/Layout/FullLayout"
import "./Login.css"
import { Form, Input, Button, Layout } from 'antd';
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Login = () => {
    const { Header } = Layout

    const history = useHistory()
    const [loginError, setLoginError] = useState('')

    const onFinish = async (values: any) => {
        const baseUrl = 'http://localhost:8000'
        try {
            const response = await axios.post(`${baseUrl}/api/v1/users/login`, values)
            if (response.status === 200) {
                history.push({pathname: '/therapists', state: {userId: response.data.id, settings: response.data.settings}})
            } else if (response.status === 400) {
                setLoginError('Invalid Credentials')
            }
            
        } catch (err) {
            setLoginError('Invalid Credentials')
        }
        
      };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <FullLayout>
            <Row className="Login">
                <Col lg={4} xs={2}></Col>
                <Col lg={16} xs={20}>
                    <Header className="Login__Col__Header">  
                    <h1>Already have an account? Login to SafeSpace!</h1> 
                    </Header> 
                    <Row>
                    <Col lg={4}></Col>
                        <Col lg={16} xs={24} className="Login__Col__Form">
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
                                label="Enter your email Address"
                                name="email"
                                rules={[{ required: true, type: 'email', message: 'Please enter a valid email address.' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Enter your Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                        
                            <Form.Item wrapperCol={{ span: 24 }} className="Login__Col__Form__Button">
                            <Button type="default" htmlType="submit">
                                LOG IN NOW
                                </Button>
                            </Form.Item>
                            </Form>

                            <p>Don't have an acoount yet?</p>
                            <Button className="Login__Col__Form__Button--Signup" size="large" onClick={() => history.push('/get-started')}>
                                SIGN UP
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

export default Login