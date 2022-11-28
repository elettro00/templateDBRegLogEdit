import React, { Component } from 'react'
import axios from 'axios';

const URL_BACKEND = "http://localhost:4000/api/Users"

function ValidateEmail(email) 
{
 if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email))
  {
    return (true)
  }
    return (false)
}

class Login extends Component {
  
    state = { email:"",password:""}
    OnChange = (e) => {this.setState({[e.target.name]: e.target.value})}

    OnSubmit = (e) => 
    {
      e.preventDefault()
      this.setState({[e.target.name]: e.target.value})
      
      if(ValidateEmail(this.state.email))
      {
       const Data = {email:this.state.email, password:this.state.password}
      // console.log(Data);
      axios.post(`${URL_BACKEND}/Login`, Data)
        .then(res => {
            // console.log(res);
            const err = res.data.message
            localStorage.setItem("Token",res.data.token)
            this.setState({errors: err})
            if(!err){
                const em = this.state.email
                const pass = this.state.password
                this.setState({email: em, password: pass})
                window.location.pathname = "/"
            }
        })
        .catch(err => {console.log(err);}) 
      }
      else
      {
        this.setState({errors: "Enter a valid email"})
      }
      
    }
    
    render() { 
        return (
            <section className="vh-100">
            <div className="container h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
              {this.state.errors ? <center><i className='alert alert-danger'>
            {this.state.errors}
        </i></center> : ""}
                <div className="col-lg-12 col-xl-11">
                  <div className="card text-black" >
                    <div className="card-body p-md-5">
                      <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
          
                          <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Log in</p>
          
                          <form className="mx-1 mx-md-4">
          

          
                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input autoComplete='true' type="email" id="email" className="form-control" name='email' onChange={this.OnChange} value={this.state.email}/>
                                <label className="form-label" htmlFor="email">Your Email</label>
                              </div>
                            </div>
          
                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input autoComplete='true' type="password" id="password" className="form-control" name='password' onChange={this.OnChange} value={this.state.password}/>
                                <label className="form-label" htmlFor="password">Password</label>
                              </div>
                            </div>
          
                            <div className="d-flex justify-content-center mx-4 mb-2 mb-lg-4">
                              <button autoComplete='submit' type="submit" className="btn btn-primary btn-lg" onClick={this.OnSubmit}>Login</button>
                            </div>
          
                          </form>
                      <div><a href='/Register' onClick={() => window.location.pathname = "/Register"}>Need an account, click here.</a></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                  </section>
        )
    }
}
 
export default Login;