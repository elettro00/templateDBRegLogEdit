import React, { Component } from 'react'

class Navbar extends Component {

    componentDidMount = () => {
        // console.log(this.props.Store.getState()["CheckAction"]["isAuth"]);
    }

    state = {  } 
    render() { 
        return (<>
            <div className="container-vg">
                    {
                        !this.props.Store.getState()["CheckAction"]["isAuth"] ?
                        <div className="d-flex flex-row-reverse bd-highlight p-2">
                            <div className="m-2 bd-highlight navbarLink h4" onClick={() => window.location.pathname = "/"}>Home</div>
                            <div className="m-2 bd-highlight navbarLink h4" onClick={() => window.location.pathname = "/Login"}>Login</div>
                            <div className="m-2 bd-highlight navbarLink h4" onClick={() => window.location.pathname = "/Register"}>Register</div>
                        </div>
                        :
                        <div className="d-flex flex-row-reverse bd-highlight p-2">
                            <div className="m-2 bd-highlight navbarLink h4" onClick={() => window.location.pathname = "/"}>Home</div>
                            <div className="m-2 bd-highlight navbarLink h4" onClick={() => window.location.pathname = "/Profile"}>Profile</div>
                            <div className="m-2 bd-highlight navbarLink h4" onClick={(this.props.LogOut)}>Logout</div>                   
                        </div>
                    }
                </div>
            </>
        );
    }
}
 
export default Navbar;