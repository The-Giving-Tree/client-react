/* eslint-disable */
import * as React from 'react';
import { Tabs, Tab } from 'baseui/tabs';
import { useStyletron } from 'baseui';
import Alert from 'baseui/icon/alert';
import Check from 'baseui/icon/check';
import { Notification } from 'baseui/notification';
import { hotjar } from 'react-hotjar';
import { Button, SHAPE } from 'baseui/button';
import { useHistory, Redirect, Link } from 'react-router-dom';
import { 
  Modal, ModalHeader, ModalBody, ModalFooter, ModalButton
} from 'baseui/modal';
import Navigation from '../../components/Navigation/Navigation';
import { StyledAction } from 'baseui/card';
import { Input } from 'baseui/input';
import { connect } from 'react-redux';

import Footer from '../../components/Footer/Footer';
import Constants from '../../components/Constants';

import './Home.css';

import {
  register, selectMenu, initiateReset, login
} from '../../store/actions/auth/auth-actions';

import passwordValidator from 'password-validator';
import ModalLoginSignUp from '../../components/Modals/LoginSignUp/ModalLoginSignUp';
var schema = new passwordValidator();
schema
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

function Home(props) {
  const {
    loginDispatch,
    loginLoading,
    loginSuccess,
    initiateResetDispatch,
    signupDispatch,
    errorMessage,
    registerLoading,
    initiateResetSuccess,
    selectMenuDispatch
  } = props;

  const history = useHistory();

  // signup
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [validPassword, setValidPassword] = React.useState(false);

  // mailchimp subscribe
  const [mailchimpEmail, setMailchimpEmail] = React.useState('');

  // login
  const [resetEmail, setResetEmail] = React.useState('');
  const [resetModal, setResetModal] = React.useState(false);

  const [activeKey, setActiveKey] = React.useState('0');

  const [isOpen, setIsOpen] = React.useState(false);

  const enterPressed = async event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      if (Number(activeKey) === 0) {
        handleSignup();
      } else {
        handleLogin();
      }
    }
  };

  const handleSignup = async () => {
    signupDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      name,
      email,
      username,
      password,
      rememberMe: true // by default
    });
  };

  const handleLogin = async () => {
    loginDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      username,
      password,
      rememberMe: true // by default
    });
  };

  const authenticated = localStorage.getItem('giving_tree_jwt');

  const render = () => {};

  render();

  React.useEffect(() => {
    hotjar.initialize('1751072', 6);
  }, []);

  const tabDetailJSX = () => {
    return (
      <Tabs
        overrides={{
          Tab: {
            style: {
              outline: 'none'
            }
          },
          Root: {
            style: {
              outline: 'none',
              width: '100%',
              margin: '0 auto'
            }
          },
          TabBar: {
            style: {
              outline: 'none',
              backgroundColor: 'white',
              padding: 0
            }
          },
          TabContent: {
            style: {
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 0,
              outline: 'none',
              color: '#059305'
            }
          }
        }}
        onChange={({ activeKey }) => {
          setActiveKey(activeKey);
        }}
        activeKey={activeKey}
      >
        <Tab
          overrides={{
            Tab: {
              style: {
                marginLeft: 0,
                marginRight: 0,
                outline: 'none',
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                width: '50%',
                color: `${activeKey === '0' && '#059305'}`,
                borderColor: `${activeKey === '0' && '#059305'}`
              }
            }
          }}
          title="Sign Up"
        >
          <div className="pt-12">
            {errorMessage && (
              <p className="my-3 text-sm" style={{ color: 'rgb(204, 50, 63)' }}>
                {errorMessage}
              </p>
            )}
            <Input
              value={name}
              onChange={event => setName(event.currentTarget.value)}
              placeholder="Name"
            />
            <br />
            <Input
              value={username}
              onChange={event => setUsername(event.currentTarget.value)}
              placeholder="Username"
            />
            <br />
            <Input
              value={email}
              onChange={event => setEmail(event.currentTarget.value)}
              placeholder="Email"
            />
            <br />
            <Input
              value={password}
              error={password && !validPassword}
              positive={password && validPassword}
              overrides={{
                After:
                  password && !validPassword ? Negative : password && validPassword ? Positive : ''
              }}
              type="password"
              onChange={event => {
                setPassword(event.currentTarget.value);

                if (schema.validate(event.currentTarget.value)) {
                  setValidPassword(true);
                } else {
                  setValidPassword(false);
                }
              }}
              placeholder="Password"
              onKeyPress={event => enterPressed(event)}
            />
            {password && !validPassword && (
              <div style={{ fontSize: 10, textAlign: 'left' }}>
                Password must be 8+ characters, at least 1 of lowercase [a-z], uppercase [A-Z],
                special character '!._*,#'), number [0-9]
              </div>
            )}

            <br />
            <StyledAction>
              <Button
                onClick={handleSignup}
                shape={SHAPE.pill}
                disabled={
                  !name || !email || !username || !password || registerLoading || !validPassword
                }
                isLoading={registerLoading}
                overrides={{
                  BaseButton: { style: { width: '100%' } }
                }}
              >
                Sign Up
              </Button>
            </StyledAction>
            <br />
            <Button
              onClick={() => history.push('/home/discover')}
              shape={SHAPE.pill}
              overrides={{
                BaseButton: { style: { width: '100%' } }
              }}
            >
              Sign Up Later
            </Button>
          </div>
        </Tab>
        <Tab
          overrides={{
            Tab: {
              style: {
                marginLeft: 0,
                marginRight: 0,
                outline: 'none',
                fontSize: 16,
                width: '50%',
                fontWeight: 'bold',
                textAlign: 'center',
                color: `${activeKey === '1' && '#059305'}`,
                borderColor: `${activeKey === '1' && '#059305'}`
              }
            }
          }}
          title="Login"
        >
          <div className="pt-12">
            {errorMessage && (
              <p
                className="my-3 text-sm"
                style={{
                  color: 'rgb(204, 50, 63)'
                }}
              >
                {errorMessage}
              </p>
            )}
            <Input
              value={username}
              onChange={event => setUsername(event.currentTarget.value)}
              placeholder="Username"
            />
            <br />
            <Input
              value={password}
              type="password"
              onChange={event => setPassword(event.currentTarget.value)}
              placeholder="Password"
              onKeyPress={event => enterPressed(event)}
            />
            <br />
            <Modal onClose={() => setResetModal(false)} isOpen={resetModal}>
              <ModalHeader>Reset Your Password</ModalHeader>
              <ModalBody>
                Please enter your email
                <Input
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="Email"
                />
              </ModalBody>
              <ModalFooter>
                <ModalButton size={'compact'} kind={'minimal'} onClick={() => setResetModal(false)}>
                  Cancel
                </ModalButton>
                <ModalButton
                  size={'compact'}
                  onClick={() => {
                    initiateResetDispatch({
                      env: process.env.REACT_APP_NODE_ENV,
                      email: resetEmail
                    });

                    setResetModal(false);
                    setResetEmail('');
                  }}
                >
                  Reset
                </ModalButton>
              </ModalFooter>
            </Modal>
            {initiateResetSuccess && (
              <Notification
                autoHideDuration={3000}
                overrides={{
                  Body: {
                    style: {
                      position: 'fixed',
                      left: 0,
                      bottom: 0,
                      textAlign: 'center',
                      backgroundColor: 'rgb(54, 135, 89)',
                      color: 'white'
                    }
                  }
                }}
                kind={'positive'}
              >
                Reset Instructions Sent!
              </Notification>
            )}
            <div
              style={{
                textAlign: 'right',
                cursor: 'pointer',
                color: 'rgb(0, 121, 211)'
              }}
              onClick={() => setResetModal(true)}
            >
              Forgot password?
            </div>
            <br />
            <StyledAction>
              <Button
                onClick={handleLogin}
                disabled={!username || !password || loginLoading}
                shape={SHAPE.pill}
                overrides={{
                  BaseButton: { style: { width: '100%' } }
                }}
                isLoading={loginLoading}
              >
                Login
              </Button>
            </StyledAction>
          </div>
        </Tab>
      </Tabs>
    );
  };

  const detailJSX = () => {
    return (
      <div className="">
        <h1 className={`landing-title mb-4 text-center md:text-left`}>
          Request help or lend a hand
        </h1>
        <div className={`landing-text py-2 text-center md:text-left`}>
          The Giving Tree was created in response to COVID-19. Our platform connects people who need
          assistance with people who are interested in helping.
        </div>
        <div
          style={{ cursor: 'pointer' }}
          className="text-black hover:text-green-600 transition duration-150"
        >
          <a href="tel:+1415-964-4261">Hotline: +1 415-964-4261</a>
        </div>
      </div>
    );
  };

  function Negative() {
    const [css, theme] = useStyletron();
    return (
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          paddingRight: theme.sizing.scale500,
          color: theme.colors.negative400
        })}
      >
        <Alert size="18px" />
      </div>
    );
  }
  function Positive() {
    const [css, theme] = useStyletron();
    return (
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          paddingRight: theme.sizing.scale500,
          color: theme.colors.positive400
        })}
      >
        <Check size="18px" />
      </div>
    );
  }

  return (
    <div>
      <Navigation selectMenuDispatch={selectMenuDispatch} 
      searchBarPosition="center" />
        {authenticated ? (
          <Redirect to={`/home/discover`} />
        ) : (
          <div className="flex-grow py-8 lg:py-20 LandingPage bg-white">
            <ModalLoginSignUp type={`signup`} isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="max-w-screen-lg w-full mx-auto px-6 xl:px-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="col-span-1">
                  <div className="landing-image">
                    <img src="https://d1ppmvgsdgdlyy.cloudfront.net/homepage/landing.jpg" />
                  </div>
                  <em className="block mb-4 text-xs">
                    Image by <a className="text-blue-500"
                    href="https://dribbble.com/Tubik">
                    Tubikstudio</a> via Dribbble
                  </em>
                </div>
                <div className="max-w-sm mx-auto col-span-1 md:pl-6 flex flex-col justify-center items-center">
                  <h2 className="text-lg font-bold text-center mb-2">
                    Ask for help or lend a hand
                  </h2>
                  <p className="text-center mb-4">
                    The Giving Tree was created in response to COVID-19. 
                    Our platform connects 
                    people who need help shopping for essential items with 
                    local low-risk people who want to help.
                  </p>
                  <div className="text-center mb-4">
                    <button onClick={() => setIsOpen(true)}
                    className="py-2 bg-green-700 text-white font-semibold
                    w-48 rounded-md inline-block">
                      Sign up
                    </button>
                  </div>
                  <p className="uppercase text-center mb-4">Or</p>
                  <p className="text-center">
                    Call/text our hotline to request help: <strong>
                      415-964-4261</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* HOW IT WORKS SECTION */}
            <div className="flex items-center justify-center 
            landing-page-title max-w-screen-lg mx-auto mb-3 sm:h-48 relative overflow-hidden">
              <h2 className="text-2xl font-semibold text-center">
                How it works
              </h2>
            </div>
            <div className="relative px-6 max-w-sm md:max-w-lg mx-auto">
              <div className="dotted-line absolute"></div>
              {/* <div className="inline-block rounded-lg bg-green-700 font-semibold 
              text-white py-1 px-2 start-button mb-4 relative z-10">
                Start!
              </div> */}
              <div className="flex px-3 mb-8 items-center relative z-10">
                <div className="flex items-center justify-center 
                mr-4 h-10 w-10 font-bold text-white bg-hlgreen text-2xl
                rounded-full flex-shrink-0">
                  <span>1</span>
                </div>
                <p className="text-lg">
                  Doug, who needs help getting groceries, posts a request 
                  on The Giving Tree
                </p>
              </div>

              <div className="flex px-3 mb-8 items-center relative z-10">
                <div className="flex items-center justify-center text-2xl
                h-10 w-10 font-bold text-white bg-hlgreen rounded-full
                flex-shrink-0 mr-4">
                  <span>2</span>
                </div>
                <p className="text-lg">
                  Nadia, who lives 1.3 miles away from Doug, finds and 
                  claims the request
                </p>
              </div>
              
              <div className="flex px-3 mb-4 items-center relative z-10">
                <div className="flex items-center justify-center text-2xl
                h-10 w-10 font-bold text-white bg-hlgreen rounded-full
                flex-shrink-0 mr-4">
                  <span>3</span>
                </div>
                <p className="text-lg">
                  Nadia safely delivers the groceries to Doug, who reimburses 
                  her using Venmo
                </p>
              </div>
              {/* <div className="inline-block rounded-lg bg-green-700 font-semibold 
              text-white py-1 px-2 start-button mb-3 relative z-10">
                Finish!
              </div> */}
            </div>
            
            {/* JOIN THE COMMUNIT SECTION */}
            <div className="flex items-center justify-center 
            landing-page-title-flipped max-w-screen-lg 
            mx-auto mb-3 sm:h-48">
              <h2 className="text-2xl font-semibold text-center">
                Join the community
              </h2>
            </div>

            <div className="px-4 md:px-6 md:max-w-screen-lg mx-auto lg:px-0">
              <div className="shadow-lg rounded-sm p-4 md:p-6">
                <p className="text-xl mb-4 text-center">
                  Sign up to receive the latest news and updates from The Giving 
                  Tree
                </p>
                <form action="https://givingtreeproject.us19.list-manage.com/subscribe/post?u=fe3f02a04e07d91303febd846&amp;id=20db7da4aa" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate className="md:flex text-center items-center justify-center max-w-xl mx-auto mb-4">                    
                  <input type="email" value="" name="EMAIL" class="email" className="w-full md:mr-4 shadow-sm border 
                border-gray-200 border-solid rounded-md px-4 py-2 mb-8 md:mb-0" id="mce-EMAIL" placeholder="Enter email (e.g. johnsmith@yahoo.com)" required value={mailchimpEmail} onChange={(e) => setMailchimpEmail(e.target.value)} />
                  <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true"><input type="text" name="b_fe3f02a04e07d91303febd846_20db7da4aa" tabindex="-1" value="" /></div>
                  <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button" className="font-semibold text-white bg-green-700 py-2 rounded-lg px-12" /></div>
                </form>
                <small className="text-center max-w-lg block mx-auto">
                  <em>
                    We promise we'll only send you relevant updates, and will 
                    never share or sell your data. You can subscribe at any 
                    time.  
                  </em>
                </small>
              </div>
            </div>
          </div>
        )}
      <Footer />
    </div>
    );
}

const mapDispatchToProps = dispatch => ({
  signupDispatch: payload => dispatch(register(payload)),
  selectMenuDispatch: payload => dispatch(selectMenu(payload)),
  loginDispatch: payload => dispatch(login(payload)),
  initiateResetDispatch: payload => dispatch(initiateReset(payload))
});

const mapStateToProps = state => ({
  user: state.auth.user,
  selectMenu: state.auth.selectMenu,
  errorMessage: state.auth.errorMessage,
  registerLoading: state.auth.registerLoading,
  registerSuccess: state.auth.registerSuccess,
  registerFailure: state.auth.registerFailure,
  isRegistered: state.auth.isRegistered,
  loginLoading: state.auth.loginLoading,
  loginSuccess: state.auth.loginSuccess,
  loginFailure: state.auth.loginFailure,
  initiateResetSuccess: state.auth.initiateResetSuccess
});

Home.defaultProps = {};

Home.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
