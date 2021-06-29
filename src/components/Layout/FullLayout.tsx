import { Layout } from "antd";
import './FullLayout.css'

const { Content, Footer } = Layout;

type FullLayoutProps = {
    children: JSX.Element|JSX.Element[]
}

const FullLayout = ({ children }: FullLayoutProps) => {
    
    return (
          <>
            <Content>
            {children}
            </Content>
            <Footer className="AppFooter">Safespace copyright 2021</Footer>
          </>
    )
}

export default FullLayout