import { Col, Row } from "antd"
import FullLayout from "../../components/Layout/FullLayout"
import "./Signup.css"
import { Form, Input, Button, Layout } from 'antd';
import { useHistory, useLocation } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";

const Signup = () => {
    const { Header } = Layout

    const history = useHistory()
    const location = useLocation()
    const { state } : {state: any} = location
    const [signupError, setSignupError] = useState('')

    const onFinish = async (values: any) => {
        const postData = {
            name: values.name,
            email: values.email,
            password: values.password,
            settings:  {
                age: state.age,
                couplesTherapy: state.couplesTherapy ? state.couplesTherapy : false,
                religiousTherapy: state.religiousTherapy,
                hasHadTherapy: state.hasHadTherapy === 'yes' ? true : false,
                ailments: state.ailments,
                media:state.media

            }
        }

        const baseUrl = 'http://localhost:8000'
        try {
            const response = await axios.post(baseUrl + '/api/v1/users', postData)
            if (response.status === 201) {
                history.push({pathname: '/therapists', state:{ userId: response.data.id}})
            } else {
                console.log('STATUS IS NOT 201')
            }
        } catch (err) {
            setSignupError('Error occurred while signing up!')
        }
     
      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <FullLayout>
            <Row className="Signup">
                <Col lg={4} xs={2}></Col>
                <Col lg={16} xs={20}>
                    <Header className="Signup__Col__Header">  
                    <h1>You’re almost there! Please enter your details now to signup and view recommended therapists</h1> 
                    </Header> 
                    <Row>
                    <Col lg={4}></Col>
                        <Col lg={16} xs={24} className="Signup__Col__Form">
                            <span style={{color:'red'}}>{signupError}</span>
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
                                label="Enter a Name you'd like to be identified with."
                                name="name"
                                rules={[{ required: true, message: 'Please enter a name, can be your real name, or not' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Enter your email Address"
                                name="email"
                                rules={[{ required: true, type: 'email', message: 'Please enter a valid email address.' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Choose a Secure Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Confirm Password"
                                name="confirm-password"
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

                            <Form.Item wrapperCol={{ span: 24 }} className="Signup__Col__Form__Button">
                            <Button type="default" htmlType="submit">
                                SIGN UP NOW
                                </Button>
                            </Form.Item>
                            </Form>
                            <p>Already have an account?</p>
                            <Button className="Signup__Col__Form__Button--Login" size="large" onClick={() => history.push('/login')}>
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

export default Signup