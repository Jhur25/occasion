import React, {useContext} from "react"
import { Route, Redirect } from "react-router-dom"
//import AuthContext from '../../contexts/auth/authContext'

export default function PrivateRoute({ component: Component, ...rest }) {
  //const authContext = useContext(AuthContext)
  //const { isAuthenticated } = authContext;
 // console.log("Calling PrivateRoute Module " + isAuthenticated)
  return (
    <Route
      {...rest}
      render={props => 
        true ? (<Component {...props} />) : (<Redirect to="/notfound" />)
      }
    />
  )
}
