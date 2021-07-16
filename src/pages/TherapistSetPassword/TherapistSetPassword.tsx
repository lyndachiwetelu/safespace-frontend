import { Button, Col, Form, Input, Layout, Row } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import FullLayout from '../../components/Layout/FullLayout'
import './TherapistSetPassword.css'

const TherapistSetPassword = () => {
    const history = useHistory()
    const { Header } = Layout
    const { state } :  { state: any } = useLocation()
    const [signupError, setSignupError] = useState('')
    
    if (state === undefined) {
        history.push('/therapists/signup')
    }

    const onFinish = async (values: any) => {
        const baseUrl = process.env.REACT_APP_API_URL
        const data = {
            email: state.email,
            code: state.invite,
            password: values.password
        }
        try {
            const response = await axios.post(`${baseUrl}/api/v1/therapists`, data, {withCredentials: true})
            if (response.status === 201) {
                sessionStorage.setItem('userId', response.data.id)
                sessionStorage.setItem('isTherapist', 'true')
                history.push({pathname: '/therapists/settings'})
            } else {
                setSignupError('There was an error signing you up!')
            }
            
        } catch (err) {
            setSignupError('There was an error signing you up!')
        }
        
      };
    
    return (
        <FullLayout>
        <Row className="TSetPassword">
            <Col lg={4} xs={2}></Col>
            <Col lg={16} xs={20}>
                <Header className="TSetPassword__Col__Header">  
                <h1>Welcome to Safespace. Please set a secure Password for your account.</h1> 
                </Header> 
                <Row>
                <Col lg={4}></Col>
                    <Col lg={16} xs={24} className="TSetPassword__Col__Form">
                    <span style={{color:'red'}}>{signupError}</span>
                      <Form
                        name="basic"
                        size="large"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        onFinish={onFinish}
                        layout="vertical"
                        >


                        <Form.Item
                            label="Enter your Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Enter your Password"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                {
                                  required: true,
                                  message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                  },
                                }),
                              ]}
                        >
                            <Input.Password />
                        </Form.Item>

                    
                        <Form.Item wrapperCol={{ span: 24 }} className="TSetPassword__Col__Form__Button">
                        <Button type="default" htmlType="submit">
                            SIGN UP NOW
                            </Button>
                        </Form.Item>
                        </Form>
                    </Col>
                    <Col lg={4}></Col>
                </Row> 
            </Col>
            <Col></Col>
        </Row>

    </FullLayout>

    )
}

export default TherapistSetPassword