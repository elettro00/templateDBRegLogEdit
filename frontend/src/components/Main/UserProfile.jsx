import React, { Component } from 'react'
import axios from "axios"

const URL_BACKEND = "http://localhost:4000/api/Users"

class UserProfile extends Component {

  componentDidMount = () => {
    const Token = localStorage.getItem("Token")
    axios.get(`${URL_BACKEND}/GetUserData`, {
      headers: { Authorization: Token }
    }).then(res => {
      // console.log(res);
      if (res)
        this.setState({ name: res.data.result[0].name, id: res.data.result[0].id, email: res.data.result[0].email, country: res.data.result[0].country, img: res.data.result[0].img })
      // console.log(this.state);
    }).catch(err => console.log(err))
  }

  state = { id: "", name: "", password: "", newPassword: "", repeatNewPassword: "", country: "", img: "", file: "", onEdit: false, errors: "", pwd: "" }
  OnChange = (e) => { this.setState({ [e.target.name]: e.target.value }) }

  OnSubmit = (e) => {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })

    if (this.state.repeatNewPassword === this.state.newPassword) {
      this.setOffEdit()

      const PostData = new FormData()
      PostData.append("name", this.state.name)
      PostData.append("country", this.state.country)

      if (this.state.password && this.state.newPassword) {
        if (this.state.newPassword.length >= 8) {
          PostData.append("newPassword", this.state.newPassword)
          PostData.append("password", this.state.password)
        }
        else {
          this.setState({ errors: "at least 8-character new password" })
        }
      }

      PostData.append("img", this.state.newImg)
      PostData.append("image", this.state.file)

      axios.put(`${URL_BACKEND}/Edit/${this.state.id}`, PostData)
        .then(res => {
          console.log(res);
          const err = res.data.message ? res.data.message : this.state.errors
          const pwd = res.data.pwd
          this.setState({ errors: err, pwd: pwd })
        })
        .catch(err => { console.log(err); })
    }
    else {
      this.setState({ errors: "New Password do not match" })
    }

  }

  handleImageChange = (e) => {
    e.preventDefault()
    let reader = new FileReader()
    let importedFile = e.target.files[0]
    // console.log(importedFile);
    reader.onload = () => {
      this.setState({
        file: importedFile,
        img: reader.result
      })
    }
    reader.readAsDataURL(importedFile)
  }

  setOnEdit = (e) => {
    e.preventDefault()
    this.setState({ onEdit: true })
  }

  setOffEdit = () => {
    this.setState({ onEdit: false, errors: "" })
  }

  render() {
    return (
      <section className="vh-100">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            {
              this.state.errors ? <center><i className='alert alert-danger'>
                {this.state.errors}
              </i></center> : ""
            }
            {this.state.pwd ? <center><i className='alert alert-success'>
              {this.state.pwd}
            </i></center> : ""
            }
            {
              this.state.onEdit ?
                <div className="col-lg-12 col-xl-11">
                  <div className="card text-black" >
                    <div className="card-body p-md-5">
                      <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                          <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Edit Account</p>

                          <form className="mx-1 mx-md-4">

                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input autoComplete='true' type="text" id="name" className="form-control" name="name" value={this.state.name || ""} onChange={this.OnChange} />
                                <label className="form-label" htmlFor="name">Name</label>
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input autoComplete='true' type="text" id="country" className="form-control" name='country' onChange={this.OnChange} value={this.state.country || ""} />
                                <label className="form-label" htmlFor="country">Country</label>
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                              <section>
                                <input className="form-control" id="img" type="file" onChange={this.handleImageChange} />
                                <label className="form-label" htmlFor='img'>Upload Image</label>
                              </section>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input autoComplete='true' type="password" id="password" className="form-control" name='password' onChange={this.OnChange} value={this.state.password || ""} />
                                <label className="form-label" htmlFor="password">Current password</label>
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input autoComplete='true' type="password" id="newPassword" className="form-control" name='newPassword' onChange={this.OnChange} value={this.state.newPassword || ""} />
                                <label className="form-label" htmlFor="newPassword">New password</label>
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input autoComplete='true' type="password" id="repeatNewPassword" className="form-control" name='repeatNewPassword' onChange={this.OnChange} value={this.state.repeatNewPassword || ""} />
                                <label className="form-label" htmlFor="repeatNewPassword">Confirm new password</label>
                              </div>
                            </div>

                            <div className="d-flex justify-content-center mx-4 mb-2 mb-lg-4">
                              <button type="submit" className="btn btn-danger btn-lg" onClick={this.OnSubmit}>Save</button>
                              <button type="button" className="btn btn-primary btn-lg" onClick={this.setOffEdit}>Cancel</button>
                            </div>

                          </form>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                :
                <div className="col-lg-12 col-xl-11">
                  <div className="card text-black" >
                    <div className="card-body p-md-5">
                      <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                          <p className="text-center h1 fw-bold mb-3 mx-1 mx-md-4 mt-4">Your Account</p>

                          <form className="mx-1 mx-md-4">

                            <div className="d-flex flex-row align-items-center mb-4">
                              <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                              <center className="form-outline flex-fill mb-0">
                                {
                                  this.state.img ?
                                    <img style={{ height: "20vh", width: "auto" }} src={this.state.img} alt="img" />
                                    :
                                    <img style={{ height: "20vh", width: "auto" }} src='https://vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' alt="img" />
                                }
                              </center>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input autoComplete='true' type="text" id="name" className="form-control" name="name" value={this.state.name || ""} onChange={this.OnChange} disabled={true} />
                                <label className="form-label" htmlFor="name">Name</label>
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input autoComplete='true' type="email" id="email" className="form-control" name='email' onChange={this.OnChange} value={this.state.email || ""} disabled={true} />
                                <label className="form-label" htmlFor="email">Email</label>
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-2">
                              <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input autoComplete='true' type="text" id="country" className="form-control" name='country' onChange={this.OnChange} value={this.state.country || ""} disabled={true} />
                                <label className="form-label" htmlFor="country">Country</label>
                              </div>
                            </div>

                            <div className="d-flex justify-content-center mx-4 mb-2 mb-lg-4">
                              <button type="submit" className="btn btn-danger btn-lg" onClick={this.setOnEdit}>Edit</button>
                            </div>

                          </form>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            }

          </div>
        </div>
      </section>
    );
  }
}

export default UserProfile;