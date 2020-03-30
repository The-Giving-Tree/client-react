/* -------------------------------------------------------------------------- */
/* ALL IMPORTS */
/* -------------------------------------------------------------------------- */
// React
import React, { Component } from 'react';

// Packages
import PropTypes from 'prop-types';

// Context

// Components
import SignupLoginImage from '../../assets/signup-login-img.png';

// Assets
// Constants
// Utils / Methods

// Styles
import '../../styles/signup-login-home-page.css';

/* -------------------------------------------------------------------------- */
/* START OF HOME PAGE FOR LOGGED OUT USERS */
/* -------------------------------------------------------------------------- */
class SignupLoginHomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      name: '',
      password: '',
      selectedTab: 'signup',
      username: ''
    };
  }

  render() {
    const {
      // prettier-ignore
      email,
      name,
      password,
      selectedTab,
      username
    } = this.state;

    const selected = ' selected-tab';

    return (
      <div className="signup-login-container">
        <img
          alt="Giving Tree Project, artwork by Somebody ©"
          className="auth-page-image"
          src={SignupLoginImage}
        />
        <div className="auth-content-container">
          <div className="auth-header-container">
            <h1 className="auth-header-title">Request help or lend a hand</h1>
            <p className="auth-header-info">
              The Giving Tree was created in response to COVID-19. We give people with time and
              resources the opportunity to help anyone who needs it.
            </p>
          </div>
          <div className="auth-form-container">
            <div className="auth-form-tabs">
              <div
                className={`form-tab tab-signup${selectedTab === 'signup' ? ' selected-tab' : ''}`}
              >
                Sign up
              </div>
              <div
                className={`form-tab tab-login${selectedTab === 'login' ? ' selected-tab' : ''}`}
              >
                Login
              </div>
            </div>
            <div className="auth-form-inputs">
              <input
                className="tab-input input-name"
                name="Name"
                placeholder="Name"
                type="text"
                value={name}
              />
              <input
                className="tab-input input-username"
                name="Username"
                placeholder="Username"
                type="text"
                value={username}
              />
              <input
                className="tab-input input-email"
                name="Email"
                placeholder="Email"
                type="email"
                value={email}
              />
              <input
                className="tab-input input-password"
                name="Password"
                placeholder="Password"
                type="password"
                value={password}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  updateInputText() {
    const inputFields = ['email', 'name', 'password', 'username'];
  }
}

/* -------------------------------------------------------------------------- */
/* PROP TYPES DECLARATIONS */
/* -------------------------------------------------------------------------- */
SignupLoginHomePage.defaultProps = {};

SignupLoginHomePage.propTypes = {};

export default SignupLoginHomePage;
