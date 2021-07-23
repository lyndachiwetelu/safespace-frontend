import { useContext, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { loggedInContext } from "../../context/loggedInContext";

const ProtectedRoute = ({component:Component, path, ...rest} : {component:any, path:string}) => {
    const history = useHistory()
    const isLoggedIn: boolean | null = useContext(loggedInContext);

    useEffect(() => {
        if (sessionStorage.getItem('userId') === null) {
            history.push('/login')
        }
    }, [])


    let loginUrl: string = '/login'
    const isTherapist: string = sessionStorage.getItem('isTherapist') || ''
    if (isTherapist === 'true') {
        loginUrl = '/therapists/login'
    }
   
    return (
        <>
        { isLoggedIn !== null ? <Route
          path={path}
          {...rest}
          render={(props) => {
            return isLoggedIn ? (<Component {...props} />) : (<Redirect to={loginUrl} />);
          }}
        /> : <h1>Hello</h1> }
        </>
    );
}


export default ProtectedRoute;