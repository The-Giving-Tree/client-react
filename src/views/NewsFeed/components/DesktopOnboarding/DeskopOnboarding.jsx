import * as React from 'react';
import {
  Modal, ModalBody
} from 'baseui/modal';
import Heading from '../../../../components/Heading';
import Constants from '../../../../components/Constants';
import Button from '../../../../components/Button';

export default class DesktopOnboarding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      userRole: ''
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
   * Retrieves the JSX based on the currently active step
   *
   * @returns
   * @memberof MobileOnboarding
   */
  getStepsJSX() {
    switch(this.state.activeStep) {
      case 0:
        return this.selectUserRoleJSX();
      case 1:
        return this.howItWorksJSX();
      case 2:
        return this.finalStepJSX();
      default:
        return this.selectUserRoleJSX();
    }
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
          className="text-hlgreen text-center mb-6 text-2xl"
        >
          Welcome to the Giving Tree 
          <span className="ml-3" role="img" aria-label="Tree emoji">🌳</span>
        </Heading>
        <p className="text-center mb-6">
          Are you here to request help, or lend a hand?
        </p>
        <div className="flex items-center justify-between px-32">
          <div className="w-1/3 text-center flex flex-col">
            <Button 
              onClick={() => {
                this.setState({
                  userRole: 'requester', 
                  activeStep: this.state.activeStep + 1
                })
              }}
              variant="reset" 
              className="mb-8">
                <img
                  className="mx-auto"
                  src={`${Constants.IMG.CLOUDFRONT}/requestfeed/requesthelp.svg`}
                  alt="Hand reaching out" />
            </Button>
            <span className="mt-auto">Request help</span>
          </div>
          <div 
            className="px-6 w-1/3 text-center self-stretch flex flex-col
            items-center justify-center">
              <span className="my-auto">OR</span>
              <div className="mt-auto">
                {this.stepDots()}
              </div>
          </div>
          <div className="w-1/3 text-center flex flex-col">
            <Button 
              onClick={() => {
                this.setState({
                  userRole: 'helper', 
                  activeStep: this.state.activeStep + 1
                })
              }}
              variant="reset" 
              className="mb-8">
              <img 
                className="mx-auto"
                src={`${Constants.IMG.CLOUDFRONT}/requestfeed/beahelper.svg`}
                alt="Hand holding a heart" />
            </Button>
            <span className="mt-auto">Be a helper</span>
          </div>
        </div>
      </React.Fragment>
    );
  }

  /**
   * Step that explains how the platform works
   *
   * @returns
   * @memberof DesktopOnboarding
   */
  howItWorksJSX() {
    const role = this.state.userRole;
    const imgFolder = Constants.IMG.CLOUDFRONT + '/requestfeed/';
    return(
      <React.Fragment>
        {(role === 'requester') ? (
          <p className="text-2xl font-bold text-center mb-6 px-16">
            You've come to the right place, help is (literally) around the corner. <span role="img" aria-label="heart emoji">❤️</span>
          </p>
        ) : (
          <p className="text-2xl font-bold text-center mb-8 px-16">
            The world needs people like you, now more than ever. <span role="img" aria-label="heart emoji">❤️</span>
          </p>
        )}
        <p className="text-lg text-center my-8">How it works:</p>
        <div className={`px-16 mb-6 grid gap-4 ${role === 'requester' ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {role === 'requester' ? (
            <React.Fragment>
              <div>
                <img className="mx-auto mb-4"
                  src={imgFolder + 'request-step1.svg'}
                  alt="Illustration of a computer and a phone"
                />
                <span>1. Create a new request by clicking Create Request, or by calling/texting us at 415-964-4261.</span>
              </div>
              <div>
                <img className="mx-auto mb-4"
                  src={imgFolder + 'request-step2.svg'}
                  alt="Illustration of a speech bubble"
                />
                <span>2. Be specific so that helpers can quickly and easily understand your needs.</span>
              </div>
              <div>
                <img className="mx-auto mb-4"
                  src={imgFolder + 'request-step3.svg'}
                  alt="Illustration of a calendar"
                />
                <span>
                  3. Be as flexible with the timing as you can, to give nearby helpers a chance to find and fulfill your request.
                </span>
              </div>
              <div>
                <img className="mx-auto mb-4"
                  src={imgFolder + 'request-step4.svg'}
                  alt="Illustration of the giving tree platform notifications"
                />
                <span>
                  4. Once your request is posted, keep an eye out for comments from potential helpers!
                </span>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div>
                <img className="mx-auto mb-4"
                  src={imgFolder + 'Helper-Step1.svg'}
                  alt="Illustration of a mobile phone"
                />
                <span>
                  1. Explore the <strong>Requests Feed</strong> to find new requests in your area.
                </span>
              </div>
              <div>
                <img className="mx-auto mb-4"
                  src={imgFolder + 'Helper-Step2.svg'}
                  alt="Illustration of a message conversation"
                />
                <span>
                  2. Click on a request to find out more, and comment if you have questions. 
                </span>
              </div>
              <div>
                <img className="mx-auto mb-4"
                  src={imgFolder + 'Helper-Step3.svg'}
                  alt="Illustration of a hands in a friendly embrace"
                />
                <span>
                  3. Once you've found a request you can help with, press <strong>Help</strong> to claim it. 
                </span>
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="flex items-center px-10">
          <Button 
            size="lg"
            variant="link"
            className="mr-auto"
            onClick={() => this.prevStep()}
          >Back</Button>
          <div className="mx-auto">{this.stepDots()}</div>
          <Button
            size="lg"
            variant="link"
            className="ml-auto"
            onClick={() => this.nextStep()}
          >Next</Button>
        </div>
      </React.Fragment>
    );
  }

  /**
   * Final step of the desktop onboarding modal
   *
   * @memberof DesktopOnboarding
   */
  finalStepJSX() {
    const role = this.state.userRole;
    return(
      <React.Fragment>
        <div className="text-center my-auto px-10">
          <p className="mb-8 text-2xl font-bold">
            Let's get started!
          </p>
          <div className={`mb-6 flex items-center justify-between ${role === 'helper' ? 'flex-row-reverse' : ''}`}>
            <div className="w-full img-wrap flex flex-col justify-end">
              <img 
                className="mx-auto mb-5"
                src={`${Constants.IMG.CLOUDFRONT}/requestfeed/createrequest.svg`}
                alt="Illustration of a computer and a phone" />
              <div>
                <Button 
                  variant="primary"
                  onClick={(e) => this.props.history.push('/submit')}
                >
                  Create request
                </Button>
              </div>
            </div>
            <div className="w-24">
              OR
            </div>
            <div className="w-full img-wrap flex flex-col justify-end">
              <img 
                className="mx-auto mb-5"
                src={`${Constants.IMG.CLOUDFRONT}/requestfeed/browserequest.svg`}
                alt="Illustration of mobile phone" />
              <div>
                <Button 
                  variant="primary"
                  onClick={() => this.setIsOpen(false)}
                >
                  Browse requests
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full">
            </div>
            <div className="w-24"></div>
            <div className="w-full">
              <p className="text-xs mt-auto">
                {role === 'requester' &&
                  <span>See what others in your area are asking for - you
                  might even find a request you can help with!</span>
                }
                {role === 'helper' &&
                  <span>Sometimes helpers need help to!<br/>Please don't hesitate to make your own requests.</span>
                }
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 px-10">
          <div className="text-left">
            <Button 
              size="lg"
              variant="link"
              className="mr-auto"
              onClick={() => this.prevStep()}
            >Back</Button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div>{this.stepDots()}</div>
          </div>
          <div className=""></div>
        </div>
      </React.Fragment> 
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
   * Go to the next step of the modal
   *
   * @memberof MobileOnboarding
   */
  nextStep() {
    this.setState({ activeStep: this.state.activeStep + 1 })
  }

  /**
   * Go to the previous step of the modal
   *
   * @memberof MobileOnboarding
   */
  prevStep() {
    this.setState({ activeStep: this.state.activeStep - 1 })
  }

  /**
   * JSX for the desktop version of the modal
   *
   * @returns
   * @memberof ModalAfterLogin
   */
  modalJSX() {
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
              padding: '3rem 0 2rem 0',
              borderRadius: '6px',
              position: 'absolute',
              width: '80%',
              maxWidth: '1024px',
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
          {this.getStepsJSX()}
        </ModalBody>
      </Modal>
    );
  }

  render() {
    return(
      this.modalJSX()
    );
  }
}