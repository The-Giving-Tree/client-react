import * as React from 'react';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList
} from 'baseui/header-navigation';
import { Notification } from 'baseui/notification';
import lifecycle from 'react-pure-lifecycle';
import { Card, StyledAction } from 'baseui/card';
import { Input } from 'baseui/input';
import { useHistory } from 'react-router-dom';
import { Button, SHAPE } from 'baseui/button';
import { useStyletron } from 'baseui';
import Alert from 'baseui/icon/alert';
import Check from 'baseui/icon/check';
import { connect } from 'react-redux';
import Media from 'react-media';
import { login, initiateReset, confirmPassword } from '../../store/actions/auth/auth-actions';
import passwordValidator from 'password-validator';
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

const componentDidUpdate = props => {};

const methods = {
  componentDidUpdate
};

/**
 * @function
 * @name ResetPassword - container component housing bulk of logic for buy flow
 * @param {object} props - see PropTypes for definitions
 * @returns {Element}
 */
function ResetPassword(props) {
  const { errorMessage, loginLoading, confirmPasswordDispatch, confirmPasswordSuccess } = props;
  const [password, setPassword] = React.useState('');
  const [validPassword, setValidPassword] = React.useState(false);

  const token = props.match.params.token;

  const history = useHistory();

  const enterPressed = async event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      handleConfirmPassword();
    }
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

  function handleConfirmPassword() {
    confirmPasswordDispatch({ env: process.env.REACT_APP_NODE_ENV, password: password, token: token });
  }

  if (confirmPasswordSuccess) {
    alert('succesfully changed password - please try logging in now');
    history.push('/login');
  }

  const authenticated = localStorage.getItem('giving_tree_jwt');

  return (
    <div style={{ width: '100%' }}>
      <HeaderNavigation
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
      </HeaderNavigation>
      <div style={{ paddingLeft: 24, paddingRight: 24, textAlign: 'center' }}>
        {confirmPasswordSuccess && (
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
            Password Reset Successfully!
          </Notification>
        )}
        <h2 className="my-4 font-bold text-2xl">Reset Password</h2>
        <Media
          queries={{
            small: '(max-width: 599px)',
            medium: '(min-width: 600px) and (max-width: 1199px)',
            large: '(min-width: 1200px)'
          }}
        >
          {matches => (
            <Card
              overrides={{
                Root: {
                  style: {
                    width: matches.medium || matches.large ? '512px' : '100%',
                    margin: '0 auto'
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
                value={password}
                error={password && !validPassword}
                positive={password && validPassword}
                overrides={{
                  After:
                    password && !validPassword
                      ? Negative
                      : password && validPassword
                      ? Positive
                      : ''
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
                  onClick={handleConfirmPassword}
                  disabled={!password || !validPassword || loginLoading}
                  shape={SHAPE.pill}
                  overrides={{
                    BaseButton: { style: { width: '100%' } }
                  }}
                  isLoading={loginLoading}
                >
                  Reset Password
                </Button>
              </StyledAction>
            </Card>
          )}
        </Media>
        <p className="my-3 text-sm">
          New to Giving Tree?{' '}
          <a className="text-blue-600 hover:text-blue-800" href="/signup">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  loginDispatch: payload => dispatch(login(payload)),
  initiateResetDispatch: payload => dispatch(initiateReset(payload)),
  confirmPasswordDispatch: payload => dispatch(confirmPassword(payload))
});

const mapStateToProps = state => ({
  user: state.global.user,
  isRegistered: state.auth.isRegistered,
  errorMessage: state.auth.errorMessage,
  loginLoading: state.auth.loginLoading,
  loginSuccess: state.auth.loginSuccess,
  loginFailure: state.auth.loginFailure,
  confirmPasswordSuccess: state.auth.confirmPasswordSuccess
});

ResetPassword.defaultProps = {};

ResetPassword.propTypes = {};

export default lifecycle(methods)(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));
