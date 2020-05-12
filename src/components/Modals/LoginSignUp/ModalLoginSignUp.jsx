import * as React from 'react';
import { connect } from 'react-redux';
import { Input } from 'baseui/input';

import {
  Modal, ModalBody
} from 'baseui/modal';

import Constants from '../../Constants';
import ROUTES from '../../../utils/routes';

import {
  register, initiateReset, login
} from '../../../store/actions/auth/auth-actions';
import { Redirect } from 'react-router-dom';

import './ModalLoginSignUp.css';

class ModalLoginSignUp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      type: 'login',
      nameInput: '',
      userInput: '',
      emailInput: '',
      passwordInput: '',
      // Signup validation check values
      passLen: false,
      passCase: false,
      passNum: false,
      passSpec: false,
      passValid: false
    }

    this.setIsOpen = this.setIsOpen.bind(this);

    this.loginUsernameInput = React.createRef();
    this.loginPasswordInput = React.createRef();
  }

  AlreadyRegisteredEmailError = ({ email }) => (
    <div>
      Oops, it looks like you've already made an account with this email address!
      Would you like to try <div onClick={() => {
            this.setType('login');
            this.setState({
              redirected: true,
            })
          }} style={{  color: 'rgb(0, 121, 211)',
          display: "inline" }}>logging in</div> instead?
    </div>
  )
  
  alreadyRegisteredUsernameError = username => `Sorry, that username is already taken! Can you please try a different one?`
  
  prettyErrorMessage = errors => {
    if (errors) {
  
      if (errors.email) {
        if (errors.email.kind === 'unique') {
          const props = { email: errors.email.value }
          return this.AlreadyRegisteredEmailError(props)
        }
      }
  
      if (errors.username) {
        if (errors.username.kind === 'unique')
          return this.alreadyRegisteredUsernameError(errors.username.value)
      }
  
    }
  }
  
  componentDidMount() {
    this.setType(this.props.type);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen !== prevProps.isOpen) {
      // Reset the state on close. 
      // Need to set a timeout as the change is visible on fade.
      setTimeout(() => {
        this.setState({
          type: this.props.type,
          nameInput: '',
          userInput: '',
          emailInput: '',
          passwordInput: '',
          // Signup validation check values
          passLen: false,
          passCase: false,
          passNum: false,
          passSpec: false,
          passValid: false
        })
      }, 1000)
      
    }
  }

  /**
   * Tell the parent component that the modal is open/closed
   *
   * @param {*} val
   * @memberof ModalLoginSignUp
   */
  setIsOpen(val) {
    this.props.setIsOpen(val);
  }

  /**
   * Close the modal
   *
   */
  close() {
    this.setIsOpen(false);
  }

  /**
   * Update the type state. Decides whether to show the login, forgot password,
   * or signup form.
   *
   * @param {*} val
   * @memberof ModalLoginSignUp
   */
  setType(val) {
    this.setState({
      type: val,
    });
  }

  /**
   * When a form field has focus, check if the enter key was pressed.
   * If it was, submit the form
   *
   * @param {*} e
   * @memberof ModalLoginSignUp
   */
  enterKeyCheck(e) {
    // Get the key that was pressed
    const code = e.keyCode || e.which;
    if (code === 13) {
      switch (this.state.type) {
        case 'signup': {
          this.handleSignup();
          break;
        }
        case 'forgot': {
          this.handleForgotPassword();
          break;
        }
        default: 
        break;
      }
    }
  }

  /**
   * JSX for the login modal body
   */
  loginModalBody() {
    return (
      <div>
        <h2 className="text-center text-2xl mb-6">Log in</h2>
        {!this.state.redirected && this.props.errorMessage && 
          <p className="text-red-700 text-center mb-4">
            {this.props.errorMessage}
          </p>
        }
        <form onSubmit={(e) => {
          e.preventDefault();

          this.handleLogin(this.loginUsernameInput.current.value, this.loginPasswordInput.current.value);
          this.setState({
            redirected: false,
          })
        }}>
          <input type="text" placeholder="Username" 
          name="username"
          ref={this.loginUsernameInput}
          disabled={this.props.loginLoading}
          className="w-full py-2 px-4 border border-gray-200 shadow rounded-md mb-4"
          required />
          <input type="password" placeholder="Password"
          name="password"
          ref={this.loginPasswordInput}
          disabled={this.props.loginLoading}
          className="w-full py-2 px-4 border border-gray-200 shadow rounded-md mb-4"
          required />
          <p className="text-right mb-4">
            <button className="text-blue-500" type="button" onClick={() => {
              this.setType('forgot')
            }}>
              Forgot password?
            </button>
          </p>
          <button className="w-full py-3 font-semibold text-white bg-green-700
          rounded mb-4" type="submit">
            {!this.props.loginLoading && `Log in` }
            {this.props.loginLoading && 
              <span className="loading-spinner loading-spinner-white"></span>
            }
          </button>
        </form>
        <button className="w-full text-blue-500" onClick={() => {
          this.setType('signup');
        }}>
          New to Giving Tree? <strong>Sign up</strong>
        </button>
        <a className="w-full block text-center mt-3 py-3 font-semibold text-white bg-red-700
        rounded mb-4" href={`${ROUTES[process.env.REACT_APP_NODE_ENV].giving_tree}/v1/auth/oauth/google`}>
          Login with Google
        </a>
        <a className="w-full block text-center mt-3 py-3 font-semibold text-white bg-blue-700
        rounded mb-4" href={`${ROUTES[process.env.REACT_APP_NODE_ENV].giving_tree}/v1/auth/oauth/facebook`}>
          Login with Facebook
        </a>
      </div>
    )
  }

  /**
   * Send user input to back end and see if it was a valid login attempt
   *
   * @param {*} user
   * @param {*} pass
   * @memberof ModalLoginSignUp
   */
  async handleLogin(user, pass) {
    await this.props.loginDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      username: user,
      password: pass,
      rememberMe: true // by default
    });
  };

  /**
   * Validate the user password input in real time when signing up
   *
   * @param {*} val
   * @memberof ModalLoginSignUp
   */
  validatePassword(val) {
    // Check if password length meets criteria
    this.setState({ passLen: val.length >= 8 })
    // Check if contains at least 1 upper, and one lowercase character
    const caseCheck = (val.match(/[a-z]/) && val.match(/[A-Z]/)) ? true : false;
    this.setState({ passCase: caseCheck })
    // Check if it contains at least one number
    const numCheck = (val.match(/[0-9]/)) ? true : false;
    this.setState({ passNum: numCheck});
    // Check if it contains a special character
    const specCheck = (val.match(/\W|_/g)) ? true : false;
    this.setState({ passSpec: specCheck }, () => {
      // If all the criteria is met, enable the sign up button
      const passValid = (this.state.passCase && this.state.passLen && 
        this.state.passNum && this.state.passSpec) ? true : false;  
      this.setState({ passValid: passValid })
    });

    
  }

  /**
   * Fire a request to the back end to process the sign up.
   *
   * @memberof ModalLoginSignUp
   */
  async handleSignup() {
    await this.props.signupDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      name: this.state.nameInput,
      email: this.state.emailInput,
      username: this.state.userInput,
      password: this.state.passwordInput,
      rememberMe: true // by default
    });
  };

  /**
   * JSX for the signup modal body
   */
  signupModalBody() {
    const errorMessage = this.prettyErrorMessage(this.props.errorObject) || this.props.errorMessage
    return (
      <div>
        <h2 className="text-center text-2xl mb-6">Sign up</h2>
        {!this.state.redirected && errorMessage && <p className="mb-4 text-center text-red-700">
          {errorMessage}
        </p>}
        <input type="text" 
          placeholder="Name" 
          onChange={(e) => {
            const val = e.currentTarget.value;
            this.setState({ nameInput: val})
          }} 
          onKeyPress={(event) => this.enterKeyCheck(event)}
          disabled={this.props.loginLoading}
          className="w-full py-2 px-4 border border-gray-200 shadow rounded-md mb-4" 
          name="name"
        />
        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => {
            const val = e.currentTarget.value;
            this.setState({ userInput: val})
          }}
          onKeyPress={(event) => this.enterKeyCheck(event)}
          disabled={this.props.loginLoading}
          className="w-full py-2 px-4 border border-gray-200 shadow rounded-md mb-4"
          name="username"
        />
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => {
            const val = e.currentTarget.value;
            this.setState({ emailInput: val})
          }}
          onKeyPress={(event) => {
            this.enterKeyCheck(event);
          }}
          disabled={this.props.loginLoading}
          className="w-full py-2 px-4 border border-gray-200 shadow rounded-md mb-4"
          name="email"
        />

        <Input
          value={this.state.passwordInput}
          overrides={{
            MaskToggleButton: {
              style: {
                paddingLeft: '0 !important'
              }
            },
            InputContainer: {
              style: {
                padding: '.5rem 1rem',
                border: '1px solid #edf2f7',
                backgroundColor: 'white',
                borderRadius: '6px',
                marginBottom: '1rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }
            },
            Input: {
              style: {
                padding: '0',
                border: '0',
                backgroundColor: 'white',
                fontSize: '14px',
                lineHeight: 1
              }
            }
          }}
          type="password"
          onChange={(e) => {
            const val = e.currentTarget.value;
            this.setState({ passwordInput: val})
            this.validatePassword(val);
          }}
          placeholder="Password"
          onKeyPress={(event) => {
            this.enterKeyCheck(event)
          }}
          disabled={this.props.loginLoading}
          name="password" 
        />
        {(!this.state.passValid) && 
          <div>
            <p className="mb-4">Your password must have:</p>
            <p className="flex items-center mb-2">
              {!this.state.passLen ? (
                <svg className="flex-shrink-0 mr-3"
                width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM10 18C5.589 18 2 14.411 2 10C2 5.589 5.589 2 10 2C14.411 2 18 5.589 18 10C18 14.411 14.411 18 10 18Z" fill="#BFBFBF"/>
                <path d="M7.99896 11.587L5.69996 9.29197L4.28796 10.708L8.00096 14.413L14.707 7.70697L13.293 6.29297L7.99896 11.587Z" fill="#BFBFBF"/>
                </svg>
              ) : (
                <svg className="flex-shrink-0 mr-3"
                width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM8.001 14.413L4.288 10.708L5.7 9.292L7.999 11.587L13.293 6.293L14.707 7.707L8.001 14.413Z" 
                fill="#1E853B"/>
                </svg>
              )}
              <span>8 or more characters</span>
            </p>
            <p className="flex items-center mb-2">
              {!this.state.passCase ? (
                <svg className="flex-shrink-0 mr-3"
                width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM10 18C5.589 18 2 14.411 2 10C2 5.589 5.589 2 10 2C14.411 2 18 5.589 18 10C18 14.411 14.411 18 10 18Z" fill="#BFBFBF"/>
                <path d="M7.99896 11.587L5.69996 9.29197L4.28796 10.708L8.00096 14.413L14.707 7.70697L13.293 6.29297L7.99896 11.587Z" fill="#BFBFBF"/>
                </svg>
              ) : (
                <svg className="flex-shrink-0 mr-3"
                width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM8.001 14.413L4.288 10.708L5.7 9.292L7.999 11.587L13.293 6.293L14.707 7.707L8.001 14.413Z" 
                fill="#1E853B"/>
                </svg>
              )}
              <span>Upper and lowercase letters</span>
            </p>
            <p className="flex items-center mb-2">
              {!this.state.passNum ? (
                <svg className="flex-shrink-0 mr-3"
                width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM10 18C5.589 18 2 14.411 2 10C2 5.589 5.589 2 10 2C14.411 2 18 5.589 18 10C18 14.411 14.411 18 10 18Z" fill="#BFBFBF"/>
                <path d="M7.99896 11.587L5.69996 9.29197L4.28796 10.708L8.00096 14.413L14.707 7.70697L13.293 6.29297L7.99896 11.587Z" fill="#BFBFBF"/>
                </svg>
              ) : (
                <svg className="flex-shrink-0 mr-3"
                width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM8.001 14.413L4.288 10.708L5.7 9.292L7.999 11.587L13.293 6.293L14.707 7.707L8.001 14.413Z" 
                fill="#1E853B"/>
                </svg>
              )}
              <span>At least one number</span>
            </p>
            <p className="flex items-center mb-4">
              {!this.state.passSpec ? (
                <svg className="flex-shrink-0 mr-3"
                width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM10 18C5.589 18 2 14.411 2 10C2 5.589 5.589 2 10 2C14.411 2 18 5.589 18 10C18 14.411 14.411 18 10 18Z" fill="#BFBFBF"/>
                <path d="M7.99896 11.587L5.69996 9.29197L4.28796 10.708L8.00096 14.413L14.707 7.70697L13.293 6.29297L7.99896 11.587Z" fill="#BFBFBF"/>
                </svg>
              ) : (
                <svg className="flex-shrink-0 mr-3"
                width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM8.001 14.413L4.288 10.708L5.7 9.292L7.999 11.587L13.293 6.293L14.707 7.707L8.001 14.413Z" 
                fill="#1E853B"/>
                </svg>
              )}
              <span>At least one special character ‘!._*,#’)</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <em>Avoid using passwords that you use with other websites or that might be easy for someone else to guess.</em>
            </p>
          </div>
        }
        <button 
          onClick={() => this.handleSignup()}
          className={`w-full py-3 font-semibold text-white bg-green-700
          rounded mb-4 ${!this.state.passValid && 'opacity-50 cursor-not-allowed'}`} 
          disabled={!this.state.passValid}
        >
          {!this.props.registerLoading && `Sign up`}
          {this.props.registerLoading && 
            <span className="loading-spinner loading-spinner-white"></span>
          }
        </button>
        <button
          className="w-full text-blue-500" 
          onClick={() => this.setType('login')}
        >
          Already part of the community? <strong>Log in</strong>
        </button>
      </div>
    )
  }

  /**
   * JSX for the forgot password modal body
   *
   * @returns
   * @memberof ModalLoginSignUp
   */
  forgotPassBody() {
    if (!this.props.initiateResetSuccess) {
      return (
        <div>
          <h2 className="text-center text-2xl mb-6">Forgot password</h2>
          <p className="mb-4">Please enter your email: </p>
          <div className="flex items-center">
            <input 
              type="email" 
              placeholder="Email" 
              onChange={(e) => {
                const val = e.currentTarget.value;
                this.setState({ emailInput: val})
              }}
              onKeyPress={(event) => this.enterKeyCheck(event)}
              disabled={this.props.initiateResetLoading}
              className="w-full py-2 px-4 border border-gray-200 shadow rounded-md mb-4 mr-4"
              name="email"
            />
            <button 
              className={`px-8 py-2 font-semibold text-white bg-green-700
              rounded mb-4 ${!this.state.emailInput && 
              'opacity-50 cursor-not-allowed'}`}
              disabled={!this.state.emailInput}
              onClick={() => this.handleForgotPassword()}
            >
              {!this.props.initiateResetLoading && `Reset`}
                {this.props.initiateResetLoading && 
                  <span 
                  className="loading-spinner loading-spinner-white"></span>
                }
            </button>
          </div>
          {this.props.errorMessage && 
            <p className="text-red-700">
              {this.props.errorMessage}
            </p>
          }
        </div>
      
    );
    } else {
      return <p>
        You will recieve an email to your inbox with instructions on how to 
        reset your password!
      </p>
    }
    
  }

  /**
   * Fire a request to the back end to reset password
   *
   * @memberof ModalLoginSignUp
   */
  async handleForgotPassword() {
    await this.props.initiateResetDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      email: this.state.emailInput
    });
  }

  /**
   * Get the template depending on what type of modal is being launched/shown
   *
   * @returns
   * @memberof ModalLoginSignUp
   */
  getTemplate() {

    switch(this.state.type) {
      case 'login': {
        return this.loginModalBody();
      }
      case 'signup': {
        return this.signupModalBody();
      }
      case 'forgot': {
        return this.forgotPassBody();
      }
      default:
        return this.loginModalBody();
    }    
  }


  render() {
    if (this.props.loginSuccess || this.props.registerSuccess) {
      return <Redirect to={Constants.PATHS.NEWSFEED} />
    } else {
      return(
        <Modal isOpen={this.props.isOpen} onClose={() => {
          this.close();
        }} overrides={{
          Root: {
            style: {
              zIndex: 100
            }
          },
          Dialog: {
            style: {
              padding: '2rem 0 1rem 0',
              borderRadius: '6px',
              position: 'absolute',
              maxWidth: 'calc(100% - 2rem)',
              margin: '0 auto',
              top: '50%',
              transform: 'translateY(-50%)'
            }
          }
        }}>
          <ModalBody className="ModalLoginSignUp">
            {this.getTemplate()}
          </ModalBody>
        </Modal>
      );
    }
    
  }
}

const mapDispatchToProps = dispatch => ({
  signupDispatch: payload => dispatch(register(payload)),
  loginDispatch: payload => dispatch(login(payload)),
  initiateResetDispatch: payload => dispatch(initiateReset(payload))
});

const mapStateToProps = state => ({
  user: state.auth.user,
  errorMessage: state.auth.errorMessage,
  errorObject: state.auth.errorObject,
  registerLoading: state.auth.registerLoading,
  registerSuccess: state.auth.registerSuccess,
  registerFailure: state.auth.registerFailure,
  isRegistered: state.auth.isRegistered,
  loginLoading: state.auth.loginLoading,
  loginSuccess: state.auth.loginSuccess,
  loginFailure: state.auth.loginFailure,
  initiateResetSuccess: state.auth.initiateResetSuccess,
  initiateResetLoading: state.auth.initiateResetLoading
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalLoginSignUp);