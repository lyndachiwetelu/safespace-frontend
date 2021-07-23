import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { loggedInContext } from "../../context/loggedInContext";

const ProtectedRoute = ({component:Component, path, ...rest} : {component:any, path:string}) => {
    const isLoggedIn = useContext(loggedInContext);
    let loginUrl: string = '/login'
    const isTherapist: string = sessionStorage.getItem('isTherapist') || ''
    if (isTherapist === 'true') {
        loginUrl = '/therapists/login'
    }
    return (
        <Route
          path={path}
          {...rest}
          render={(props) => {
            return isLoggedIn ? <Component {...props} /> : <Redirect to={loginUrl} />;
          }}
        />
      );
}


export default ProtectedRoute;