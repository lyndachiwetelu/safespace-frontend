import './App.css';
import Home from './pages/Home/Home';
import { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { Menu, Button, Layout } from 'antd';
import AboutAndPricing from './pages/AboutAndPricing/AboutAndPricing';
import Faq from './pages/Faq/Faq';
import Login from './pages/Login/Login';
import Questionnaire from './pages/Questionnaire/Questionnaire';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import Signup from './pages/Signup/Signup';

const { Header } = Layout

const App = () => {
  const [current, setCurrent] = useState('');

  const handleClick = (e: any) => {
      setCurrent(e.key);
    };


  return (
     <>
      <Header className="AppHeader">
      <Router>
        <div className="AppLogo"><Link to="/">SAFESPACE</Link></div>
       
            <Menu theme="light" onClick={handleClick} selectedKeys={[current]} mode="horizontal" className='AppHeader__Menu'>
            <Menu.Item key="get" className='MenuItem'>
                  <Button className="AppHeader__Menu__Button"><Link to="/get-started">GET STARTED</Link></Button>
              </Menu.Item>
              <Menu.Item key="mail" className='MenuItem'>
                  <Link to="/about">About and Pricing</Link>        
              </Menu.Item>
              <Menu.Item key="app" className='MenuItem'>
                  <Link to="/faq">FAQ</Link>
              </Menu.Item>
              <Menu.Item key="three" className='MenuItem'>
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
            <Route path="/get-started">
              <Questionnaire />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          </Router>
          </Header>
    </>)
}

export default App