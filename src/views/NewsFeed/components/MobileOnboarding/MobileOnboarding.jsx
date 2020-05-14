import * as React from 'react';
import Button from '../../../../components/Button';
import Constants from '../../../../components/Constants';
import './MobileOnboarding.css';

export default class MobileOnboarding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      userRole: ''
    }

    this.setIsOpen = this.setIsOpen.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
  }

  /**
   * Tell the parent component that the modal is open/closed
   *
   * @param {*} val
   * @memberof MobileOnboarding
   */
  setIsOpen(val) {
    this.props.setIsOpen(val);
  }

  // TODO: When we have time to refactor, let's turn these steps in to
  // components

  /**
   * Retrieves the JSX based on the currently active step
   *
   * @returns
   * @memberof MobileOnboarding
   */
  getStepsJSX() {
    switch(this.state.activeStep) {
      case 0:
        return this.selectUserRole();
      case 1:
        return this.stepOneJSX();
      case 2:
        return this.stepTwoJSX();
      case 3:
        return this.stepThreeJSX();
      case 4:
        if (this.state.userRole === 'requester') return this.stepFourJSX();
        return this.finalStep();
      case 5:
        return this.finalStep();
      default:
        return this.stepOneJSX();
    }
  }

  /**
   * Step one of the modal
   *
   * @returns
   * @memberof MobileOnboarding
   */
  selectUserRole() {
    return(
      <div className="text-center select-user-role">
        <p 
          className="mb-6 text-lg md:text-xl text-green-600 font-semibold">
          Welcome to the Giving Tree
          <span className="ml-3" role="img" aria-label="Tree emoji">🌳</span>
        </p>
        <p className="mb-8">
          Are you here to request help or lend a hand?
        </p>
        <div className="flex items-center justify-between">
          <div className="w-full img-wrap flex flex-col justify-end">
            <img className="mx-auto mb-5"
              src={`${Constants.IMG.CLOUDFRONT}/requestfeed/Requester.svg`}
              alt="Hand reaching out" />
            <Button 
              variant={(this.state.userRole === 'requester') ? 'primary' : 'outline'} 
              className="text-sm" 
              onClick={(e) => {
                this.setState({ userRole: 'requester' })
              }}
            >
              Request help
            </Button>
          </div>
          <div className="w-24">
            or
          </div>
          <div className="w-full img-wrap flex flex-col justify-end">
            <img 
              className="mx-auto mb-5"
              src={`${Constants.IMG.CLOUDFRONT}/requestfeed/Helper.svg`}
              alt="Hand holding a heart" 
            />
            <Button 
              variant={
                (this.state.userRole === 'helper') ? 'primary' : 'outline'
              }
              className="text-sm" 
              onClick={() => {
                this.setState({ userRole: 'helper' })
              }}
            >
              Be a helper
            </Button>
          </div>
        </div>
        {this.state.userRole === 'requester' && 
          <p className="my-6">
            You've come to the right place. Help is (literally) around the corner
            <span className="ml-3" role="img" aria-label="Heart emoji">❤️</span>
          </p>        
        }
        {this.state.userRole === 'helper' && 
          <p className="my-6">
            The world needs people like you, now more than ever.
            <span className="ml-3" role="img" aria-label="Heart emoji">❤️</span>
          </p>        
        }
        {this.state.userRole && 
          <div className="text-right my-5">
            <Button variant="link" size="sm" onClick={() => {
              this.nextStep();
            }}>
              Continue to How It Works >
            </Button>
          </div>
        }
      </div>
    );
  }

  /**
   * Step One of the modal
   *
   * @returns
   * @memberof MobileOnboarding
   */
  stepOneJSX() {

    const role = this.state.userRole;
    const imgFolder = Constants.IMG.CLOUDFRONT + '/requestfeed/';
    const imgSrc =
      (role === 'requester') ? 'Online_Call.svg' : 'Step1.svg';

    return(
      <React.Fragment>
        <div className="text-center mb-6">
          {this.stepListJSX()}
          <p className="uppercase mb-6">How it works</p>
          <div className="mb-6">
            <img 
              className="mx-auto h-56 w-56"
              alt="Illustration of a computer and a phone"
              src={imgFolder + imgSrc}
            />
          </div>
          <p className="w-56 mx-auto">
            {this.state.userRole === 'requester' ? (
              <span>1. Create a new request by clicking <strong>Make a Request</strong>, or by calling/texting us at <strong>415-964-4261</strong>.</span>
            ) : (
             <span> 1. Explore the Requests Feed to find new requests in your area.</span>
            )}
          </p>
        </div>
        <div className="flex items-center mt-auto">
          <Button 
            size="sm"
            variant="link" 
            onClick={() => this.prevStep()}>
            Back
          </Button>
          <Button 
            size="sm"
            className="ml-auto"
            variant="link" 
            onClick={() => this.nextStep()}>
            Next
          </Button>
        </div>
      </React.Fragment>  
    );
  }

  /**
   * Step two JSX
   *
   * @returns
   * @memberof MobileOnboarding
   */
  stepTwoJSX() {
    const role = this.state.userRole;
    const imgFolder = Constants.IMG.CLOUDFRONT + '/requestfeed/';
    const imgSrc = (role === 'requester') ? 'Note.svg' : 'Step2.svg';

    return(
      <React.Fragment>
        <div className="text-center mb-6">
          {this.stepListJSX()}
          <p className="uppercase mb-6">How it works</p>
          <div className="mb-6">
            <img 
              className="mx-auto h-56 w-56"
              alt="Illustration of a message conversation"
              src={imgFolder + imgSrc}
            />
          </div>
          <p className="w-56 mx-auto">
            {this.state.userRole === 'requester' ? (
              <span>2. Be specific so that helpers can quickly and easily understand your needs.</span>
            ) : (
              <span>2. Click on a request to find out more, and comment if you have questions.</span>
            )}
          </p>
        </div>
        <div className="flex items-center mt-auto">
          <Button 
            size="sm"
            variant="link" 
            onClick={() => this.prevStep()}>
            Back
          </Button>
          <Button 
            size="sm"
            className="ml-auto"
            variant="link" 
            onClick={() => this.nextStep()}>
            Next
          </Button>
        </div>
      </React.Fragment>
    );
  }

  /**
   * Step three JSX
   *
   * @memberof MobileOnboarding
   */
  stepThreeJSX() {
    const role = this.state.userRole;
    const imgFolder = Constants.IMG.CLOUDFRONT + '/requestfeed/';
    const imgSrc = (role === 'requester') ? 'Calendar.svg' : 'Step3.svg';
    return(
      <React.Fragment>
        <div className="text-center mb-6">
          {this.stepListJSX()}
          <p className="uppercase mb-6">How it works</p>
          <div className="mb-6">
            <img 
              className="mx-auto h-56 w-56"
              alt="Illustration of a computer and a phone"
              src={imgFolder + imgSrc}
            />
          </div>
          <p className="w-56 mx-auto">
            {this.state.userRole === 'requester' ? (
              <span>3. Be as flexible with the timing as you can, to give nearby helpers a chance to find and fulfill your request.</span>
            ) : (
              <span>3. Once you've found a request you can help with, press Help to claim it.</span>
            )}            
          </p>
        </div>
        <div className="flex items-center mt-auto">
          <Button 
            size="sm"
            variant="link" 
            onClick={() => this.prevStep()}>
            Back
          </Button>
          <Button 
            size="sm"
            className="ml-auto"
            variant="link" 
            onClick={() => {
              if (role === 'requester') {
                this.nextStep();
              } else {
                this.setIsOpen(false);
              }
            }}>
            {role === 'requester' ? 'Next' : 'Let\'s get started'}
          </Button>
        </div>
      </React.Fragment>
    );
  }

  /**
   * Step four JSX
   *
   * @memberof MobileOnboarding
   */
  stepFourJSX() {
    return(
      <React.Fragment>
        <div className="text-center mb-6">
          {this.stepListJSX()}
          <p className="uppercase mb-6">How it works</p>
          <div>
            <img 
              className="mx-auto h-56 w-56"
              alt="Illustration of a computer and a phone"
              src={`${Constants.IMG.CLOUDFRONT}/requestfeed/requester-step4.svg`}
            />
          </div>
          <p className="w-56 mx-auto">
            4. Once your request is posted, keep an eye out for comments from potential helpers!
          </p>
        </div>
        <div className="flex items-center mt-auto">
          <Button 
            size="sm"
            variant="link" 
            onClick={() => this.prevStep()}>
            Back
          </Button>
          <Button 
            size="sm"
            className="ml-auto"
            variant="link" 
            onClick={() => this.setIsOpen(false)}>
            Let's get started
          </Button>
        </div>
      </React.Fragment>
    );
  }

  /**
   * The final step of the modal. Allows the user to either create a request,
   * or browse the requests
   *
   * @returns
   * @memberof MobileOnboarding
   */
  finalStep() {
    const role = this.state.userRole;
    return(
      <React.Fragment>
        <div className="text-center my-auto">
          <p className="mb-8">
            {role === 'requester' ? (
              <span>See what others in your area are asking for - 
              you might find a request you can help with!</span>
            ) : (
              <span>Sometimes helpers need help too! 
              Please don’t hesitate to make your 
              own requests.</span>
            )}
          </p>
          <div className="flex items-center justify-between">
            <div className="w-full img-wrap flex flex-col justify-end">
              <img 
                className="mx-auto mb-5"
                src={`${Constants.IMG.CLOUDFRONT}/requestfeed/Requester.svg`}
                alt="Hand reaching out" />
              <Button 
                size="sm"
                variant="outline"
                className="text-sm" 
                onClick={(e) => {
                  this.props.history.push('/submit');
                }}
              >
                Make a request
              </Button>
            </div>
            <div className="w-24">
              or
            </div>
            <div className="w-full img-wrap flex flex-col justify-end">
              <img 
                className="mx-auto mb-5"
                src={`${Constants.IMG.CLOUDFRONT}/requestfeed/Helper.svg`}
                alt="Hand holding a heart" />
              <Button 
                size="sm"
                variant="outline"
                className="text-sm" 
                onClick={() => this.setIsOpen(false)}
              >
                Browse requests
              </Button>
            </div>
          </div>

        </div>
        <div className="flex items-center mt-auto">
          <Button 
            size="sm"
            variant="link" 
            onClick={() => this.prevStep()}>
            Back
          </Button>
        </div>
      </React.Fragment> 
    );
  }

  /**
   * List of steps that sits above the step content
   *
   * @returns
   * @memberof MobileOnboarding
   */
  stepListJSX() {
    const step = this.state.activeStep;
    return(
      <div 
        className="relative rounded-full flex items-center w-full step-list mb-6">
        <span 
          className={`py-1 px-3 step-button relative text-xs text-white w-full
          ${step === 1 ? 'active' : step > 1 ? 'complete' : '' }`}
        >
          <span>Step 1</span>
        </span>
        <span 
          className={`py-1 px-3 step-button relative text-xs text-white w-full
          ${step === 2 ? 'active' : step > 2 ? 'complete' : '' }`}
        >
          <span>Step 2</span>
        </span>
        <span 
          className={`py-1 px-3 step-button relative text-xs text-white w-full
          ${step === 3 ? 'active' : step > 3 ? 'complete' : '' }`}
        >
          <span>Step 3</span>
        </span>
        {this.state.userRole === 'requester' && 
          <span
            className={`py-1 px-3 step-button relative text-xs text-white w-full
            ${step === 4 ? 'active' : step > 4 ? 'complete' : '' }`}
          >
            <span>Step 4</span>
          </span>
        }
      </div>
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
  
  render() {
    if (this.props.show) {
      return(
        <div
          className="MobileOnboarding fixed bg-white inset-0 flex flex-col">
          <div className="p-4 text-right">
            <Button 
              variant="reset" 
              onClick={() => {
                this.setIsOpen(false);
              }}
            >
              Skip
            </Button>
          </div>
          <div className="flex-grow px-4 pb-4 flex flex-col">
            {this.getStepsJSX()}
          </div>
        </div>
      );
    } else {
      return null;
    }
    
  }
}