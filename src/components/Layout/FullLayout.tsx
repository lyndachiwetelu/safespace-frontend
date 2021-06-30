import { Layout } from "antd";
import './FullLayout.css'

const { Content, Footer } = Layout;

type FullLayoutProps = {
    children: JSX.Element|JSX.Element[]
}

const FullLayout = ({ children }: FullLayoutProps) => {
    
    return (
          <div className="FullLayout">
            <Content className="FullLayout__Content">
            {children}
            </Content>
            <Footer className="AppFooter">Safespace copyright 2021</Footer>
          </div>
    )
}

export default FullLayout