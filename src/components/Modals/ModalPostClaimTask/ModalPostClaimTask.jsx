import * as React from 'react';
import Media from 'react-media';

import Constants from '../../Constants';

class ModalPostClaimTask extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0
    }
    // Tell the parent component the open/closed state.
    this.setIsOpen = this.setIsOpen.bind(this);
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

  render() {
    return(
      <Media queries={Constants.BREAKPOINTS}>
      {matches => {
        return <h1>TESTING</h1>
      }}
    </Media>
    );
  }
}

export default ModalPostClaimTask;