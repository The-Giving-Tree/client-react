import * as React from 'react';
import { connect } from 'react-redux';
import { replace } from 'connected-react-router'

import { selectMenu, setaccessToken } from '../../store/actions/auth/auth-actions';
import Constants from '../../components/Constants';
import Navigation from '../../components/Navigation';
import HelpMenu from '../../components/HelpMenu';

class OAuthResult extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(this.props.location.search);
    const accessToken = urlParams.get('accessToken');
    const error = urlParams.get('errorMessage');

    if (accessToken) {
      this.props.setaccessTokenDispatch({
        token: accessToken,
        env: process.env.REACT_APP_NODE_ENV
      });
      
      this.props.replaceDispatch(Constants.PATHS.NEWSFEED);
    } else if (error) {
      this.setState({ error });
    } else {
      this.props.replaceDispatch(Constants.PATHS.HOME);
    }
  }

  render() {
    return <React.Fragment>
      <Navigation selectMenuDispatch={this.props.selectMenuDispatch} />
      <div className="lg:max-w-4xl xl:max-w-screen-xl w-full mx-auto py-12 px-6">
        <p className="text-xl text-red-700 font-semibold mb-5">Error</p>
        <p>{ this.state.error }</p>
      </div>
      <HelpMenu />  
    </React.Fragment>
  }
}


const mapDispatchToProps = dispatch => ({
  selectMenuDispatch: payload => dispatch(selectMenu(payload)),
  setaccessTokenDispatch: payload => dispatch(setaccessToken(payload)),
  replaceDispatch: payload => dispatch(replace(payload))
});

const mapStateToProps = state => ({
  loginSuccess: state.auth.loginSuccess
});

export default connect(mapStateToProps, mapDispatchToProps)(OAuthResult);