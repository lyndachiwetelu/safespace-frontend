import { Col, Row } from "antd"
import FullLayout from "../../components/Layout/FullLayout"
import "./Signup.css"
import { Form, Input, Button, Layout } from 'antd';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";

const Signup = () => {
    const { Header } = Layout

    const history = useHistory()
    const [signupError, setSignupError] = useState('')
    let questionnaire: any = sessionStorage.getItem('questionnaire')

    if (!questionnaire) {
        history.push('/get-started')
    }

    questionnaire = JSON.parse(questionnaire)
    const onFinish = async (values: any) => {
        const postData = {
            name: values.name,
            email: values.email,
            password: values.password,
            settings:  {
                age: questionnaire.age,
                couplesTherapy: questionnaire.couplesTherapy ? questionnaire.couplesTherapy : false,
                religiousTherapy: questionnaire.religiousTherapy,
                hasHadTherapy: questionnaire.hasHadTherapy === 'yes' ? true : false,
                ailments: questionnaire.ailments,
                media:questionnaire.media

            }
        }

        const baseUrl = process.env.REACT_APP_API_URL
        try {
            const response = await axios.post(baseUrl + '/api/v1/users', postData, { withCredentials: true })
            if (response.status === 201) {
                sessionStorage.removeItem('questionnaire')
                sessionStorage.setItem('userId', response.data.id)
                history.push({pathname: '/therapists', state:{ userId: response.data.id, settings: response.data.settings }})
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