import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PlacesAutocomplete from 'react-places-autocomplete';
import moment from 'moment';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Navigation from './Navigation';
import { Card } from 'baseui/card';
import { Tag } from 'baseui/tag';
import Sidebar from './Sidebar';
import { hotjar } from 'react-hotjar';

import { connect } from 'react-redux';
import { getCurrentUser, loadUser, selectMenu } from '../store/actions/auth/auth-actions';
import {
  submitDraft,
  saveDraft,
  publishPost,
  handleSeenSubmit,
  uploadPhoto
} from '../store/actions/user/user-actions';
import StickyFooter from './StickyFooter/StickyFooter';

export const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

function Submit(props) {
  const {
    user,
    selectMenu,
    titleStore,
    selectMenuDispatch,
    submitPostSuccess,
    submittedDraft,
    submittedPost,
    submitDraftDispatch,
    publishPostDispatch,
    handleSeenSubmitDispatch,
    getCurrentUserDispatch
  } = props;

  const [title, setTitle] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [contactMethod, setContactMethod] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState({});
  const [postal, setPostal] = useState('');
  const [cart, setCart] = React.useState([]);
  const [selectedRequest, setRequest] = React.useState('food');
  const [checkout, setCheckout] = React.useState(false);
  let [changedCart, setChangedCart] = useState(0);
  const [cartQuantity, setCartQuantity] = React.useState('');
  const [cartName, setCartName] = React.useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  // initialize state
  React.useEffect(() => {
    setTitle(titleStore);
    if (selectMenu !== '') {
      setCheckout(true);

      if (selectMenu === 'Food') {
        setRequest('food');
      } else if (selectMenu === 'Supplies') {
        setRequest('supplies');
      }
    }
  }, [titleStore, selectMenu]);

  React.useEffect(() => {
    console.log('new update');
    async function updateUser() {
      await getCurrentUserDispatch({ env: process.env.NODE_ENV });
    }

    updateUser();
  }, [props.submitDraftSuccess, props.markSeenSubmitTutorial, getCurrentUserDispatch]);

  /* eslint-disable */
  React.useEffect(() => {
    async function submitDraft() {
      let foodString = {
        address,
        type: selectedRequest,
        description,
        cart,
        contactMethod,
        email,
        name,
        dueDate,
        location: latLng,
        postal,
        phoneNumber
      };

      await publishPostDispatch({
        env: process.env.NODE_ENV,
        postId: submittedDraft._id,
        title,
        text: JSON.stringify(foodString),
        categories: [selectedRequest].join(',')
      });
    }

    submitDraft();
  }, [props.submitDraftSuccess, publishPostDispatch, submittedDraft._id]);

  useEffect(() => {}, [changedCart]);

  React.useEffect(() => {
    hotjar.initialize('1751072', 6);
  }, []);

  const isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  const transportationJSX = (
    <div>
      <div>Pickup</div>
      <div>Dropoff</div>
      <div>Date</div>
    </div>
  );

  const validCart = cartName && cartQuantity && Number(cartQuantity) > 0;

  const cartJSX = () => {
    return cart.length === 0 ? (
      <div className="text-center">Start adding items below</div>
    ) : (
      <table className="table-auto" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th className="px-4 py-2">Item Description</th>
            <th className="px-4 py-2">Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, i) => (
            <tr className={i % 2 === 0 && `bg-gray-100`}>
              <td className={`border px-4 py-2`}>{item.name}</td>
              <td className={`border px-4 py-2`}>{item.quantity}</td>
              <td className={`border px-4 py-2`} style={{ width: 50, cursor: 'pointer' }}>
                {' '}
                <img
                  onClick={() => {
                    let cartNow = cart;
                    cartNow.splice(i, 1);
                    setCart(cartNow);
                    setChangedCart((changedCart += 1)); // to update state every time
                  }}
                  style={{ objectFit: 'cover', maxHeight: 15, overflow: 'auto' }}
                  src="https://d1ppmvgsdgdlyy.cloudfront.net/trash.svg"
                  alt="delete"
                ></img>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const validNumber = phoneNumber === '' || phoneNumber.length >= 10;
  const validEmail = email === '' || validateEmail(email);
  const validAddress = address === '' || !isEmpty(latLng);
  const validContactMethod =
    (contactMethod === 'phone' && phoneNumber.length >= 10) ||
    (contactMethod === 'email' && validateEmail(email)) ||
    contactMethod === 'comments';
  const allowSubmit =
    cart.length > 0 &&
    name !== '' &&
    !isEmpty(latLng) &&
    contactMethod !== '' &&
    validContactMethod;

  const formJSX = () => {
    return (
      <div>
        <div style={{ width: '100%' }}></div>
        <div className="mt-4 flex justify-content">
          <div style={{ width: '100%' }}>
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-last-name"
            >
              Name
            </label>
            <input
              onChange={e => {
                setName(e.target.value);
              }}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="summary"
              value={name}
              type="text"
              placeholder="Who will be receiving the order?"
            />
          </div>
          <div className="ml-3" style={{ width: '100%' }}>
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-state"
            >
              Type of Request
            </label>
            <div class="relative">
              <select
                value={selectedRequest}
                class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
                onChange={e => {
                  setRequest(e.target.value.toLowerCase());
                }}
              >
                <option value="food">Food</option>
                <option value="supplies">Supplies</option>
                <option value="miscellaneous">Miscellaneous</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <label
          class="block uppercase mt-4 tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-last-name"
        >
          Request Summary
        </label>
        <input
          style={{ paddingBottom: 50 }}
          onChange={e => {
            setTitle(e.target.value);
          }}
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="summary"
          value={title}
          type="text"
          placeholder="Briefly explain your request, e.g. Sick and need help grocery shopping"
        />
        <div className="flex items-center mt-4">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mr-2"
            for="grid-last-name"
          >
            Needed By:
          </label>
          <input
            style={{ width: 300, height: 32 }}
            onChange={e => {
              setDueDate(e.target.value); // YYYY-MM-DD
            }}
            className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="datetime-local"
            value={`${moment(new Date()).format('YYYY-MM-DD')}T${moment(new Date()).format(
              'HH:mm'
            )}`}
          />
        </div>

        <div className="mt-10 mb-4">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-last-name"
          >
            Preferred Contact Method
          </label>
          <label className="text-xs block tracking-wide ml-6 text-gray-700 font-bold">
            <div className="flex items-center">
              <input
                checked={contactMethod === 'phone'}
                className="mr-2 leading-tight"
                onChange={() => setContactMethod('phone')}
                type="radio"
              ></input>
              <span className="mr-2">phone (recommended)</span>
              <div className={contactMethod === 'phone' ? '' : `hidden`}>
                <input
                  style={{ width: 200, height: 32 }}
                  onChange={e => {
                    var phoneValue = e.target.value;
                    var output;
                    phoneValue = phoneValue.replace(/[^0-9]/g, '');
                    var area = phoneValue.substr(0, 3);
                    var pre = phoneValue.substr(3, 3);
                    var tel = phoneValue.substr(6, 4);

                    if (area.length < 3) {
                      output = area;
                    } else if (area.length === 3 && pre.length < 3) {
                      output = `${area}${pre}`;
                    } else if (area.length === 3 && pre.length === 3) {
                      output = `${''}${area}${''}${pre}${tel}`;
                    }
                    setPhoneNumber(output);
                  }}
                  className={`${!validNumber &&
                    'border-red-500'} appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="title"
                  value={phoneNumber}
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  type="tel"
                  placeholder="Phone Number"
                />
                {!validNumber && (
                  <p class="text-red-500 text-xs italic">Please enter a valid number.</p>
                )}
              </div>
            </div>
          </label>
          <label className="text-xs block tracking-wide ml-6 text-gray-700 font-bold">
            <div className="flex items-center">
              <input
                checked={contactMethod === 'email'}
                onChange={() => setContactMethod('email')}
                className="mr-2 leading-tight"
                type="radio"
              ></input>
              <span className="mr-2">email</span>
              <div className={contactMethod === 'email' ? '' : `hidden`}>
                <input
                  style={{ width: 200, height: 32 }}
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                  className={`${!validEmail &&
                    'border-red-500'} appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="email"
                  value={email}
                  placeholder="Email"
                />
                {!validEmail && (
                  <p class="text-red-500 text-xs italic">Please enter a valid email.</p>
                )}
              </div>
            </div>
          </label>
          <label className="text-xs block tracking-wide ml-6 text-gray-700 font-bold">
            <input
              checked={contactMethod === 'comments'}
              onChange={() => setContactMethod('comments')}
              className="mr-2 leading-tight"
              type="radio"
            ></input>
            <span className="">in app comments</span>
          </label>
        </div>
        <input
          onChange={e => {
            setDescription(e.target.value);
          }}
          className="appearance-none mt-4 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="description"
          value={description}
          type="text"
          placeholder="Add any special instructions regarding your circumstances, needs, and/or delivery preferences here."
        />

        <label
          class="block mt-4 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-last-name"
        >
          Delivery Address
        </label>
        <PlacesAutocomplete
          value={address}
          onChange={address => setAddress(address)}
          onSelect={address => {
            setAddress(address);
            let postal = '';
            geocodeByAddress(address)
              .then(results => {
                for (var i = 0; i < results[0].address_components.length; i++) {
                  let x = results[0].address_components[i];
                  if (x.types[0] === 'postal_code') {
                    postal += x.long_name;
                  } else if (x.types[0] === 'postal_code_suffix') {
                    postal += `-${x.long_name}`;
                  }
                }
                setPostal(postal);
              })
              .catch(error => console.error('Error 1', error));

            geocodeByAddress(address)
              .then(results => getLatLng(results[0]))
              .then(latLng => {
                console.log('Success', latLng);
                setLatLng(latLng);
              })
              .catch(error => console.error('Error 2', error));
          }}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Where would you like your items to be delivered?',
                  className: 'location-search-input'
                })}
                value={address}
                className={`${!validAddress &&
                  'border-red-500'} appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                id="address"
                type="text"
              />
              {!validAddress && (
                <p class="text-red-500 text-xs italic">Please enter a valid address.</p>
              )}
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <div className="mt-4"></div>
        {cartJSX()}
        <div className={`flex items-center mt-4`}>
          <input
            onChange={e => {
              setCartName(e.target.value);
            }}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="food"
            value={cartName}
            type="text"
            placeholder={
              selectedRequest === 'food'
                ? `Item name, brand, and store location`
                : selectedRequest === 'supplies'
                ? 'Item name, brand, and store location'
                : ''
            }
          />
          <input
            onChange={e => {
              setCartQuantity(e.target.value);
            }}
            className="mx-4 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            style={{ width: 100 }}
            value={cartQuantity}
            id={
              selectedRequest === 'food' ? `food` : selectedRequest === 'supplies' ? 'supplies' : ''
            }
            type="number"
            placeholder="Quantity"
            min="1"
          />
          <button
            className={`${
              validCart ? 'bg-indigo-500 hover:bg-indigo-700' : 'bg-gray-500'
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type="button"
            style={{ outline: 'none', cursor: validCart ? 'pointer' : 'not-allowed' }}
            onClick={() => {
              if (validCart) {
                let cartNew = cart;
                cartNew.push({ name: cartName, quantity: cartQuantity });
                setCart(cartNew);
                setCartQuantity('');
                setCartName('');
              }
            }}
          >
            Add
          </button>
        </div>
        <div className="flex justify-between items-center mt-6">
          <span />
          <div>
            {selectedRequest !== '' && (
              <button
                onClick={() => {
                  if (
                    title &&
                    latLng.lat &&
                    latLng.lng &&
                    address &&
                    description &&
                    dueDate &&
                    cart.length > 0
                  ) {
                    let foodString = {
                      address,
                      type: selectedRequest,
                      description,
                      cart,
                      contactMethod,
                      email,
                      name,
                      postal,
                      dueDate,
                      location: latLng,
                      phoneNumber
                    };

                    if (isEmpty(submittedDraft)) {
                      submitDraftDispatch({
                        env: process.env.NODE_ENV,
                        title,
                        text: JSON.stringify(foodString),
                        categories: [selectedRequest].join(',')
                      });
                    } else {
                      alert('draft already submitted');
                    }
                  } else {
                    alert('please fill out all fields');
                  }
                }}
                disabled={!allowSubmit}
                style={{ outline: 'none', cursor: allowSubmit ? 'pointer' : 'not-allowed' }}
                className={`${
                  !allowSubmit ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-700'
                } text-white font-bold py-2 px-4 rounded`}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <StickyFooter>
      <Navigation selectMenuDispatch={selectMenuDispatch} searchBarPosition="center" />
      <div className="max-w-screen-lg w-full mx-auto xl:flex xl:max-w-6xl py-12 px-6">
        <aside className>
          <Sidebar {...props} />
        </aside>
        <section>
          {!isEmpty(user) && !user.seenSubmitTutorial && (
            <Card
              overrides={{
                Root: {
                  style: {
                    margin: '0 auto',
                    marginBottom: '30px'
                  }
                }
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <Tag
                    overrides={{ Root: { style: { marginLeft: 0 } } }}
                    closeable={false}
                    variant={'variant'}
                    kind="accent"
                  >
                    How It Works
                  </Tag>
                </div>
                <div
                  onClick={() =>
                    handleSeenSubmitDispatch({ env: process.env.NODE_ENV, type: 'submit' })
                  }
                  style={{ cursor: 'pointer', color: 'black' }}
                >
                  <img
                    src="https://d1ppmvgsdgdlyy.cloudfront.net/close.svg"
                    alt="close"
                    style={{ height: 10 }}
                  />
                </div>
              </div>
              <div style={{ marginTop: 15 }}>
                Welcome to The Giving Tree!
                <br />
                <br />
                To receive help, either make a request or call/text us at{' '}
                <a className="text-indigo-600 hover:text-indigo-800" href="tel:+1415-964-4261">
                  415-964-4261
                </a>{' '}
                to have us make one on your behalf. <br />
                <br />
                Here to help? Explore the feed to find new, unclaimed requests near you.
              </div>
            </Card>
          )}
          {submitPostSuccess ? (
            <Card
              overrides={{
                Root: {
                  style: {
                    margin: '0 auto',
                    marginBottom: '30px',
                    color: 'green'
                  }
                }
              }}
            >
              Your post is now live!{' '}
              <span role="img" aria-label="Smiley emoji with party hat">
                🥳
              </span>
              Check it out{' '}
              <a
                className="text-indigo-600 hover:text-indigo-800 transition duration-150"
                style={{ textDecoration: 'none' }}
                href={`/post/${submittedPost._id}`}
              >
                here
              </a>
              .
            </Card>
          ) : (
            <Card
              overrides={{
                Root: {
                  style: {
                    margin: '0 auto'
                  }
                }
              }}
            >
              <div className="flex justify-between items-center my-4 mb-6" style={{ height: 36 }}>
                {!checkout ? (
                  <React.Fragment>
                    <label
                      class="block mt-4 uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                      for="grid-last-name"
                    >
                      I want to:
                    </label>
                  </React.Fragment>
                ) : (
                  <div className="flex justify-center" style={{ width: '100%' }}>
                    <label
                      class="block mt-4 uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                      for="grid-last-name"
                    >
                      Create Request
                    </label>
                  </div>
                )}
              </div>
              {!checkout && (
                <div className="grid grid-cols-2 gap-8">
                  <div
                    onClick={() => {
                      alert('please call or text +1 415-964-4261');
                    }}
                    className={`max-w-sm flex items-center justify-center rounded overflow-hidden shadow-lg border hover:border-indigo-600 rounded-lg hover:text-green-600 transition duration-150`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="px-6 py-8">
                      <div className={`font-bold text-xl`}>Call or Text</div>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setCheckout(true);
                    }}
                    className={`max-w-sm rounded  hover:border-indigo-600 overflow-hidden shadow-lg border ${selectedRequest ===
                      'supplies' && 'border-indigo-600'} rounded-lg transition duration-150`}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      style={{
                        objectFit: 'cover',
                        maxHeight: 150,
                        width: 400,
                        overflow: 'auto'
                      }}
                      src="https://d1ppmvgsdgdlyy.cloudfront.net/groceries.jpg"
                      alt="Supplies"
                    ></img>
                    <div className="px-6 py-8">
                      <div
                        className={`font-bold text-xl text-center ${selectedRequest ===
                          'supplies' && 'text-green-600'}`}
                      >
                        Submit Request Online
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {checkout && <React.Fragment>{formJSX()}</React.Fragment>}
            </Card>
          )}
        </section>
      </div>
    </StickyFooter>
  );
}

const mapDispatchToProps = dispatch => ({
  getCurrentUserDispatch: payload => dispatch(getCurrentUser(payload)),
  loadUserDispatch: payload => dispatch(loadUser(payload)),
  submitDraftDispatch: payload => dispatch(submitDraft(payload)),
  saveDraftDispatch: payload => dispatch(saveDraft(payload)),
  publishPostDispatch: payload => dispatch(publishPost(payload)),
  handleSeenSubmitDispatch: payload => dispatch(handleSeenSubmit(payload)),
  uploadPhotoDispatch: payload => dispatch(uploadPhoto(payload)),
  selectMenuDispatch: payload => dispatch(selectMenu(payload))
});

const mapStateToProps = state => ({
  user: state.auth.user,
  foundUser: state.auth.foundUser,
  errorMessage: state.auth.errorMessage,
  selectMenu: state.auth.selectMenu,
  titleStore: state.auth.title,
  submitDraftLoading: state.user.submitDraftLoading,
  submitDraftSuccess: state.user.submitDraftSuccess,
  submitPostSuccess: state.user.submitPostSuccess,
  submittedDraft: state.user.submittedDraft,
  submittedPost: state.user.submittedPost,
  saveDraftLoading: state.user.saveDraftLoading,
  saveDraftSuccess: state.user.saveDraftSuccess,
  saveDraftFailure: state.user.saveDraftFailure,
  getDraftFailure: state.user.getDraftFailure,
  getDraftSuccess: state.user.getDraftSuccess,
  uploadPhotoUrl: state.user.uploadPhotoUrl,
  uploadPhotoSuccess: state.user.uploadPhotoSuccess,

  markSeenSubmitTutorial: state.user.markSeenSubmitTutorial
});

Submit.defaultProps = {};

Submit.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(Submit);
