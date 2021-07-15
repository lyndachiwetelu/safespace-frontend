import './App.css';
import Home from './pages/Home/Home';
import { useEffect, useState } from "react";
import {
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { Menu, Button, Layout } from 'antd';
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

const { Header } = Layout
const { SubMenu } = Menu

const App = () => {
  
  const location = useLocation()
  const [current, setCurrent] = useState('');

  useEffect(() => {
    setCurrent(location.pathname.slice(1))
  }, [location.pathname])

  const handleClick = (e: any) => {
      setCurrent(e.key);
    };


  return (
     <>
      <Header className="AppHeader">
        <div className="AppLogo"><Link to="/">SAFESPACE</Link></div>
       
            <Menu theme="light" onClick={handleClick} selectedKeys={[current]} mode="horizontal" className='AppHeader__Menu'>
            <Menu.Item key="get-started" className='MenuItem'>
                  <Button className="AppHeader__Menu__Button"><Link to="/get-started">GET STARTED</Link></Button>
              </Menu.Item>
              <Menu.Item key="sessions" className='MenuItem'>
                  <Link to="/sessions">Sessions</Link>        
              </Menu.Item>
              <Menu.Item key="therapists" className='MenuItem'>
                  <Link to="/therapists">Therapists</Link>        
              </Menu.Item>
              <Menu.Item key="faq" className='MenuItem'>
                  <Link to="/faq">FAQ</Link>
              </Menu.Item>
              <Menu.Item key="how-it-works" className='MenuItem'>
                  <Link to="/how-it-works">How it works</Link>
              </Menu.Item>
              
              <SubMenu key="login" title="Login">
              <Menu.Item key="login-patient" className='MenuItem'>
                  <Link to="/login">Patient Log in</Link>
              </Menu.Item>
              <Menu.Item key="therapists/signup" className='MenuItem'>
                  <Link to="/therapists/signup">Therapist Log in</Link>
              </Menu.Item>
          
            </SubMenu>
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
            <Route path="/therapists/:id/availability" children={<Availability />} />
            <Route path="/therapists/signup" children={<TherapistSignup />} />
            <Route path="/therapists/login" children={<TherapistLogin />} />
            <Route path="/therapists/set-password" children={<TherapistSetPassword />} />
            <Route path="/therapists/settings" children={<TherapistSettings />} />
            <Route path="/therapists/:id" children={<SingleTherapist />} />

            
            <Route path="/therapists">
              <TherapistList />
            </Route>
            <Route path="/booking/confirmed" children={<BookingConfirmed />} />
            <Route path="/booking/confirmation" children={<BookingConfirmation />} />
            <Route path="/sessions" children={<Sessions />} />
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