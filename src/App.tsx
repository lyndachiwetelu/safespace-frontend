import './App.css';
import Home from './pages/Home/Home';
import { useCallback, useEffect, useState } from "react";
import {
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { Menu, Button, Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Faq from './pages/Faq/Faq';
import Login from './pages/Login/Login';
import Questionnaire from './pages/Questionnaire/Questionnaire';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import Signup from './pages/Signup/Signup';
import TherapistList from './pages/TherapistList/TherapistList';
import SingleTherapist from './pages/SingleTherapist/SingleTherapist';
import Availability from './pages/Availability/Availability';
import BookingConfirmation from './pages/BookingConfirmation/BookingConfirmation';
import BookingConfirmed from './pages/BookingConfirmed/BookingConfirmed';
import Sessions from './pages/Sessions/Sessions';
import TherapistSignup from './pages/TherapistSignup/TherapistSignup';
import TherapistSetPassword from './pages/TherapistSetPassword/TherapistSetPassword';
import TherapistSettings from './pages/TherapistSettings/TherapistSettings';
import TherapistLogin from './pages/TherapistLogin/TherapistLogin';
import TherapistSessions from './pages/TherapistSessions/TherapistSessions';
import TherapistAvailability from './pages/TherapistAvailability/TherapistAvailability';
import Session from './pages/Session/Session';
import ProtectedRoute from './hoc/ProtectedRoute/ProtectedRoute';
import axios from 'axios';

const { Header } = Layout
const { SubMenu } = Menu

const App = () => {
  
  const location = useLocation()
  const [current, setCurrent] = useState('');
  const [therapist, setTherapist] = useState(sessionStorage.getItem('isTherapist'));
  const [loggedIn, setLoggedIn]: [loggedIn:boolean, setLoggedIn:Function] = useState(false)

  const checkIfUserIsLoggedIn =  useCallback(async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/isLoggedIn`, {withCredentials:true})
        if (response.status === 200) {
            setLoggedIn(true)
        } 
    } catch (err) {
        setLoggedIn(false)
    }
},[])

useEffect(() => {
    checkIfUserIsLoggedIn()
}, [])

  useEffect(() => {
    setCurrent(location.pathname.slice(1))
  }, [location.pathname])

  const handleClick = (e: any) => {
      setCurrent(e.key);
  };

  useEffect(() => {
    let isTherapist = sessionStorage.getItem('isTherapist')
    if (isTherapist === 'true') {
        setTherapist('true')
    } else {
      setTherapist('false')
    }
  }, [location]);

  

  return (
     <>
      <Header className="AppHeader">
        <div className="AppLogo"><Link to="/">SAFESPACE</Link></div>
       
            <Menu theme="light" onClick={handleClick} selectedKeys={[current]} mode="horizontal" className='AppHeader__Menu'>
            <Menu.Item key="get-started" className='MenuItem'>
                  <Button className="AppHeader__Menu__Button"><Link to="/get-started">GET STARTED</Link></Button>
              </Menu.Item>
              <Menu.Item key="sessions" className='MenuItem'>
                {therapist === 'false' ? <Link to="/sessions">Sessions</Link>  : <Link to="/therapists/my/sessions">Sessions</Link>   }     
              </Menu.Item>
              {therapist === 'false' ? (<Menu.Item key="therapists" className='MenuItem'>
                  <Link to="/therapists">Therapists</Link>        
              </Menu.Item>) : null}
              <Menu.Item key="faq" className='MenuItem'>
                  <Link to="/faq">FAQ</Link>
              </Menu.Item>
              <Menu.Item key="how-it-works" className='MenuItem'>
                  <Link to="/how-it-works">How it works</Link>
              </Menu.Item>
              
              <SubMenu key="login" title="Login" className="AppHeader__Menu__SubMenu">
              <Menu.Item key="login-patient" className='MenuItem'>
                  <Link to="/login">Patient Log in</Link>
              </Menu.Item>
              <Menu.Item key="therapists/signup" className='MenuItem'>
                  <Link to="/therapists/signup">Therapist Log in</Link>
              </Menu.Item>
          
            </SubMenu>

            { therapist === 'true' ? (<SubMenu key="you" title="You" className="AppHeader__Menu__SubMenu" icon={<UserOutlined />}>
              <Menu.Item key="therapist/settings" className='MenuItem'>
                  <Link to="/therapists/settings">Profile Settings</Link>
              </Menu.Item>
              <Menu.Item key="therapists/availability" className='MenuItem'>
                  <Link to="/therapists/availability">Availability</Link>
              </Menu.Item>
          
            </SubMenu>): null}
            
          </Menu>
          <Switch>
            <Route path="/faq">
              <Faq />
            </Route>
            <Route path="/how-it-works">
              <HowItWorks />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>

            <ProtectedRoute path="/therapists/:id/availability" component={Availability} loggedIn={loggedIn}/>
            <ProtectedRoute path="/therapists/settings" component={TherapistSettings} loggedIn={loggedIn}/>
            <ProtectedRoute path="/therapists/my/sessions" component={TherapistSessions} loggedIn={loggedIn}/>
            <ProtectedRoute path="/therapists/availability" component={TherapistAvailability} loggedIn={loggedIn}/>
            <Route path="/therapists/signup" children={<TherapistSignup />} />
            <Route path="/therapists/login" children={<TherapistLogin />} />
            <Route path="/therapists/set-password" children={<TherapistSetPassword />} />
            <ProtectedRoute path="/therapists/:id" component={SingleTherapist} loggedIn={loggedIn}/>
            <ProtectedRoute path="/therapists" component={TherapistList} loggedIn={loggedIn}/>
            <ProtectedRoute path="/booking/confirmed" component={BookingConfirmed} loggedIn={loggedIn}/>
            <ProtectedRoute path="/booking/confirmation" component={BookingConfirmation} loggedIn={loggedIn}/>
            <ProtectedRoute path="/sessions" component={Sessions} loggedIn={loggedIn}/>
            <ProtectedRoute path="/session/:id" component={Session} loggedIn={loggedIn}/>

            <Route path="/get-started">
              <Questionnaire />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          </Header>
    </>)
}

export default App