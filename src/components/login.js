import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import withContext from "../hoc/withContext";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Fill all the fields");
    }
    props.context.login(email, password).then((loggedIn) => {
      if (!loggedIn) {
        setError("Invalid Credentials");
      }
    });
  };

  return !props.context.user ? (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">Login</h4>
        </div>
      </div>
      <br />
      <br />
      <form onSubmit={login}>
        <div className="columns is-mobile is-centered">
          <div className="column is-one-third">
            <div className="field">
              <label className="label">Email:</label>
              <input
                className="input"
                type="email"
                name="username"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label">Password:</label>
              <input
                className="input"
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="has-text-danger">{error}</div>}
            <div className="field is-clearfix">
              <button className="button is-primary is-outlined is-pulled-left   ">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  ) : (
    <Redirect to="/products" />
  );
};

export default withContext(Login);
