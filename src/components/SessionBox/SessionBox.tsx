import { Button, Col, Modal, Row } from 'antd'
import { useState } from 'react'
import './SessionBox.css'
import checked from './../../images/checked.png'
import axios from 'axios'

const SessionBox = ( { session, type, fetch, isTherapist = false  } : { session:any, type:string, fetch:Function, isTherapist?: boolean} ) => {
    const isDisabled = (time: string, type: string ) => {
        if (time === "upcoming" && type === "join") {
            return true
        }

        return false
    }

    const updateStatus = async (id: number) => {
        const url = `${process.env.REACT_APP_API_URL}/api/v1/sessions/${id}/status`
        const body = {
            status: 'cancelled'
        }

        try {
            const response = await axios.patch(url, body, {withCredentials:true})
           if (response.status === 200) {
               return true
           }
        } catch (err) {
            return false
        }
        return false
    }

    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    const showModal = () => {
      setIsCancelModalVisible(true);
    };
  
    const handleOkCancel = async () => {
      setIsCancelModalVisible(false);
      if (await updateStatus(session.id) === true) {
        setIsConfirmModalVisible(true)
      } 
    };

    const handleCancelModalCancel = () => {
      setIsCancelModalVisible(false);
    };

    const handleCancelConfirm = () => {
        fetch()
        setIsConfirmModalVisible(false)
    }

    return (
            <Row className="SessionBox" gutter={5}>
            <Modal 
             title="Cancel Session"
             visible={isCancelModalVisible} 
             onOk={handleOkCancel} 
             onCancel={handleCancelModalCancel} 
             cancelText='DO NOT CANCEL'
             okText='YES, CANCEL'
             okButtonProps={{style:{background:'green',color:'white'}}}
             cancelButtonProps={{style:{background:'#27a68f', color:'white'}}}
             centered={true}
              >
                <p>Are you sure you want to cancel your session for {session.day} {session.from}-{session.to} with {session.therapistInfo.name}?
                You will be charged $30 for late cancellation and refunded ${session.therapistInfo.therapistSetting.pricePerSession - 30}.</p>
                <p>If yes, please select a reason</p>

                <label className="SessionBox__container">I don’t want therapy anymore
                    <input type="radio" checked={true} name="radio" readOnly />
                    <span className="SessionBox__container__checkmark"></span>
                </label>

                <label className="SessionBox__container">I found a better fit on this website
                    <input type="radio" name="radio" readOnly />
                    <span className="SessionBox__container__checkmark"></span>
                </label>

                <label className="SessionBox__container">I found a better fit elsewhere
                    <input type="radio" name="radio" readOnly />
                    <span className="SessionBox__container__checkmark"></span>
                </label>

                <label className="SessionBox__container">My reason isn’t specified here
                    <input type="radio" name="radio" readOnly />
                    <span className="SessionBox__container__checkmark"></span>
                </label>


            </Modal>
            <Modal 
            visible={isConfirmModalVisible} 
            footer={null} wrapClassName="CancelConfirmedModal" 
            closable={false}>
                <img src={checked} width='50' height='50' alt='cancel-confirmed' />
                <h3>YOUR SESSION HAS BEEN CANCELLED AND A REFUND HAS BEEN INITIATED</h3>
                <Button onClick={handleCancelConfirm} size='large'>DISMISS</Button>
            </Modal>
                <Col lg={18} md={18} xs={24}>
                   <Row className="SessionBox__Details">
                       <Col lg={8} md={8} xs={8}><p>{session.day}</p></Col>
                       <Col lg={8} md={8} xs={8}><p>{session.from} - {session.to}</p></Col>
                       <Col lg={8} md={8} xs={8}><p>{isTherapist ? session.user.name : session.therapistInfo.name}</p></Col>
                   </Row>
                
                </Col>
                <Col lg={3}>
                   { type === 'upcoming' || type === 'active' ? <Button size="large" className="SessionBox__Button--Join" disabled={isDisabled(type, 'join')}>JOIN</Button> : null}
                   { type === 'past' ? <Button size="large" className="SessionBox__Button--Details">DETAILS</Button> : null }
                </Col>
                <Col lg={3}>
                    { type === 'upcoming' ? <Button  size="large" className="SessionBox__Button--Cancel" onClick={showModal}>CANCEL</Button> : null}
                </Col>
            </Row>
    )
}

export default SessionBox