import * as React from 'react';
import {
  Modal, ModalBody
} from 'baseui/modal';
import Heading from '../../../components/Heading';
import Constants from '../../../components/Constants';
import Media from 'react-media';

export default class DesktopOnboarding extends React.Component {
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
        <Heading 
          level="1" 
          className="text-hlgreen text-center mb-6 text-lg md:text-xl"
        >
          Welcome to the Giving Tree 
          <span className="ml-3" role="img" aria-label="Tree emoji">🌳</span>
        </Heading>
        <p className="text-center mb-6">
          Are you here to request help, or lend a hand?
        </p>
        <div className="flex items-center justify-between px-40">
          <div className="w-1/3">
            <img className="mx-auto"
              src={`${Constants.IMG.CLOUDFRONT}/requestfeed/requesthelp.svg`}
              alt="Hand reaching out" />
          </div>
          <div className="p-6 w-1/3 text-center">OR</div>
          <div className="w-1/3">
          <img className="mx-auto"
            src={`${Constants.IMG.CLOUDFRONT}/requestfeed/beahelper.svg`}
            alt="Hand holding a heart" />
          </div>
        </div>
      </React.Fragment>
    );
  }

  /**
   * JSX for the desktop version of the modal
   *
   * @returns
   * @memberof ModalAfterLogin
   */
  modalJSX(screen) {
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
              minWidth: '75%',
              maxWidth: 'calc(100% - 2rem)',
              margin: '0 auto',
              top: '50%',
              transform: 'translateY(-50%)',
            }
          }
        }}
      >
        <ModalBody style={{
          position: 'relative',
          margin: 'auto 0'
        }}>
          {this.state.activeStep === 0 && this.selectUserRoleJSX()}
        </ModalBody>
      </Modal>
    );
  }



  render() {
    return(
      <Media
        queries={{
          xs: '(max-width: 414px)',
          sm: '(min-width: 415px) and (max-width: 767px)',
          md: '(min-width: 768px) and (max-width: 1023px)',
          lg: '(min-width: 1024px) and (max-width: 1279px)',
          xl: '(min-width: 1280px)'
        }}
      >
        {matches => (
          this.modalJSX(matches)
        )}
      </Media>
    );
  }
}