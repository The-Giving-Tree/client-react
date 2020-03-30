/* eslint-disable */
import React from 'react';
import { Block } from 'baseui/block';
import { useHistory } from 'react-router-dom';
import SignupLoginImage from '../../assets/signup-login-img.png';
import '../../styles/home-page.css'

const SignupLoginHomePage = props => {
  const { matches } = props;
  const history = useHistory();

  return (
    <div className="signup-login-container">
      <img alt="Giving Tree Project Home Page" src={SignupLoginImage} />
      <div
        className="auth-content-container"
        style={{
          borderColor: 'red',
          borderStyle: 'solid',
          borderWidth: 1,
          // TODO: remove the 3 styles above
          paddingLeft: 24,
          paddingRight: 24
        }}
      >
        <div className="auth-header-info"></div>
        <div className="auth-form-container"></div>
      </div>
    </div>
  );
};

export default SignupLoginHomePage;
