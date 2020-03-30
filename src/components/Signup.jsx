import * as React from 'react';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList
} from 'baseui/header-navigation';
import { Card, StyledAction } from 'baseui/card';
import { Redirect, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Input } from 'baseui/input';
import { Button, SHAPE } from 'baseui/button';
import { useStyletron } from 'baseui';
import Alert from 'baseui/icon/alert';
import Check from 'baseui/icon/check';
import { register } from '../store/actions/auth/auth-actions';
import Media from 'react-media';
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

function Signup(props) {
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [validPassword, setValidPassword] = React.useState(false);
  const authenticated = localStorage.getItem('giving_tree_jwt');

  const { signupDispatch, errorMessage, registerLoading } = props;

  const history = useHistory();

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

  const enterPressed = async event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      handleSignup();
    }
  };

  const handleSignup = async () => {
    await signupDispatch({
      env: process.env.NODE_ENV,
      name,
      email,
      username,
      password,
      rememberMe: true // by default
    });
  };

  if (authenticated) {
    return <Redirect to="/home/discover" />; // better home page redirect experience
  } else {
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
                onClick={() => history.push('/home/discover')}
              >
                <img
                  src="https://d1ppmvgsdgdlyy.cloudfront.net/acacia.svg"
                  alt="Giving Tree"
                  style={{ height: 30, marginRight: 12 }}
                />
                <strong>
                  <div style={{ textDecoration: 'none', color: 'black' }}>Giving Tree</div>
                </strong>
              </div>
            </NavigationItem>
          </NavigationList>
          <NavigationList $align={ALIGN.center} />
          <NavigationList $align={ALIGN.right} />
        </HeaderNavigation>
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
              <h2 className="my-4 font-bold text-2xl">Sign up</h2>
              <Card
                overrides={{
                  Root: {
                    style: {
                      width: matches.medium || matches.large ? '512px' : '100%',
                      margin: '0 auto',
                      border: 'none',
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
                <p className="my-3 text-sm" style={{ textAlign: 'center' }}>
                  By signing up, you agree to Giving Tree's <a href="/signup">Terms of Use</a>,{' '}
                  <a href="/signup">Privacy Policy</a> and <a href="/signup">Cookie Policy</a>.
                </p>
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
              </Card>
              <p className="my-3 text-sm">
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          )}
        </Media>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  signupDispatch: payload => dispatch(register(payload))
});

const mapStateToProps = state => ({
  user: state.auth.user,
  errorMessage: state.auth.errorMessage,
  registerLoading: state.auth.registerLoading,
  registerSuccess: state.auth.registerSuccess,
  registerFailure: state.auth.registerFailure
});

Signup.defaultProps = {};

Signup.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
