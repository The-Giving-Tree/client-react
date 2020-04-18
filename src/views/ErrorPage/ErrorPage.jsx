import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navigation from '../../components/Navigation';

class ErrorPage extends Component {
  render() {
    return (
      <div style={{ width: '100%' }}>
        <Navigation />
        <div style={{ paddingLeft: 24, paddingRight: 24 }}>
          <h1 style={{ color: 'rgb(112, 108, 100)', textAlign: 'center' }}>Oops! You hit a 404!</h1>
        </div>
      </div>
    );
  }
}

ErrorPage.propTypes = {
  errorCode: PropTypes.string
};

export default ErrorPage;
