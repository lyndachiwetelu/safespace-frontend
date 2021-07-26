import { Spin } from "antd";
import { useContext, useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { loggedInContext } from "../../context/loggedInContext";
import './ProtectedRoute.css'


const ProtectedRoute = ({component:Component, path, ...rest} : {component:any, path:string}) => {
    const history = useHistory()
    const isLoggedIn: any = useContext(loggedInContext);

    useEffect(() => {
        if (sessionStorage.getItem('userId') === null) {
            history.push('/login')
        }
    }, [history])

    let loginUrl: string = '/login'
    const isTherapist: string = sessionStorage.getItem('isTherapist') || ''
    if (isTherapist === 'true') {
        loginUrl = '/therapists/login'
    }

    return (
        <>
        {  !isLoggedIn.loading ? <Route
            path={path}
            {...rest}
            render={(props) => {
             return isLoggedIn.loggedIn ? <Component {...props} /> : <Redirect to={{
                pathname: loginUrl,
                state: { from: path }
              }} />  
            }}/> : <Spin /> }
        </>
    
    );

}

export default ProtectedRoute;