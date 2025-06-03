import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./register.scss";
import login from "../../assets/sign_login.jpg";
import axios from "axios";
const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const handlechange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err);
  return (
    <div className="register-container">
      {/* Left Panel */}
      <div className="register-left">
        <div className="register-form-wrapper">
          <h2 className="register-title">Get Started Now</h2>
          <form>
            <div className="register-field">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter a username"
                name="username"
                onChange={handlechange}
              />
            </div>
            <div className="register-field">
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                onChange={handlechange}
              />
            </div>
            <div className="register-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="*******"
                name="password"
                onChange={handlechange}
              />
            </div>
            {err && <span className="error-message">{err}</span>}
            {/* Submit Button */}
            <button
              type="submit"
              className="register-btn"
              onClick={handleClick}
            >
              Signup
            </button>
          </form>
          {/* Divider */}
          <div className="register-divider">
            <hr />
            <span>or</span>
            <hr />
          </div>
          {/* Sign In Link */}
          <div className="register-signin-link">
            Have an account?{" "}
            <Link to="/login" className="register-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      {/* Right Panel */}
      <div className="register-right">
        <img src={login} alt="login" />
      </div>
    </div>
  );
};

export default Register;
