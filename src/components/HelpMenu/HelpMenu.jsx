import * as React from 'react';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';
import './HelpMenu.css';
import { NavLink } from 'react-router-dom';

import {
  Modal, ModalHeader, ModalBody, ModalFooter, ModalButton
} from 'baseui/modal';
import axios from 'axios';
import ROUTES from '../../utils/routes';


import { RadioGroup, Radio } from 'baseui/radio';
import { Select } from 'baseui/select';
import { ALIGN } from 'baseui/header-navigation';
import { Input } from 'baseui/input';

class HelpMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      feedbackModalOpen: false,
      pmf: 'Very disappointed',
      benefit: '',
      userType: { 
        id: 'Student', 
        value: 'Student'
      },
      personalBenefit: '',
      suggestion: '',
      sendingFeedback: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
  }
  
  showFeedbackModal(val) {
    this.setState({ feedbackModalOpen: val })
  }

  setStateVal(key, val) {
    this.setState({ [key]: val})
  }

  handleFeedback(){
    this.setStateVal('sendingFeedback', true);
    const msg = {
      text: `user: ${this.props.user.email} / ${this.props.user.username}.\n\n1: PMF: ${this.state.pmf}.\n\n2: benefit of Giving Tree: ${this.state.benefit}.\n\n3: role: ${this.state.userType.value}.\n\n4: personal benefit: ${this.state.personalBenefit}.\n\n5: suggestion: ${this.state.suggestion}`
    };

    const headers = {
      headers: { Authorization: `Bearer ${localStorage.getItem('giving_tree_jwt')}` }
    };

    axios
    .post(`${ROUTES[process.env.REACT_APP_NODE_ENV].giving_tree}/feedback`, msg, headers)
    .then(success => {
      this.setStateVal('sendingFeedback', false);
      this.showFeedbackModal(false);

      // reset
      this.setState({
        pmf: '',
        benefit: '',
        userType: '',
        personalBenefit: '',
        suggestion: ''
      })

      alert('Feedback received. Thank You! 🌳');
    })
    .catch(err => {
      this.setStateVal('sendingFeedback', false);
      console.log('error while submitting feedback: ', err);
      alert('error while submitting feedback!');
    });
    };

  render() {


    return (
      <div className="HelpMenu rounded-full shadow-lg bg-white">
        {/* GIVE FEEDBACK MODAL! */}
        <Modal
          overrides={{ Dialog: { style: { borderRadius: '7px' } } }}
          onClose={() => {
            this.showFeedbackModal(false)
          }}
          isOpen={this.state.feedbackModalOpen}
        >
          <ModalHeader>Feedback for Giving Tree</ModalHeader>
          <ModalBody>
            How would you feel if you could no longer use Giving Tree?
            <RadioGroup value={this.state.pmf} disabled={this.state.sendingFeedback}
            onChange={e => {
              this.setStateVal('pmf', e.target.value)
            }} align={ALIGN.vertical}>
              <Radio overrides={{ Label: { style: { fontSize: 14 } } }} value="Not disappointed">
                Not disappointed
              </Radio>
              <Radio overrides={{ Label: { style: { fontSize: 14 } } }} value="Somewhat disappointed">
                Somewhat disappointed
              </Radio>
              <Radio overrides={{ Label: { style: { fontSize: 14 } } }} value="Very disappointed">
                Very disappointed
              </Radio>
            </RadioGroup>
            <br />
            What type of people do you think would most benefit from Giving Tree?
            <Input disabled={this.state.sendingFeedback}
              onChange={e => {
                this.setStateVal('benefit', e.target.value)
              }}
              placeholder="Type your response"
            />
            <br />
            What best describes your role?
            <Select disabled={this.state.sendingFeedback}
              options={[
                { id: 'Post Doc', value: 'Post Doc' },
                { id: 'Student', value: 'Student' },
                { id: 'Health Provider', value: 'Health Provider' },
                { id: 'Venture Capitalist', value: 'Venture Capitalist' },
                { id: 'Researcher', value: 'Researcher' },
                { id: 'Lab Director', value: 'Lab Director' },
                { id: 'Medical Doctor', value: 'Medical Doctor' },
                { id: 'Patient', value: 'Patient' },
                { id: 'Engineer', value: 'Engineer' },
                { id: 'Other', value: 'Other' }
              ]}
              labelKey="id"
              valueKey="value"
              maxDropdownHeight="250px"
              placeholder="Select role"
              value={this.state.userType}
              onChange={({ value }) => {
                this.setStateVal('userType', value[0])
              }}
            />
            <br />
            What is the main benefit <strong>you</strong> receive from Giving Tree?
            <Input disabled={this.state.sendingFeedback}
              onChange={e => {
                this.setStateVal('personalBenefit', e.target.value)
              }}
              placeholder="Type your response"
            />
            <br />
            How can we improve Giving Tree for you?
            <Input
              onChange={e => {
                this.setStateVal('suggestion', e.target.value)
              }}
              placeholder="Type your response"
            />
          </ModalBody>
          <ModalFooter>
            <ModalButton disabled={this.state.sendingFeedback}
              size={'compact'} kind={'minimal'} onClick={() => {
              this.showFeedbackModal(false)
            }}>
              Cancel
            </ModalButton>
            <ModalButton disabled={this.state.sendingFeedback}
            size={'compact'} onClick={() => {
              this.handleFeedback();
            }}>
              {this.state.sendingFeedback ? (
                <div className="loading-spinner"></div>
              ) : (
                <span>Submit</span>
              )}
            </ModalButton>
          </ModalFooter>
        </Modal>



        <StatefulPopover placement={PLACEMENT.topRight}
        overrides={{
          Body: {
            style: {
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
          <div className="HelpMenuContent">
            <ul className="list-none">
              <li className="cta">
                <button onClick={ () => { window.Intercom('show'); close(); } }>
                  Live chat with our team 
                  <span aria-label="Speech bubble emoji" className="ml-1" role="img">💬</span>
                </button>
              </li>
              <li className="divider relative"></li>
              <li>
                <NavLink to="/how-it-works">How it works</NavLink>
              </li>
              <li>
                <NavLink to="/guidelines#health-and-safety">
                  Health and safety guidelines
                </NavLink>
              </li>
              <li>
                <NavLink to="/guidelines#community">
                  Community guidelines
                </NavLink>
              </li>
              <li className="divider relative"></li>
              <li>
                <a href="tel:415-964-4261">
                  Call/Text us: 415-964-4261
                </a>
              </li>
              <li>
                <button onClick={() => this.showFeedbackModal(true)}>Give feedback</button>
              </li>
              <li className="divider relative"></li>
              <li className="text-sm px-4 pb-1 pt-2">
                <NavLink to="/about">
                  About us
                </NavLink>
              </li>
              <li className="text-sm px-4 pt-1 pb-2">
                <NavLink to="/about#privacy-policy">
                  Privacy
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        >
          <button className="text-xs flex items-center justify-center h-8 w-8">
            <svg 
              width="12" 
              height="18" 
              viewBox="0 0 12 18" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1.5 4.68744C1.5 4.68744 1.5675 3.14056 3.07219 1.90025C3.96562 1.16385 5.03859 0.950565 6 0.93744C6.87797 0.926658 7.66266 1.07525 8.13188 1.304C8.93391 1.69681 10.5 2.65306 10.5 4.68744C10.5 6.82822 9.13219 7.79853 7.57734 8.86775C6.0225 9.93697 5.625 10.9856 5.625 12.1874" stroke="#232735" strokeWidth="1.875" strokeMiterlimit="10" strokeLinecap="round"/>
              <path d="M5.625 17.2495C6.45343 17.2495 7.125 16.5779 7.125 15.7495C7.125 14.9211 6.45343 14.2495 5.625 14.2495C4.79657 14.2495 4.125 14.9211 4.125 15.7495C4.125 16.5779 4.79657 17.2495 5.625 17.2495Z" fill="#232735"/>
            </svg>

          </button>
        </StatefulPopover>
      </div>
    );
  }
}

export default HelpMenu;
