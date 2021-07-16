import { message, Button, Col, Form, Input, InputNumber, Layout, Row, Select, Slider, Switch, Upload} from 'antd'
import { useEffect, useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import FullLayout from '../../components/Layout/FullLayout'
import './TherapistSettings.css'
import axios from 'axios';

const TherapistSettings = () => {
    const { Header } = Layout
    const { Option } = Select
    const { TextArea } = Input

    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        const baseUrl = process.env.REACT_APP_API_URL
        const userId = sessionStorage.getItem('userId')

        async function getSettings() {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/therapists/${userId}/settings`, {withCredentials:true})
                if (res.status === 200) {
                    form.setFieldsValue({
                        name: res.data.name,
                        age: [res.data.ageFrom, res.data.ageTo],
                        couplesTherapy: res.data.couplesTherapy,
                        religiousTherapy: res.data.religiousTherapy,
                        qualifications: res.data.qualifications,
                        media: res.data.media.map((medium: any) => medium.mediaKey),
                        ailments: res.data.ailments.map((ailment: any) => ailment.ailmentKey),
                        summary: res.data.summary,
                        timePerSession: res.data.timePerSession,
                        pricePerSession: res.data.pricePerSession,
                    })
                    setImageUrl(res.data.imageUrl)
                }
               
            } catch (e) {
                // do nothing
            }
        }
        getSettings() 
    }, [form])

    const onFinish = async (values:any) => {
        const data = {
            name: values.name,
            userId: sessionStorage.getItem('userId'),
            ageFrom: values.age[0],
            ageTo: values.age[1],
            qualifications: values.qualifications,
            timePerSession: values.timePerSession,
            pricePerSession: values.pricePerSession,
            religiousTherapy: values.religiousTherapy,
            couplesTherapy: values.couplesTherapy === undefined ? false : values.couplesTherapy,
            media: values.media,
            ailments: values.ailments,
            summary: values.summary,
            imageUrl
        }

        const baseUrl = process.env.REACT_APP_API_URL
        try {
            const response = await axios.post(`${baseUrl}/api/v1/therapists/settings`, data, {withCredentials: true})
            if (response.status === 200) {
                message.success('Profile updated successfully')
            } else {
                message.error(response.data.message)
            }
        } catch (e) {
            message.error('Profile not updated! Please try again.')
        }

        console.log('DATA TO SEND', data)
    }

    const getBase64 = (img:any, callback:any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const uploadImage = ({file}: {file:any}) => {
        const url = "https://api.cloudinary.com/v1_1/lynda/upload";
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "safespace-preset");

        axios.post(url, formData).then(response => {
            setImageUrl(response.data.url)
        }).catch(err => {
            //err.response.data
            console.log('ERROR WITH FILE UPLOAD')
        })
    }
    

    const beforeUploadImage = (file:any )=> {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          message.error('Image must smaller than 5MB!');
        }

        return isJpgOrPng && isLt5M;
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
                <h2 style={{color:'green'}}>Your Profile is 100% complete</h2>
                    <Form
                        className="TSettings__Form"
                        layout="vertical"
                        labelCol={{ span: 16 }}
                        wrapperCol={{ span: 24 }}
                        onFinish={onFinish}
                        form={form}
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
                            beforeUpload={beforeUploadImage}
                            onChange={handleChangeImage}
                            customRequest={uploadImage}
                        >
                             {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', height:'120px' }} /> : uploadButton}
                        </Upload>
                        <Form.Item label="Your Summary" name='summary' rules={[{ required: true, message: 'This is required!' }]}>
                           <TextArea rows={6} />
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