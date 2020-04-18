import * as React from 'react';
import {
  ALIGN,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList
} from 'baseui/header-navigation';
import { Notification } from 'baseui/notification';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import lifecycle from 'react-pure-lifecycle';
import { Card, StyledAction } from 'baseui/card';
import { Input } from 'baseui/input';
import { Button, SHAPE } from 'baseui/button';
import { connect } from 'react-redux';
import Media from 'react-media';
import { 
  Modal, ModalHeader, ModalBody, ModalFooter, ModalButton
} from 'baseui/modal';

import { login, initiateReset } from '../../store/actions/auth/auth-actions';
import Navigation from '../../components/Navigation';

const componentDidUpdate = props => {};

const methods = {
  componentDidUpdate
};

/**
 * @function
 * @name Login - container component housing bulk of logic for buy flow
 * @param {object} props - see PropTypes for definitions
 * @returns {Element}
 */
function Login(props) {
  const {
    errorMessage,
    loginDispatch,
    loginLoading,
    initiateResetDispatch,
    initiateResetSuccess
  } = props;
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [resetEmail, setResetEmail] = React.useState('');
  const [resetModal, setResetModal] = React.useState(false);
  const authenticated = localStorage.getItem('giving_tree_jwt');

  const enterPressed = async event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      handleLogin();
    }
  };

  const handleLogin = async () => {
    await loginDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      username,
      password,
      rememberMe: true // by default
    });
  };

  let history = useHistory();

  if (authenticated) {
    return <Redirect to="/home/discover" />;
  } else {
    return (
      <div style={{ width: '100%' }}>
        <Navigation
          overrides={{
            Root: {
              style: {
                width: '100%',
                height: '52px'
              }
            }
          }}
        >
          <NavigationList $align={ALIGN.left}>
            <NavigationItem>
              <div
                style={{ display: 'flex', alignContent: 'center', cursor: 'pointer' }}
                onClick={() => history.push(authenticated ? '/home/discover' : '/')}
              >
                <img
                  src="https://d1ppmvgsdgdlyy.cloudfront.net/giving_tree_long.png"
                  alt="Giving Tree"
                  style={{ height: 30, marginRight: 12 }}
                />
                {/* <strong>
                  <div style={{ textDecoration: 'none', color: 'black' }}>Giving Tree</div>
                </strong> */}
              </div>
            </NavigationItem>
          </NavigationList>
          <NavigationList $align={ALIGN.center} />
          <NavigationList $align={ALIGN.right} />
        </Navigation>
        <Media
          queries={{
            small: '(max-width: 599px)',
            medium: '(min-width: 600px) and (max-width: 1199px)',
            large: '(min-width: 1200px)'
          }}
        >
          {matches => (
            <div
              style={{
                paddingLeft: matches.small ? 0 : 24,
                paddingRight: matches.small ? 0 : 24,
                textAlign: 'center'
              }}
            >
              <h2 className="my-4 font-bold text-2xl">Login</h2>
              <Card
                overrides={{
                  Root: {
                    style: {
                      width: matches.medium || matches.large ? '512px' : '100%',
                      margin: '0 auto',
                      border: 'none',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      boxShadow: 'none'
                    }
                  }
                }}
              >
                {errorMessage && (
                  <p className="my-3 text-sm" style={{ color: 'rgb(204, 50, 63)' }}>
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
                    <ModalButton
                      size={'compact'}
                      kind={'minimal'}
                      onClick={() => setResetModal(false)}
                    >
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
                  style={{ textAlign: 'right', cursor: 'pointer', color: 'rgb(0, 121, 211)' }}
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
              </Card>
              <p className="my-3 text-sm">
                New to Giving Tree?{' '}
                <a className="text-indigo-600 hover:text-indigo-800" href="/signup">
                  Sign Up
                </a>
              </p>
            </div>
          )}
        </Media>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginDispatch: payload => dispatch(login(payload)),
  initiateResetDispatch: payload => dispatch(initiateReset(payload))
});

const mapStateToProps = state => ({
  user: state.global.user,
  isRegistered: state.auth.isRegistered,
  errorMessage: state.auth.errorMessage,
  loginLoading: state.auth.loginLoading,
  loginSuccess: state.auth.loginSuccess,
  loginFailure: state.auth.loginFailure,
  initiateResetSuccess: state.auth.initiateResetSuccess
});

Login.defaultProps = {};

Login.propTypes = {};

export default lifecycle(methods)
  (connect(mapStateToProps, mapDispatchToProps)(Login));
