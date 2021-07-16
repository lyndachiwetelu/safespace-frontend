import { message, Button, Col, Form, Input, InputNumber, Layout,Row, Select, Slider, Switch, Upload} from 'antd'
import { useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import FullLayout from '../../components/Layout/FullLayout'
import './TherapistSettings.css'

const TherapistSettings = () => {
    const { Header } = Layout
    const { Option } = Select
    const { TextArea } = Input

    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState('')

    const onFinish = (values:any) => {
        console.log(values)
    }

    const getBase64 = (img:any, callback:any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const beforeUploadImage= (file:any )=> {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      }

    const handleChangeImage = (info:any) => {
        if (info.file.status === 'uploading') {
          setLoading(true);
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, (imageUrl: any) => {
            setLoading(false);
            setImageUrl(imageUrl);
          }
            
          );
        }
      };

      const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Enter Profile Picture</div>
        </div>
      );

    return (
        <FullLayout>
        <Row className="TSettings">
            <Col lg={4} xs={2}></Col>
            <Col lg={16} xs={20}>
                <Header className="TSettings__Col__Header">  
                <h3>Update your Profile to be able to be matched to Patients</h3> 
                </Header> 
                    <Form
                        className="TSettings__Form"
                        layout="vertical"
                        labelCol={{ span: 16 }}
                        wrapperCol={{ span: 20 }}
                        onFinish={onFinish}
                        initialValues={{age: [20, 50] }}
                    >
                    <Row>
                    <Col lg={12} md={12} xs={12} className="TSettings__Form--left">   
                        <Form.Item label="Your Full Name" name="name" rules={[{ required: true, message: 'Enter Full Name' }]}>
                        <Input />
                        </Form.Item>
                        <Form.Item label="Your Qualifications" name="qualifications" rules={[{ required: true, message: 'Enter qualifications!' }]}>
                        <Input />
                        </Form.Item>
                        <Form.Item label="Select time per session" name="timePerSession" rules={[{ required: true, message: 'Select single session duration' }]}>
                        <Select>
                            <Select.Option value="30">30 Minutes</Select.Option>
                            <Select.Option value="60">60 Minutes</Select.Option>
                        </Select>
                        </Form.Item>
                        <Form.Item label="Price per session in $" name="pricePerSession" rules={[{ required: true, message: 'Price is required' }]}>
                        <InputNumber min={5} max={10000} />
                        </Form.Item>
                        
                    <Form.Item
                        name="ailments"
                        label="Select all the ailments that apply to you"
                        labelCol={{lg: {span:24}}}
                        rules={[{ required: true, message: 'Please select which of these apply to you', type: 'array' }]}
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
                        label="Are you a Religious Therapist"
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

                        
                        </Col>
                        <Col lg={12} md={12} xs={12} className="TSettings__Form--right">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUploadImage}
                            onChange={handleChangeImage}
                        >
                             {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                        <Form.Item label="Your Summary" name='summary' rules={[{ required: true, message: 'This is required!' }]}>
                           <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item label="Range of Age for Therapy" name="age" rules={[{ required: true, message: 'Age range is required!' }]}>
                         <Slider range min={15} max={200}/>
                        </Form.Item>

                        <Form.Item valuePropName="checked" name="couplesTherapy" label="Are you interested in Couples Therapy" labelCol={{lg: {span:24}}}>
                            <Switch />
                         </Form.Item>

                        <Form.Item
                                name="media"
                                label="Voice, Video or Text"
                                labelCol={{lg: {span:24}}}
                                rules={[{ required: true, message: 'Please select your preferred media.', type: 'array' }]}
                            >
                            <Select mode="multiple" placeholder="Please select all preferred media">
                                <Option value="video">Video</Option>
                                <Option value="voice">Voice</Option>
                                <Option value="text">Text</Option>
                            </Select>
                            </Form.Item>

                    </Col>
                    </Row>
                    <Form.Item>
                        <Button htmlType="submit" size="large" className="TSettings__Form__Button">Save Settings Now</Button>
                    </Form.Item>
                    </Form>
            </Col>
            <Col lg={4} xs={2}></Col>
        </Row>

    </FullLayout>
    )

}

export default TherapistSettings