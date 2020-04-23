import * as React from 'react';
import {
  Modal, ModalBody
} from 'baseui/modal';
import Heading from '../../../components/Heading';

class ModalAfterLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      userRole: ''
    }

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

  /**
   * Step one of the welcome modal. Asks the user what role they are taking, 
   * either helper, or requestor.
   *
   * @memberof ModalAfterLogin
   */
  selectUserRoleJSX() {
    return(
      <React.Fragment>
        <Heading level="1" className="text-hlgreen text-center mb-6">
          Welcome to the Giving Tree 
          <span className="ml-3" role="img" aria-label="Tree emoji">🌳</span>
        </Heading>
        <p className="text-center mb-6">
          Are you here to request help, or lend a hand?
        </p>
        
      </React.Fragment>
    );
  }

  render() {
    return(
      <Modal 
        isOpen={this.props.isOpen} 
        onClose={() => this.close()}
        overrides={{
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
        }}
      >
        <ModalBody>
          {this.state.activeStep === 0 && this.selectUserRoleJSX()}
        </ModalBody>
      </Modal>
    );
  }
}

export default ModalAfterLogin;