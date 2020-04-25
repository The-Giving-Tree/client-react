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

  /**
   * Tell the parent component that the modal is open/closed
   *
   * @param {*} val
   * @memberof MobileOnboarding
   */
  setIsOpen(val) {
    this.props.setIsOpen(val);
  }

  getStepsJSX() {
    switch(this.state.activeStep) {
      case 0:
        return this.stepOneJSX();
      case 1:
        return this.stepTwoJSX();
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
  stepOneJSX() {
    return(
      <div className="py-10 text-center">
        <p 
          className="mb-6 text-lg md:text-xl text-hlgreen font-semibold">
          Welcome to the Giving Tree
          <span className="ml-3" role="img" aria-label="Tree emoji">🌳</span>
        </p>
        <p className="text-xl font-semibold mb-8">
          Are you here to request help or lend a hand?
        </p>
        <div className="flex items-center justify-between">
          <div className="w-full">
            <img className="mx-auto mb-5"
              src={`${Constants.IMG.CLOUDFRONT}/requestfeed/requesthelp.svg`}
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
            OR
          </div>
          <div className="w-full">
            <img 
              className="mx-auto mb-5"
              src={`${Constants.IMG.CLOUDFRONT}/requestfeed/beahelper.svg`}
              alt="Hand holding a heart" />
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
          <p className="my-10">
            You've come to the right place. Help is (literally) around the corner
          </p>        
        }
        {this.state.userRole === 'helper' && 
          <p className="my-10">
            The world needs people like you, now more than ever.
            <span className="ml-3" role="img" aria-label="Heart emoji">❤️</span>
          </p>        
        }
      </div>
    );
  }

  stepTwoJSX() {
    return(
      <div className="px-4 py-2">
        <div className="h-8 border border-gray-200"></div>
        TESTING AGAIN
      </div>
    );
  }
  
  render() {

    if (this.props.show) {
      return(
        <div
          className="MobileOnboarding fixed bg-white inset-0 flex flex-col">
          <div className="p-4 text-right">
            <Button variant="reset" onClick={() => {
              this.setIsOpen(false);
            }}>
              Skip
            </Button>
          </div>
          <div className="flex-grow p-4">
            {this.getStepsJSX()}
          </div>
        </div>
      );
    } else {
      return null;
    }
    
  }
}