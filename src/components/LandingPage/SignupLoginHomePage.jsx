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

    [
      // prettier-ignore
      'capitalize',
      'updateInputText',
      'updateSelectedTab'
    ].forEach(m => {
      this[m] = this[m].bind(this);
    });
  }

  render() {
    const { selectedTab } = this.state;

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
            {/* ------------- TOP BAR WITH FORM SELECTION TABS ------------- */}
            <div className="auth-form-tabs">
              {['signup', 'login'].map(tabName => {
                const prettyTabName = tabName === 'signup' ? 'Sign up' : 'Login';

                return (
                  <div
                    className={`form-tab tab-${tabName}${
                      selectedTab === tabName ? ' selected-tab' : ' disabled-tab'
                    }`}
                    key={tabName}
                    onClick={() => {
                      if (selectedTab !== tabName) {
                        this.updateSelectedTab(tabName);
                      }
                    }}
                  >
                    {prettyTabName}
                  </div>
                );
              })}
            </div>
            {/* ----- DYNAMIC CONTAINER TO DISPLAY PROPER SELECTED FORM CONTENT ----- */}
            <div className="auth-form-inputs-container">
              {selectedTab === 'signup' && (
                <div className="auth-form-inputs-signup">
                  {['name', 'username', 'email', 'password'].map(inputName => {
                    const capitalizedName = this.capitalize(inputName);

                    return (
                      <input
                        className={`tab-input input-${inputName}`}
                        name={inputName}
                        key={inputName}
                        onChange={e => this.updateInputText(inputName, e.target.value)}
                        placeholder={capitalizedName}
                        type="text"
                        value={this.state[inputName]}
                      />
                    );
                  })}
                </div>
              )}
              {selectedTab === 'login' && <div className="auth-form-inputs-login">login stuff</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* COMPONENT UTIL METHODS */
  /* -------------------------------------------------------------------------- */
  capitalize(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  updateInputText(field, value) {
    this.setState({
      [field]: value
    });
  }

  updateSelectedTab(tabName) {
    this.setState({
      selectedTab: tabName
    });
  }
}

/* -------------------------------------------------------------------------- */
/* PROP TYPES DECLARATIONS */
/* -------------------------------------------------------------------------- */
SignupLoginHomePage.defaultProps = {};

SignupLoginHomePage.propTypes = {};

export default SignupLoginHomePage;
