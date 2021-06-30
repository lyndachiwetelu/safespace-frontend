import {
    Row,
    Col,
    Form,
    Button,
    Select,
    InputNumber,
    Switch
  } from 'antd';
  
import { Layout } from "antd"
import FullLayout from "../../components/Layout/FullLayout"
import './Questionnaire.css'
import { useHistory } from 'react-router-dom';

const { Header } = Layout

const Questionnaire = () => {

    const history = useHistory();

    const { Option } = Select;

    const onFinish = (values: any) => {
        console.log('Success:', values);
        history.push('/signup');
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (<FullLayout>
        <Row className='Questionnaire'>
            <Col lg={4} xs={2}>
            </Col>

            <Col lg={16} xs={20} className="Questionnaire__Col">
              <Header className="Questionnaire__Col_Header">  
                <h1>Please answer all these questions in order to help us match you with a therapist.</h1> 
               </Header>
               <Row className="Questionnaire__Col__Row">
                   <Col lg={4} xs={4}>
                    
                   </Col>
                   <Col lg={16} xs={16} className="Questionnaire__Col__Row__Col__Form">
                   <Form
                        labelCol={{ span: 20 }}
                        wrapperCol={{ span: 24 }}
                        layout="vertical"
                        size="large"
                        style={{border:'1px solid #27a68f', padding: '10px', marginBottom: '10px'}}
                        className="Questionnaire__Form"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                    <Form.Item 
                        name='age'
                        label="How old are you?"
                        labelCol={{lg: {span:24}}}
                        rules={[{required: true, message: 'Please enter your age.' }]}>
                            <InputNumber min={1} />
                    </Form.Item>

                    <Form.Item
                        name="previous-therapy"
                        label="Have you ever been in Therapy?"
                        hasFeedback
                        labelCol={{lg: {span:24}}}
                        rules={[{ required: true, message: 'This is required!' }]}
                    >
                        <Select placeholder="Select">
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                        </Select>
                    </Form.Item>

        
                <Form.Item
                    name="select-ailments"
                    label="Select all the ailments that apply to you"
                    labelCol={{lg: {span:24}}}
                    rules={[{ required: true, message: 'Please select which of these apply to you', type: 'array' }]}
                >
                <Select mode="multiple" placeholder="Please select all those that apply">
                    <Option value="depression">Depression</Option>
                    <Option value="anxiety">Anxiety</Option>
                    <Option value="bipolar-disorder">Bipolar Disorder</Option>
                    <Option value="eating-disorder">Anorexia, bulimia, and other eating disorders</Option>
                    <Option value="ptsd">Posttraumatic stress disorder (PTSD)</Option>
                    <Option value="addiction">Addictions</Option>
                    <Option value="personality-disorder">Personality disorders</Option>
                </Select>
                </Form.Item>

                <Form.Item
                        name="religious-based-therapy"
                        label="Would you prefer a Religious Therapist?"
                        hasFeedback
                        labelCol={{lg: {span:24}}}
                        rules={[{ required: true, message: 'This is required!' }]}
                    >
                        <Select placeholder="Select">
                        <Option value="no">No</Option>
                        <Option value="christian">Yes, Christian</Option>
                        <Option value="muslim">Yes, Muslim</Option>
                        <Option value="hindu">Yes, Hindu</Option>
                        <Option value="buddhist">Yes, Buddhist</Option>
                        </Select>
                    </Form.Item>

                <Form.Item
                    name="select-media"
                    label="Voice Video or Text"
                    labelCol={{lg: {span:24}}}
                    rules={[{ required: true, message: 'Please select your preferred media.', type: 'array' }]}
                >
                <Select mode="multiple" placeholder="Please select all preferred media">
                    <Option value="video">Video</Option>
                    <Option value="voice">Voice</Option>
                    <Option value="text">Text</Option>
                </Select>
                </Form.Item>
                
                <Form.Item valuePropName="checked" name="couples-therapy" label="Are you interested in Couples Therapy" labelCol={{lg: {span:24}}}>
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Button className="QuestionnaireButton" htmlType="submit">CONTINUE TO SIGNUP</Button>
                </Form.Item>
                </Form>
                        
                   </Col>
                   <Col lg={4} xs={4}></Col>
               </Row>
            </Col>

            <Col>
            </Col>
        </Row>
        
    </FullLayout>)
}

export default Questionnaire