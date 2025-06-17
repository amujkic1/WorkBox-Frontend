import React, { useState } from 'react';
import '../assets/sb-admin-2.css';
import registerGif from '../assets/images/3.gif';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const Register = () => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [role, setRole] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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

      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      switch (role) {
        case 'HR':
          navigate('/hr');
          break;
        case 'FINANCE_MANAGER':
          navigate('/finance');
          break;
        case 'BUSINESS_MANAGER':
          navigate('/business');
          break;
        default:
          navigate('/');
      }

      } else {
        return response.json().then(data => {
          console.error(data.message)
          setTimeout(() => setShowSuccessAlert(false), 4000);
          throw new Error(data.message)
        })
      }
    })
    .catch(error => {
      console.error('Registration error:', error);
      setErrorMessage('Failed to register. Please try again.');
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

                  <div className="col-lg-5 d-none d-lg-block p-3 mt-5">
                    <img
                      src={registerGif}
                      alt="Registration visual"
                      className="img-fluid"
                      style={{ maxHeight: '100%', objectFit: 'cover' }}
                    />
                  </div>

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

                            <div className="form-group row">
                              <div className="col-sm-12 mb-3 mb-sm-0">
                                <select
                                  className="form-select"
                                  value={role}
                                  onChange={(e) => setRole(e.target.value)}
                                >
                                  <option value="" disabled hidden>Select your role</option>
                                  <option value="BUSINESS_MANAGER">Business manager</option>
                                  <option value="FINANCE_MANAGER">Finance manager</option>
                                  <option value="HR">Human resources</option>
                                </select>
                              </div>
                            </div>


                            <button type="submit" className="btn btn-primary btn-user btn-block">
                              Register Account
                            </button>
                            <hr />
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
            {errorMessage && (
              <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                {errorMessage}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"
                  onClick={() => setErrorMessage('')}>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
