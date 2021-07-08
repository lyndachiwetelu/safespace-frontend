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
import AboutAndPricing from './pages/AboutAndPricing/AboutAndPricing';
import Faq from './pages/Faq/Faq';
import Login from './pages/Login/Login';
import Questionnaire from './pages/Questionnaire/Questionnaire';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import Signup from './pages/Signup/Signup';
import TherapistList from './pages/TherapistList/TherapistList';
import SingleTherapist from './pages/SingleTherapist/SingleTherapist';
import Availability from './pages/Availability/Availability';
import BookingConfirmation from './pages/BookingConfirmation/BookingConfirmation';

const { Header } = Layout

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
              <Menu.Item key="about" className='MenuItem'>
                  <Link to="/about">About and Pricing</Link>        
              </Menu.Item>
              <Menu.Item key="faq" className='MenuItem'>
                  <Link to="/faq">FAQ</Link>
              </Menu.Item>
              <Menu.Item key="how-it-works" className='MenuItem'>
                  <Link to="/how-it-works">How it works</Link>
              </Menu.Item>
              <Menu.Item key="login" className='MenuItem'>
                  <Link to="/login">Log in</Link>
              </Menu.Item>
          </Menu>
          <Switch>
          <Route path="/about">
              <AboutAndPricing />
            </Route>
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
            <Route path="/therapists/:id" children={<SingleTherapist />} />
            <Route path="/therapists">
              <TherapistList />
            </Route>
            <Route path="/booking/confirmation" children={<BookingConfirmation />} />
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