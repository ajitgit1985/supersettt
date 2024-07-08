import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import Username from "../../assets/images/user.svg";
import Password from "../../assets/images/password.svg";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

const users = [
  {
    username: "sambhav",
    password: "sambhav123",
  },
  {
    username: "sambhav2",
    password: "sambhav123",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const isAuthenticated = false;

  const checkUser = () => {
    return users.find(
      (user) =>
        user.username === data.username && user.password === data.password
    );
  };

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const usercheck = checkUser();
    if (usercheck) {
      // alert("Login Successful");
      let path = `/sambhavDashboard`;
      navigate(path);
    } else {
      alert("Wrong Password or Username");
    }
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  if (isAuthenticated) {
    navigate("/sambhavDashboard");
    return null;
  }

  return (
    <>
      <Header />
      <div className="login_section">
        <div className="container-fluid">
          <div className="row h-100">
            <div className="col-md-12">
              <div className="smv_login">
                <div className="login-text text-center">
                  <h4 className="pg_heading mb-4">USER LOGIN</h4>
                </div>

                <div className="login_box">
                  <form className="login_form" onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                      <label>Username</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text smv_input">
                            <img src={Username} alt="username" />
                          </span>
                        </div>
                        <input
                          type="text"
                          name="username"
                          value={data.username}
                          className="form-control"
                          placeholder="Enter Username"
                          onChange={changeHandler}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Password</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text smv_input">
                            <img src={Password} alt="password" />
                          </span>
                        </div>
                        <input
                          className="form-control"
                          type={type}
                          name="password"
                          placeholder="Enter Password"
                          value={data.password}
                          onChange={changeHandler}
                          autoComplete="current-password"
                          required
                        />
                        <div className="input-group-append">
                          <span
                            className="input-group-text"
                            id="basic-addon2"
                            onClick={handleToggle}
                          >
                            <Icon
                              className="absolute mr-10"
                              icon={icon}
                              size={25}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="submit_box">
                      <button type="submit" className="NEbtn btn_login">
                        LOGIN
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer className="overview_pad prayas__ml_250" />
    </>
  );
};

export default Login;
