import React, { useState } from 'react';
import '../assets/sb-admin-2.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode";

const Register = () => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [role, setRole] = useState('HR')
  const [errorMessage, setErrorMessage] = useState('')

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
        setErrorMessage("Passwords do not match");
        return;
    }
    const requestBody = { firstName, lastName, username, email, password, role };
    console.log("Body being sent to backend:", requestBody);
    fetch('http://localhost:8080/auth/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody)
    })
    .then(async response => {
      if(response.ok){
        const { token } = await response.json()
        console.log("Registration successfull")
        Cookies.set("token", token)
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
      } else {
        return response.json().then(data => {
          console.error(data.message)
          throw new Error(data.message)
        })
      }
    })
    .catch(error => {
      console.error('Registration error:', error);
      setErrorMessage('Failed to register. Please try again.');
    });
  }

  return (
    <div className="bg-gradient-primary" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
                  <div className="col-lg-7">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                          </div>
                          <form className="user" onSubmit={handleRegister}>
                            <div className="form-group row">
                              <div className="col-sm-6 mb-3 mb-sm-0">
                                <input
                                  type="text"
                                  value={firstName}
                                  onChange={e => setFirstName(e.target.value)}
                                  className="form-control form-control-user"
                                  id="firstName"
                                  placeholder="First Name"
                                />
                              </div>
                              <div className="col-sm-6">
                                <input
                                  type="text"
                                  value={lastName}
                                  onChange={e => setLastName(e.target.value)}
                                  className="form-control form-control-user"
                                  id="lastName"
                                  placeholder="Last Name"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="form-control form-control-user"
                                id="email"
                                placeholder="Email Address"
                              />
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-6 mb-3 mb-sm-0">
                                <input
                                  type="password"
                                  value={password}
                                  onChange={e => setPassword(e.target.value)}
                                  className="form-control form-control-user"
                                  id="password"
                                  placeholder="Password"
                                />
                              </div>
                              <div className="col-sm-6">
                                <input
                                  type="password"
                                  value={repeatPassword}
                                  onChange={e => setRepeatPassword(e.target.value)}
                                  className="form-control form-control-user"
                                  id="repeatPassword"
                                  placeholder="Repeat Password"
                                />
                              </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-user btn-block">
                              Register Account
                            </button>
                            <hr />
                            <button className="btn btn-google btn-user btn-block">
                              <i className="fab fa-google fa-fw" /> Register with Google
                            </button>
                            <button className="btn btn-facebook btn-user btn-block">
                              <i className="fab fa-facebook-f fa-fw" /> Register with Facebook
                            </button>
                          </form>
                          <hr />
                          <div className="text-center">
                            <a className="small" href="#">Forgot Password?</a>
                          </div>
                          <div className="text-center">
                        <a className="small" href="#">Already have an account? Login!</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
