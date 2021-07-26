import { Col, Row } from "antd"
import FullLayout from "../../components/Layout/FullLayout"
import "./Login.css"
import { Form, Input, Button, Layout } from 'antd';
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import { loggedInContext } from "../../context/loggedInContext";

const Login = () => {
    const { Header } = Layout

    const history = useHistory()
    const location = useLocation()
    const [loginError, setLoginError] = useState('')
    const isLoggedIn = useContext<any>(loggedInContext)
    const { state } : { state: any } = location;

    if (isLoggedIn.loggedIn && state) {
        history.replace(state.from || '/')
    }

    const onFinish = async (values: any) => {
        const baseUrl = process.env.REACT_APP_API_URL
        try {
            const response = await axios.post(`${baseUrl}/api/v1/users/login`, values, {withCredentials: true})
            if (response.status === 200) {
                sessionStorage.setItem('userId', response.data.id)
                sessionStorage.setItem('isTherapist', 'false')
                history.push({pathname: '/therapists', state: {userId: response.data.id, settings: response.data.settings}})
            } else if (response.status === 400) {
                setLoginError('Invalid Credentials')
            }
            
        } catch (err) {
            setLoginError('Invalid Credentials')
        }
        
      };
    
    const onFinishFailed = (errorInfo: any) => {
        // handle error
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

                            <p>Don't have an account yet?</p>
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