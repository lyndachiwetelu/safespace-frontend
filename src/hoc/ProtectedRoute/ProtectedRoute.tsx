import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({component:Component, path, loggedIn, ...rest} : {component:any, path:string, loggedIn: boolean}) => {   
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
            return loggedIn ? <Component {...props} /> : <Redirect to={loginUrl} />;
          }}
        />
      );
}


export default ProtectedRoute;