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

  /**
   * Update a key in the state object
   *
   * @param {*} key The key in the state object
   * @param {*} val The new value
   * @memberof HelpMenu
   */
  setStateVal(key, val) {
    this.setState({ [key]: val})
  }

  /**
   * Send feedback
   *
   * @memberof HelpMenu
   */
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
      <div className="HelpMenu">
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
                <button onClick={() => this.showFeedbackModal(true)}>
                  Give feedback
                </button>
              </li>
              <li className="divider relative"></li>
              <li className="">
                <NavLink to="/about">
                  About us
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/about#privacy-policy">
                  Privacy
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        >
          <button 
            className="text-2xl flex items-center justify-center h-12 w-12
            bg-gray-900 text-white rounded-full shadow-lg"
          >
            ?
          </button>
        </StatefulPopover>
      </div>
    );
  }
}

export default HelpMenu;
