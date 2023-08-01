import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatarImage:
      "data:image/png;base64,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",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 3) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand"></div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
