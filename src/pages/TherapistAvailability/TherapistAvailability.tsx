import FullLayout from '../../components/Layout/FullLayout'
import './TherapistAvailability.css'
import { Badge, Button, Calendar, Layout, message, Modal, TimePicker } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const TherapistAvailability = () => {
    const { Header } = Layout
    const history = useHistory()

    const [dateSelected, setDateSelected] = useState(null)
    const [availability, setAvailability]: [availability:any , setAvailability:Function] = useState([])
    const [availabilities, setAvailabilities]: [availabilities:any , setAvailabilities:Function] = useState([])
    
    const onDateSelected = (value:any) => {
        setDateSelected(value.format('YYYY-MM-DD'));
    }

    const [visible, setVisible] = useState(false);


    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    }

    const getAvailabilityDataForDay = (value:any) => {
        const day = value.format('YYYY-MM-DD')
        const dayAvailabilities = availabilities.filter((avail:any) => { return avail.day === day  })
        return dayAvailabilities;
    }

    const dateCellRender = (value: any) => {
    const availabilities = getAvailabilityDataForDay(value);
    return (
        <ul style={{listStyle: 'none'}}>
        {availabilities.map((item:any) => (
            <li key={item.id}>
            <Badge status='success' text={`${item.from} - ${item.to}`} />
            </li>
        ))}
        </ul>
    );
    }

    const fetchAvailabilities = async () => {
        const therapistId = sessionStorage.getItem('isTherapist') ? sessionStorage.getItem('userId'): null
        if (therapistId !== null) {
            const url = `${process.env.REACT_APP_API_URL}/api/v1/availabilities/${therapistId}`
            try {
                const response = await axios.get(url, {withCredentials: true})
                setAvailabilities(response.data)
            } catch (e) {
              // handle error
            }
            }
        }

    const addAvailability = useCallback( async () => {
    const from: string = availability[0].format('HH:mm');
    const to: string  = availability[1].format('HH:mm');
    const data = {
        from,
        to,
        day: dateSelected,
    }

    const baseUrl = process.env.REACT_APP_API_URL 
    const therapistId = sessionStorage.getItem('isTherapist') ? sessionStorage.getItem('userId'): null

    if (therapistId === null) {
        history.push('/therapists/login')
    }
   
    try {
        const response = await axios.post(`${baseUrl}/api/v1/availabilities/${therapistId}`, data, {withCredentials: true})
        if (response.status === 201) {
            message.success('Successfully added availability')
        } else {
            message.error('Error adding availability. Please try again')
        }

    } catch(err) {
        console.log(err)
    }
    
    }, [availability, dateSelected, history])

    useEffect(() => {
        fetchAvailabilities()
    }, [addAvailability]);

    return (
        <FullLayout>
        <Modal
        title={`Choose time for this Date: ${dateSelected}`}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="I'm done"
      >
        <TimePicker.RangePicker defaultValue={[moment(), moment().add(1, 'hours')]} onOk={(avail) => setAvailability(avail)}/>
        <Button onClick={() => {addAvailability()}}>Add Availability</Button>
      </Modal>
            <div className='TAvailability'>
                <Header className="TAvailability__Header">  
                
                {dateSelected ? (<div className="TAvailability__Header--Info"><h3>Enter Availability For Date: {dateSelected}</h3> 
                    <Button onClick={showModal}>Add Now</Button> </div>) : (<h3>Select Date</h3>)}   
                    </Header> 
                <Calendar dateCellRender={dateCellRender} onSelect={onDateSelected} />
            </div>
        </FullLayout>
    )
}
export default TherapistAvailability






