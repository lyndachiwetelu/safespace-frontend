import { Button, Layout, Menu } from "antd";
import { useState } from "react";
import './FullLayout.css'

const { Header, Content, Footer } = Layout;

type FullLayoutProps = {
    children: JSX.Element|JSX.Element[]
}

const FullLayout = ({ children }: FullLayoutProps) => {

    const [current, setCurrent] = useState('');

    const handleClick = (e: any) => {
        setCurrent(e.key);
      };

    return (
        <>
        <Header className="AppHeader">
            <div className="AppLogo">SAFESPACE</div>
            <Menu theme="light" onClick={handleClick} selectedKeys={[current]} mode="horizontal" className='AppHeader__Menu'>
                <Menu.Item key="get" className='MenuItem'>
                    <Button className="AppHeader__Menu__Button">GET STARTED</Button>
                </Menu.Item>
                <Menu.Item key="mail" className='MenuItem'>
                    About Pricing
                </Menu.Item>
                <Menu.Item key="app" className='MenuItem'>
                    FAQ
                </Menu.Item>
                <Menu.Item key="three" className='MenuItem'>
                    How it works
                </Menu.Item>
                <Menu.Item key="login" className='MenuItem'>
                    Log in
                </Menu.Item>
            </Menu>
        </Header>
         <Content>
            {children}
         </Content>
         <Footer className="AppFooter">Safespace copyright 2021</Footer>
        </>
    )
}

export default FullLayout