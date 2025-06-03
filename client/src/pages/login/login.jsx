import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import loginBild from "../../assets/sign_login.jpg";
import { AuthContext } from "../../context/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setErr] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlechange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/home");
    } catch (err) {
      setErr(err.response?.data || "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-form-wrapper">
          <h2 className="login-title">Welcome Back👋 </h2>
          <form>
            <div className="login-field">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your Username"
                name="username"
                onChange={handlechange}
              />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="*******"
                name="password"
                onChange={handlechange}
              />
            </div>
            {err && <span className="error-message">{err}</span>}
            <button type="submit" className="login-btn" onClick={handleLogin}>
              Login
            </button>
          </form>
          <div className="login-divider">
            <hr />
            <span>or</span>
            <hr />
          </div>
          <div className="login-signup-link">
            Don't have an account?{" "}
            <Link to="/register" className="login-link">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <div className="login-right">
        <img src={loginBild} alt="login" />
      </div>
    </div>
  );
};

export default Login;
