/* -------------------------------------------------------------------------- */
/* ALL IMPORTS */
/* -------------------------------------------------------------------------- */
// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// Packages
import { Button } from 'baseui/button';
import { StyledAction } from 'baseui/card';
import passwordValidator from 'password-validator';
import PropTypes from 'prop-types';

// Context

// Components
import SignupLoginImage from '../../assets/signup-login-img.png';

// Assets
// Constants

// Utils / Methods
import { initiateReset, login, register } from '../../store/actions/auth/auth-actions';

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
      username: '',
      validEmail: false,
      validPassword: false
    };

    this.authenticated = localStorage.getItem('giving_tree_jwt');
    this.schema = new passwordValidator();
    this.schema
      .is()
      .min(8)
      .is()
      .max(100)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .has()
      .digits()
      .symbols()
      .has()
      .not()
      .spaces();

    [
      // prettier-ignore
      'capitalize',
      'handleLogin',
      'updateInputText',
      'updateSelectedTab'
    ].forEach(m => {
      this[m] = this[m].bind(this);
    });
  }

  render() {
    const {
      errorMessage,
      initiateResetDispatch,
      initiateResetSuccess,
      loginDispatch,
      loginLoading,
      registerLoading,
      signupDispatch
    } = this.props;

    const { email, name, password, selectedTab, username, validPassword } = this.state;

    const signupFormIsNotReady =
      !email || !name || !password || !username || !validPassword || registerLoading;
    const loginFormIsNotReady = !password || !username || !validPassword || loginLoading;
    console.log('BLLR?: --------------------------------------------------------------------------------');
    console.log('BLLR?: SignupLoginHomePage -> render -> loginFormIsNotReady', loginFormIsNotReady);
    console.log('BLLR?: --------------------------------------------------------------------------------');

    if (this.authenticated) {
      return <Redirect to="/home/discover" />; // better home page redirect experience
    }

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
                      selectedTab === tabName ? ' selected-tab' : ''
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
                  {['name', 'username', 'email', 'password'].map(signupInputName => {
                    const capitalizedName = this.capitalize(signupInputName);

                    let signupInputType = 'text';
                    if (signupInputName === 'email' || signupInputName === 'password') {
                      signupInputType = signupInputName;
                    }

                    return (
                      <input
                        className={`tab-input input-${signupInputName}`}
                        name={signupInputName}
                        key={signupInputName}
                        onChange={e => this.updateInputText(signupInputName, e.target.value)}
                        placeholder={capitalizedName}
                        type={signupInputType}
                        value={this.state[signupInputName]}
                      />
                    );
                  })}
                  <div className="auth-form-buttons-signup">
                    <StyledAction>
                      <Button
                        disabled={signupFormIsNotReady}
                        isLoading={registerLoading}
                        onClick={this.handleSignup}
                        overrides={{
                          BaseButton: {
                            style: {
                              backgroundColor: '#8ec755',
                              borderRadius: '5px',
                              color: '#ffffff',
                              paddingBottom: '8px',
                              paddingTop: '8px',
                              width: '100%'
                            }
                          }
                        }}
                      >
                        Sign Up
                      </Button>
                      <Button
                        kind="secondary"
                        onClick={() => (window.location = '/home/discover')}
                        overrides={{
                          BaseButton: {
                            style: {
                              backgroundColor: 'transparent',
                              border: 'solid 1px #8ec755',
                              borderRadius: '5px',
                              color: '#000000',
                              fontSize: '14px',
                              marginTop: '24px',
                              paddingBottom: '8px',
                              paddingTop: '8px',
                              width: '100%'
                            }
                          }
                        }}
                      >
                        Sign Up Later
                      </Button>
                    </StyledAction>
                  </div>
                </div>
              )}
              {selectedTab === 'login' && (
                <div className="auth-form-inputs-login">
                  {['name', 'password'].map(loginInputName => {
                    const capitalizedName = this.capitalize(loginInputName);

                    return (
                      <input
                        className={`tab-input input-${loginInputName}`}
                        name={loginInputName}
                        key={loginInputName}
                        onChange={e => this.updateInputText(loginInputName, e.target.value)}
                        placeholder={capitalizedName}
                        type={loginInputName === 'password' ? 'password' : 'text'}
                        value={this.state[loginInputName]}
                      />
                    );
                  })}
                  <p className="forgot-password-link"><a href="#">Forgot Password?</a></p>
                  <div className="auth-form-buttons-login">
                    <StyledAction>
                      <Button
                        disabled={loginFormIsNotReady}
                        isLoading={loginLoading}
                        onClick={this.handleLogin}
                        overrides={{
                          BaseButton: {
                            style: {
                              backgroundColor: '#8ec755',
                              borderRadius: '5px',
                              color: '#ffffff',
                              paddingBottom: '8px',
                              paddingTop: '8px',
                              width: '100%'
                            }
                          }
                        }}
                      >
                        Login
                      </Button>
                    </StyledAction>
                  </div>
                </div>
              )}
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

  handleLogin = async () => {
    const { loginDispatch } = this.props;
    const { password, username } = this.state;

    await loginDispatch({
      env: process.env.NODE_ENV,
      username,
      password,
      rememberMe: true // by default
    });
  };

  handleSignup = async () => {
    const { signupDispatch } = this.props;
    const { email, name, password, username } = this.state;

    await signupDispatch({
      env: process.env.NODE_ENV,
      name,
      email,
      username,
      password,
      rememberMe: true // by default
    });
  };

  updateInputText(field, value) {
    this.setState({
      [field]: value
    });

    console.log('BLLR?: --------------------------------------');
    console.log('BLLR?: updateInputText -> value', value);
    console.log('BLLR?: --------------------------------------');

    if (field === 'password') {
      if (this.schema.validate(value)) {
        this.setState({
          validPassword: true,
        });
      } else {
        this.setState({
          validPassword: false,
        });
      }
    }
  }

  updateSelectedTab(tabName) {
    this.setState({
      email: '',
      name: '',
      password: '',
      selectedTab: tabName,
      username: '',
      validEmail: false,
      validPassword: false
    });
  }
}

/* -------------------------------------------------------------------------- */
/* PROP TYPES DECLARATIONS */
/* -------------------------------------------------------------------------- */
SignupLoginHomePage.defaultProps = {};

SignupLoginHomePage.propTypes = {};

/* -------------------------------------------------------------------------- */

/* SETTING UP REDUX DISPATCH CONNECTIONS */

/* -------------------------------------------------------------------------- */

const mapDispatchToProps = dispatch => ({
  initiateResetDispatch: payload => dispatch(initiateReset(payload)),
  loginDispatch: payload => dispatch(login(payload)),
  signupDispatch: payload => dispatch(register(payload))
});

const mapStateToProps = state => ({
  errorMessage: state.auth.errorMessage,
  initiateResetSuccess: state.auth.initiateResetSuccess,
  isRegistered: state.auth.isRegistered,
  loginFailure: state.auth.loginFailure,
  loginLoading: state.auth.loginLoading,
  loginSuccess: state.auth.loginSuccess,
  registerFailure: state.auth.registerFailure,
  registerLoading: state.auth.registerLoading,
  registerSuccess: state.auth.registerSuccess,
  userLogin: state.global.user,
  userSignup: state.auth.user
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupLoginHomePage);
