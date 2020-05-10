import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody } from 'baseui/modal';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';

import Media from 'react-media';
import Constants from '../../../../components/Constants';
import Heading from '../../../../components/Heading';
import Button from '../../../../components/Button';

import { handleSeenSubmit } from '../../../../store/actions/user/user-actions';

import './ModalPostSuccess.css';

class ModalPostSuccess extends React.Component {
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

  /**
   * Content in the modal when viewing on mobile
   *
   * @returns
   * @memberof ModalPostSuccess
   */
  mobileContent() {
    return(
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          {this.getStepsJSX()}
        </div>
        {this.controlsJSX()}
      </div>
    );
  }

  /**
   * Retrieves the JSX based on the currently active step
   *
   * @returns
   * @memberof MobileOnboarding
   */
  getStepsJSX() {
    switch(this.state.activeStep) {
      case 0:
        return this.stepOne();
      case 1:
        return this.stepTwo();
      case 2:
        return this.stepThree();
      default:
        return;
    }
  }

  /**
   * Step one of the mobile modal
   *
   * @returns
   * @memberof ModalPostSuccess
   */
  stepOne() {
    return(
      <React.Fragment>
        <img
          className="mx-auto mb-4" 
          src={`${Constants.IMG.CLOUDFRONT}/post/modals/step1-notifications.svg`} 
          alt="Illustration of mobile phone getting notifications"
        />
        <p><strong>1. Watch for notifications</strong></p>
        <p>
          Your helper will reach out to you soon via your preferred contact method.
        </p>
      </React.Fragment>
    );
  }

  /**
   * Step two of the mobile modal content
   *
   * @returns
   * @memberof ModalPostSuccess
   */
  stepTwo() {
    return(
      <React.Fragment>
        <img
          className="mx-auto mb-4" 
          src={`${Constants.IMG.CLOUDFRONT}/post/modals/step2-together.svg`} 
          alt="Illustration of two thumbs up"
        />
        <p>
          <strong>2. Work together</strong>
        </p>
        <p>Agree on how best to reimburse your helper (no-contact methods only) and how/where items should be delivered.</p>
      </React.Fragment>
    );
  }

  /**
   * Step three of the mobile modal content
   *
   * @returns
   * @memberof ModalPostSuccess
   */
  stepThree() {
    return(
      <React.Fragment>
        <img
          className="mx-auto mb-4" 
          src={`${Constants.IMG.CLOUDFRONT}/post/modals/step3-safety.svg`} 
          alt="Illustration of COVID PPE"
        />
        <p><strong>3. Be smart. Stay safe.</strong></p>
        <p>Follow all <a className="text-green-500" href="https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html">health and safety guidelines</a> for COVID-19 to protect yourself and your helper.</p>
      </React.Fragment>
    );
  }

  /**
   * Content in the modal when viewing on desktop
   *
   * @returns
   * @memberof ModalPostSuccess
   */
  desktopContent() {
    return(
      <div className="grid grid-cols-3 gap-6">
        <div className="">
          {this.stepOne()}
        </div>
        <div className="">
          {this.stepTwo()}
        </div>
        <div className="">
        {this.stepThree()}
        </div>
      </div>
    );
  }

  /**
   * Controls for the modal when viewing on mobile
   *
   * @returns
   * @memberof ModalPostSuccess
   */
  controlsJSX() {
    return(
      <div className="grid grid-cols-3">
        <div>
          {this.state.activeStep !== 0 && ( 
            <Button 
              size="lg"
              variant="link"
              className="mr-auto"
              onClick={() => this.setState({
                activeStep: (this.state.activeStep - 1)
              })}
            >Back</Button>          
          )}
        </div>
        <div className="text-center flex items-center justify-center">
          {this.stepDots()}
        </div>
        <div className="text-right">
          <Button
            size="lg"
            variant="link"
            className="ml-auto"
            onClick={() => {
              if (this.state.activeStep === 2) {
                this.setIsOpen(false);
              } else {
                this.setState({ activeStep: (this.state.activeStep + 1) })
              }
            }}
          >
            {this.state.activeStep === 2 ? (
              <span>Dismiss</span>
            ) : (
              <span>Next</span>
            )}
          </Button>
        </div>
      </div>
    );
  }

  /**
   * Dot buttons on the bottom of the modal
   *
   * @returns
   * @memberof DesktopOnboarding
   */
  stepDots() {
    const step = this.state.activeStep;
    return(
      <React.Fragment>
        <Button 
          onClick={() => this.setState({ activeStep: 0 })}
          variant="reset"
          className={`h-2 w-2 ${step === 0 ? 'bg-gray-900' : 'bg-gray-400'}`}></Button>
        <Button 
          onClick={() => this.setState({ activeStep: 1 })}
          variant="reset"
          className={`h-2 w-2 mx-4 ${step === 1 ? 'bg-gray-900' : 'bg-gray-400'}`}></Button>
        <Button 
          onClick={() => this.setState({ activeStep: 2 })}
          variant="reset"
          className={`h-2 w-2 ${step === 2 ? 'bg-gray-900' : 'bg-gray-400'}`}></Button>
      </React.Fragment>
    );
  }

  /**
   * Fire a request to the back end to mark that the tutorial has been seen.
   *
   * @memberof ModalPostSuccess
   */
  async dismissForever() {
    await this.props.seenTutorial({
      env: process.env.REACT_APP_NODE_ENV,
      type: 'submit'
    });
  };

  render() {
    return(
      <Media queries={Constants.BREAKPOINTS}>
      {matches => {
        return(
          <Modal
            closeable={false}
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
                  minHeight: 500,
                  padding: '3rem 2rem 2rem 2rem',
                  borderRadius: '6px',
                  position: 'absolute',
                  width: '80%',
                  maxWidth: '1024px',
                  margin: '0 auto',
                  top: '50%',
                  transform: 'translateY(-50%)',
                },
                props: {
                  className: 'ModalPostSuccess'
                }
              }
            }}
          >
            <ModalBody style={{
              position: 'relative',
              margin: 'auto 0'
            }}>
              <StatefulPopover 
                placement={PLACEMENT.bottomRight}
                overrides={{
                  Body: {
                    style: {
                      zIndex: 100,
                      borderRadius: '6px !important'
                    }
                  },
                  Inner: {
                    style: {
                      borderRadius: '6px !important'
                    }
                  }
                }}
                content={({ close }) => (
                  <div className="">
                    <ul className="list-none">
                      <li className="px-3 py-2">
                        <Button
                          variant="reset" 
                          onClick={() => {
                            this.setIsOpen(false)
                          }}>
                          Dismiss
                        </Button>
                      </li>
                      <li className="px-3 py-2">
                        <Button
                          variant="reset" 
                          onClick={() => {
                            this.dismissForever();
                            this.setIsOpen(false);
                          }}>
                          Dismiss forever
                        </Button>
                      </li>
                    </ul>
                  </div>
                )}
              >
                <button 
                  className="text-xs flex items-center justify-center h-8 w-8 close-button absolute"
                >
                  x
                </button>
              </StatefulPopover>
              <Heading level="2" className="text-center mb-6">
                Your post is live 
                <span 
                  role="img" 
                  aria-label="Partying face"
                  className="ml-2"
                >🥳</span>
              </Heading>
              <p className="text-center uppercase md:normal-case mb-4">
                What's next?
              </p>
              {!matches.xs && !matches.sm ? (
                this.desktopContent()
              ) : (
                this.mobileContent()
              )}
            </ModalBody>
          </Modal>
        );
      }}
    </Media>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  seenTutorial: payload => dispatch(handleSeenSubmit(payload))
});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModalPostSuccess);