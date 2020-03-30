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
      selectedFormTab: 'Signup',
      username: ''
    };
  }

  render() {
    const { email, name, password, username } = this.state;

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
              <div className="form-tab tab-signup">Sign up</div>
              <div className="form-tab tab-login">Login</div>
            </div>
            <div className="auth-form-inputs">
              <input
                className="tab-input input-name"
                name="Name"
                onClick={() => {}}
                placeholder="Name"
                type="text"
                value={this.state.name}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/* -------------------------------------------------------------------------- */
/* PROP TYPES DECLARATIONS */
/* -------------------------------------------------------------------------- */
SignupLoginHomePage.defaultProps = {};

SignupLoginHomePage.propTypes = {};

export default SignupLoginHomePage;
