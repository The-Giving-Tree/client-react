import * as React from 'react';
// Custom Components
import Navigation from '../../components/Navigation';
import Sidebar from '../../components/Sidebar/Sidebar';
import NewsfeedTable from '../NewsFeed/NewsfeedTable';
import LeaderboardTable from '../../components/LeaderboardTable/LeaderboardTable';
import StickyFooter from '../../components/StickyFooter/StickyFooter'
// Libraries
import queryString from 'query-string';
import { getDistance } from 'geolib';
import { hotjar } from 'react-hotjar';
import { connect } from 'react-redux';
import { geolocated } from 'react-geolocated';
import Expand from 'react-expand-animated';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// Base UI
import { Card } from 'baseui/card';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';
import { Tag, KIND } from 'baseui/tag';
import { Input, SIZE } from 'baseui/input';
import { Button } from 'baseui/button';
import { ChevronUp, ChevronDown } from 'baseui/icon';
import { StatefulMenu } from 'baseui/menu';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal';

import {
  getCurrentUser,
  loadNewsfeed,
  claimTask,
  unclaimTask,
  completeTask,
  upvote,
  downvote,
  addComment,
  register,
  addReply,
  selectMenu,
  initiateReset,
  login
} from '../../store/actions/auth/auth-actions';

function NewsFeedPageOLD(props) {
  const {
    user,
    loadNewsfeedDispatch,
    claimTaskDispatch,
    unclaimTaskDispatch,
    newsfeed,
    upvoteDispatch,
    downvoteDispatch,
    currentPage,
    pages,
    coords,
    selectMenu,
    addCommentDispatch,
    addReplyDispatch,
    selectMenuDispatch,
    completeTaskDispatch,
    userRanking
  } = props;

  const history = useHistory();
  const { width, height } = useWindowSize();
  const [latLng, setLatLng] = React.useState({});
  const [address, setAddress] = React.useState('');
  const [updatedNews, setUpdateNews] = React.useState(false);
  const [openCustomAddress, setOpenCustomAddress] = React.useState(false);
  const [hasMoreItems, setHasMoreItems] = React.useState(true);
  const [newPost, setNewPost] = React.useState('');
  const [newsfeedSort, setSort] = React.useState('');
  const [newsfeedDictionary] = React.useState({});
  const authenticated = localStorage.getItem('giving_tree_jwt');
  const [news] = React.useState([]);
  const [eta, setETA] = React.useState('');
  const [missing, setOrderMissing] = React.useState('');
  const [deliverer, setOrderDeliverer] = React.useState('');

  const [upvoteIndex] = React.useState([]);
  const [downvoteIndex] = React.useState([]);
  const [initialDownvotes] = React.useState([]);
  const [initialUpvotes] = React.useState([]);
  const [upvoteHover, setUpvoteHover] = React.useState([]);
  const [downvoteHover, setDownvoteHover] = React.useState([]);
  const [confetti, showConfetti] = React.useState(false);
  const [postId, setPostId] = React.useState('');
  const [openFoodTracking, setOpenFoodTracking] = React.useState(false);

  // array to keep track of which items a user has claimed - to remove from newsfeed
  const [helpArrayDiscover, setHelpArrayDiscover] = React.useState({});
  // array to keep track of which items a user has claimed - to remove from newsfeed
  const [helpArrayOngoing, setHelpArrayOngoing] = React.useState({});

  const items = [];
  const parsed = queryString.parse(props.location.search);

  // id dictates the type of feed
  let id = props.match.params ? props.match.params[0].toLowerCase() : '';

  if (true) {
    switch (id) {
      case '':
        if (newsfeedSort !== 'Home') {
          setSort('Home');
        }
        break;
      case 'discover':
        if (newsfeedSort !== 'Discover') {
          setSort('Discover');
          console.log('loading discover');
          loadNewsfeedDispatch({
            env: process.env.REACT_APP_NODE_ENV,
            page: Number(currentPage),
            location: latLng,
            feed: 'Discover'
          });
        }
        break;
      case 'ongoing':
        if (newsfeedSort !== 'Ongoing') {
          setSort('Ongoing');
          loadNewsfeedDispatch({
            env: process.env.REACT_APP_NODE_ENV,
            page: Number(currentPage),
            location: latLng,
            feed: 'Ongoing'
          });
        }
        break;
      case 'completed':
        if (newsfeedSort !== 'Completed') {
          setSort('Completed');
          loadNewsfeedDispatch({
            env: process.env.REACT_APP_NODE_ENV,
            page: Number(currentPage),
            location: latLng,
            feed: 'Completed'
          });
        }
        break;
      case 'global':
        if (newsfeedSort !== 'Global') {
          setSort('Global');
          loadNewsfeedDispatch({
            env: process.env.REACT_APP_NODE_ENV,
            page: Number(currentPage),
            feed: 'Global'
          });
        }
        break;
      case 'popular':
        if (newsfeedSort !== 'Popular') {
          setSort('Popular');
          loadNewsfeedDispatch({
            env: process.env.REACT_APP_NODE_ENV,
            page: Number(currentPage),
            feed: 'Popular'
          });
        }
        break;
      case 'newest':
        if (newsfeedSort !== 'Newest') {
          setSort('Newest');
          loadNewsfeedDispatch({
            env: process.env.REACT_APP_NODE_ENV,
            page: Number(currentPage),
            location: latLng,
            feed: 'Newest'
          });
        }
        break;
      default:
        break;
    }
  }

  // remove items
  const resetItems = () => {
    window.location = `/home/discover?lat=${latLng.lat}&lng=${latLng.lng}`; // explicit lat and lng coordinates
  };

  function openCard(i) {
    return props.match.url === '/home/discover'
      ? !helpArrayDiscover[i]
      : props.match.url === '/home/ongoing'
      ? !helpArrayOngoing[i]
      : true;
  }

  function removeIndex(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }

  const removeOngoing = id => {
    setHelpArrayOngoing(prevOngoing => ({
      ...prevOngoing,
      [id]: !prevOngoing[id]
    }));
  };

  function calculateDistance(requestLocation) {
    if (requestLocation.lat && requestLocation.lng && coords) {
      var request = {
        latitude: requestLocation.lat,
        longitude: requestLocation.lng
      };

      var user = {
        latitude: coords.latitude,
        longitude: coords.longitude
      };

      let distance = getDistance(request, user); // meters
      let km = distance / 1000;
      let mi = km * 0.621371;

      return mi.toFixed(2);
    } else {
      return '-';
    }
  }

  const foodCartJSX = cart => {
    return cart.length === 0 ? (
      <div className="text-center">no items in cart</div>
    ) : (
      <table className="table-auto" style={{ width: '99%' }}>
        <thead>
          <tr>
            <th className="px-4 py-2">Item Description</th>
            <th className="px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, i) => (
            <tr key={i} className={(i % 2 === 0) ? `bg-gray-100` : ''}>
              <td className={`px-4 py-2`}>{item.name}</td>
              <td className={`px-4 py-2`}>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // completed order details
  const completedOrderJSX = trackingDetails => {
    return trackingDetails.length === 0 ? (
      <div className="text-center">no tracking details added yet</div>
    ) : (
      <React.Fragment>
        <div
          className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 mt-8"
          role="alert"
        >
          <div
            style={{
              textTransform: 'capitalize',
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 10,
              textDecoration: 'underline'
            }}
          >
            Order Details:
          </div>
          <p style={{ textTransform: 'capitalize' }}>order created: {trackingDetails.created}</p>
          <p style={{ textTransform: 'capitalize' }}>dropoff ETA: {trackingDetails.dropoffEta}</p>
          <p style={{ textTransform: 'capitalize' }}>method: {trackingDetails.method}</p>
          <p style={{ textTransform: 'capitalize' }}>notes: {trackingDetails.notes}</p>
        </div>
      </React.Fragment>
    );
  };

  const completedOrderGlobalJSX = item => {
    return item.length === 0 || !item.assignedUser ? (
      <div className="text-center">no completed details available yet</div>
    ) : (
      <React.Fragment>
        <div
          className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 mt-8"
          role="alert"
        >
          {item.trackingDetails && (
            <React.Fragment>
              <div
                style={{
                  textTransform: 'capitalize',
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 10,
                  textDecoration: 'underline'
                }}
              >
                Order Details:
              </div>
              <p style={{ textTransform: 'capitalize' }}>
                order created: {moment(item.trackingDetails.created).format('MMM D, YYYY h:mm A')}
              </p>
              <p style={{ textTransform: 'capitalize' }}>
                dropoff ETA: {item.trackingDetails.dropoffEta}
              </p>
              <p style={{ textTransform: 'capitalize' }}>method: {item.trackingDetails.method}</p>
              <p style={{ textTransform: 'capitalize' }}>notes: {item.trackingDetails.notes}</p>
            </React.Fragment>
          )}

          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginTop: item.trackingDetails ? 15 : 0,
              textDecoration: 'underline'
            }}
          >
            Fulfilled By:
          </div>
          <p
            style={{ textTransform: 'lowercase', cursor: 'pointer' }}
            className="flex items-center"
          >
            <span
              onClick={() => history.push(`/user/${item.assignedUser.username}`)}
              className="hover:text-indigo-800"
            >
              {item.assignedUser.username}
            </span>
            {Number(item.assignedUser.karma) >= 0 && (
              <span>&nbsp;&bull; {item.assignedUser.karma} karma</span>
            )}
          </p>
          <p style={{ textTransform: 'lowercase' }}>
            email: <a href={`mailto:${item.assignedUser.email}`}>{item.assignedUser.email}</a>
          </p>
        </div>
      </React.Fragment>
    );
  };

  const shorten = (length, text) => {
    if (text) {
      if (text.length <= length) {
        return text;
      } else {
        return text.slice(0, length) + '...';
      }
    }
    return text;
  };

  function mouseOutUp(i) {
    setUpvoteHover(upvoteHover.filter(item => item !== i));
  }

  function mouseOverUp(i) {
    setUpvoteHover(upvoteHover.concat(i));
  }

  function mouseOutDown(i) {
    setDownvoteHover(downvoteHover.filter(item => item !== i));
  }

  function mouseOverDown(i) {
    setDownvoteHover(downvoteHover.concat(i));
  }

  async function handleUpClick(type, _id, postId = '') {
    switch (type) {
      case 'Post':
        await upvoteDispatch({
          env: process.env.REACT_APP_NODE_ENV,
          postId: _id
        });
        break;
      case 'Comment':
        await upvoteDispatch({
          env: process.env.REACT_APP_NODE_ENV,
          postId,
          commentId: _id
        });
        break;
      default:
        break;
    }
  }

  async function handleDownClick(type, _id, postId = '') {
    switch (type) {
      case 'Post':
        await downvoteDispatch({
          env: process.env.REACT_APP_NODE_ENV,
          postId: _id
        });
        break;
      case 'Comment':
        await downvoteDispatch({
          env: process.env.REACT_APP_NODE_ENV,
          postId,
          commentId: _id
        });
        break;
      default:
        break;
    }
  }

  async function loadNewsfeedHelper() {
    if (pages === '') {
    } else if (Number(currentPage) < Number(pages)) {
      let nextPage = Number(currentPage) + 1;
      await loadNewsfeedDispatch({
        env: process.env.REACT_APP_NODE_ENV,
        location: latLng,
        page: nextPage,
        feed: newsfeedSort
      });
      for (var j = 0; j < newsfeed.length; j++) {
        if (newsfeedDictionary[newsfeed[j]._id] === undefined) {
          news.push(newsfeed[j]);
          newsfeedDictionary[newsfeed[j]._id] = true;
        }
      }
    } else {
      setHasMoreItems(false);
      if (newsfeed) {
        for (var k = 0; k < newsfeed.length; k++) {
          if (newsfeedDictionary[newsfeed[k]._id] === undefined) {
            news.push(newsfeed[k]);
            newsfeedDictionary[newsfeed[k]._id] = true;
          }
        }
      }
    }
  }

  const removeDiscover = id => {
    setHelpArrayDiscover(prevDiscover => {
      return {
      ...prevDiscover,
      [id]: !prevDiscover[id]
      }
    });
  };

  /**
   * TODO: Add description of what this function does.
   * @param {*} username
   * @param {*} version
   */
  function generateHash(username = '', version = 0) {
    const secret = 'givingtree';
    const hash = require('crypto')
      .createHmac('sha256', secret)
      .update(username.toLowerCase())
      .digest('hex');

    const suffix = Number(version) === 0 || !version ? '' : `%3Fver%3D${version}`;
    const url = `https://d1ppmvgsdgdlyy.cloudfront.net/user/${hash}${suffix}`;
    return url;
  }

  /**
   * TODO: Add description of what this function does
   * @param {*} str
   * @param {*} s
   * @param {*} l
   */
  function stringToHslColor(str, s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  React.useEffect(() => {
    loadNewsfeedHelper();
    setUpdateNews(false);
  }, [updatedNews]);

  React.useEffect(() => {
    setLatLng(parsed); // initialize
    hotjar.initialize('1751072', 6);

    if (parsed.lat === '37.7749295' && parsed.lng === '-122.4194155') {
      setAddress('San Francisco, CA');
    } else if (parsed.lat === '34.0522342' && parsed.lng === '-118.2436849') {
      setAddress('Los Angeles, CA');
    } else if (parsed.lat === '43.653226' && parsed.lng === '-79.3831843') {
      setAddress('Toronto, ON, Canada');
    } else if (parsed.lat === '49.2827291' && parsed.lng === '-123.1207375') {
      setAddress('Vancouver, BC, Canada');
    } else if (parsed.lat === '40.7127753' && parsed.lng === '-74.0059728') {
      setAddress('New York City, NY');
    } else if (!parsed.lat && !parsed.lng) {
      setAddress('Earth');
    }

    selectMenuDispatch({ selectMenu: 'Food' });
  }, []);

  React.useEffect(() => {
    if (props.match.url === '/home/discover') {
      loadNewsfeedDispatch({
        env: process.env.REACT_APP_NODE_ENV,
        page: Number(currentPage),
        location: latLng,
        feed: 'Discover'
      });
    }
  }, [latLng, address, !openCustomAddress]);

  const render = () => {
    news.map((item, i) => {
      if (
        item.downVotes.includes(user._id) &&
        !downvoteIndex.includes(i) &&
        !initialDownvotes.includes(i)
      ) {
        initialDownvotes.push(i);
        downvoteIndex.push(i);
      }
      if (
        item.upVotes.includes(user._id) &&
        !upvoteIndex.includes(i) &&
        !initialUpvotes.includes(i)
      ) {
        initialUpvotes.push(i);
        upvoteIndex.push(i);
      }
      items.push(
        <div className="shadow item" key={i}>
          <Expand key={i} open={openCard(item._id)}>
            <Card
              overrides={{
                Root: {
                  style: {
                    width: '100%',
                    margin: `${
                      props.match.url === '/home/discover' ? '10px' : '0px'
                    } auto 0px auto`,
                    maxHeight: '800px',
                    overflow: 'hidden',
                    boxShadow: 'none'
                  }
                },
                Body: {
                  style: {}
                }
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignContent: 'center',
                      paddingBottom: 15
                    }}
                  >
                    <div
                      style={{
                        textTransform: 'lowercase',
                        fontSize: 12,
                        marginLeft: 5,
                        display: 'flex',
                        alignContent: 'center'
                      }}
                    >
                      <div
                        className={`flex items-center justify-center`}
                        onClick={() => history.push(`/user/${item.username}`)}
                        style={{
                          width: 32,
                          height: 32,
                          background: `url(${generateHash(
                            item.username,
                            item.authorId.profileVersion
                          )}), url(https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${item.username[0].toUpperCase()}.svg), ${stringToHslColor(
                            item.username,
                            80,
                            45
                          )}`,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                          borderRadius: '50%',
                          marginRight: 10,
                          cursor: 'pointer',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                      <div>
                        <strong>
                          <a
                            style={{ textDecoration: 'none', color: 'rgb(0, 121, 211)' }}
                            href={`/user/${item.username}`}
                          >
                            {item.username}
                          </a>
                        </strong>{' '}
                        · {moment(new Date(item.createdAt)).fromNow()}
                      </div>
                    </div>
                    <div
                      style={{
                        alignContent: 'flex-start'
                      }}
                    >
                      <div style={{ display: 'flex', alignContent: 'center' }}>
                        {item.type === 'Post' &&
                          item.categories.map(i => (
                            <Tag
                              key={i}
                              overrides={{
                                Root: {
                                  style: {
                                    marginRight: item.assignedUser ? '5px' : '15px',
                                    marginTop: '0px',
                                    marginBottom: '0px'
                                  }
                                }
                              }}
                              closeable={false}
                              color="#4327F1"
                              kind={KIND.custom}
                            >
                              {i}
                            </Tag>
                          ))}
                        {item.assignedUser && !item.completed && (
                          <Tag
                            overrides={{
                              Root: {
                                style: {
                                  marginRight: '15px',
                                  marginTop: '0px',
                                  marginBottom: '0px'
                                }
                              }
                            }}
                            closeable={false}
                            color="#FFA500"
                            kind={KIND.custom}
                          >
                            In Progress
                          </Tag>
                        )}
                        {item.assignedUser && item.completed && (
                          <Tag
                            overrides={{
                              Root: {
                                style: {
                                  marginRight: '15px',
                                  marginTop: '0px',
                                  marginBottom: '0px'
                                }
                              }
                            }}
                            closeable={false}
                            color="#4BCA81"
                            kind={KIND.custom}
                          >
                            Completed
                          </Tag>
                        )}
                        <img
                          onClick={() => history.push(`/post/${item._id}`)}
                          src="https://d1ppmvgsdgdlyy.cloudfront.net/more.svg"
                          alt="more"
                          style={{ width: 15, height: 25, cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      alignContent: 'center',
                      maxHeight: `calc(0.8 * 550px)`,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'table' }}>
                      <div style={{ textAlign: 'center' }}>
                        <ChevronUp
                          size={25}
                          color={
                            upvoteIndex.includes(i) || upvoteHover.includes(i) ? '#268bd2' : '#aaa'
                          }
                          style={{ alignContent: 'center', cursor: 'pointer' }}
                          onMouseEnter={() => mouseOverUp(i)}
                          onMouseLeave={() => mouseOutUp(i)}
                          onClick={async () => {
                            if (authenticated) {
                              await handleUpClick(
                                item.type,
                                item._id,
                                item.type === 'Comment' && item.postId
                              );

                              if (downvoteIndex.includes(i)) {
                                removeIndex(downvoteIndex, i);
                              }

                              if (upvoteIndex.includes(i)) {
                                removeIndex(upvoteIndex, i);
                              } else {
                                upvoteIndex.push(i);
                              }
                            } else {
                              alert('please signup first');
                              history.push('/signup');
                            }
                          }}
                        />
                        <div style={{ alignContent: 'center', marginBottom: 3 }}>
                          {item.voteTotal +
                            Number(
                              upvoteIndex.includes(i)
                                ? item.upVotes.includes(user._id)
                                  ? 0
                                  : 1
                                : item.upVotes.includes(user._id)
                                ? -1
                                : 0
                            ) -
                            Number(
                              downvoteIndex.includes(i)
                                ? item.downVotes.includes(user._id)
                                  ? 0
                                  : 1
                                : item.downVotes.includes(user._id)
                                ? -1
                                : 0
                            )}
                        </div>
                        <ChevronDown
                          color={
                            downvoteIndex.includes(i) || downvoteHover.includes(i)
                              ? '#268bd2'
                              : '#aaa'
                          }
                          size={25}
                          style={{ alignContent: 'center', cursor: 'pointer' }}
                          onMouseEnter={() => mouseOverDown(i)}
                          onMouseLeave={() => mouseOutDown(i)}
                          onClick={async () => {
                            if (authenticated) {
                              await handleDownClick(
                                item.type,
                                item._id,
                                item.type === 'Comment' && item.postId
                              );

                              if (upvoteIndex.includes(i)) {
                                removeIndex(upvoteIndex, i);
                              }

                              if (downvoteIndex.includes(i)) {
                                removeIndex(downvoteIndex, i);
                              } else {
                                downvoteIndex.push(i);
                              }
                            } else {
                              alert('please signup first');
                              history.push('/signup');
                            }
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'table-cell',
                          maxHeight: 'calc(0.7 * 300px)',
                          tableLayout: 'fixed',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                          width: '100%'
                        }}
                      >
                        <div
                          style={{
                            display: 'block',
                            alignContent: 'center',
                            marginBottom: 3,
                            marginLeft: 20
                          }}
                        >
                          <div
                            style={{
                              textTransform: 'capitalize',
                              fontSize: 20,
                              fontWeight: 600,
                              marginTop: 5
                            }}
                          >
                            {item.title}
                          </div>
                          <div style={{ marginTop: 5 }}>
                            {item.type === 'Post' ? (
                              <div style={{ marginTop: 20 }}>
                                <div>
                                  {props.match.url === '/home/ongoing' ? (
                                    <div className="text-sm my-1 mt-4">
                                      {item && `Address: ${JSON.parse(item.text).address}`}
                                    </div>
                                  ) : (
                                    <div className="text-sm my-1 mt-4">
                                      {coords
                                        ? `${calculateDistance(
                                            JSON.parse(item.text).location
                                          )} miles from
                                      you ${
                                        JSON.parse(item.text).postal
                                          ? `(${JSON.parse(item.text).postal.split('-')[0] ||
                                              JSON.parse(item.text).postal})`
                                          : ''
                                      }`
                                        : `Zip Code: ${
                                            JSON.parse(item.text).postal
                                              ? `${JSON.parse(item.text).postal.split('-')[0] ||
                                                  JSON.parse(item.text).postal}`
                                              : ''
                                          }`}
                                    </div>
                                  )}
                                  <div className="text-sm my-1 mt-4">
                                    {item &&
                                      JSON.parse(item.text).dueDate &&
                                      `Due Date: ${moment(
                                        new Date(JSON.parse(item.text).dueDate)
                                      ).fromNow()} (${JSON.parse(item.text).dueDate})`}
                                  </div>
                                  <div className="text-sm my-1 mt-4">
                                    {item && `Description: ${JSON.parse(item.text).description}`}
                                  </div>
                                  {item &&
                                    JSON.parse(item.text).phoneNumber &&
                                    (props.match.url === '/home/discover' ||
                                      props.match.url === '/home/ongoing') && (
                                      <div className="text-sm my-1 mt-4">
                                        Phone Number:{' '}
                                        {props.match.url === '/home/ongoing'
                                          ? JSON.parse(item.text).phoneNumber
                                          : `***-***-${JSON.parse(item.text).phoneNumber.substring(
                                              JSON.parse(item.text).phoneNumber.length - 4
                                            )}`}
                                      </div>
                                    )}
                                  <div className="mt-4"></div>
                                  {item.text &&
                                    props.match.url !== '/home/ongoing' &&
                                    JSON.parse(item.text).type === 'food' &&
                                    foodCartJSX(JSON.parse(item.text).cart)}
                                  {item.text &&
                                    props.match.url === '/home/completed' &&
                                    item.trackingDetails &&
                                    completedOrderJSX(item.trackingDetails)}
                                  {item.text &&
                                    props.match.url === '/home/global' &&
                                    completedOrderGlobalJSX(item)}
                                </div>
                              </div>
                            ) : (
                              item.content
                            )}
                          </div>
                          {item.type === 'Comment' && (
                            <div>
                              <Card
                                overrides={{
                                  Root: {
                                    style: {
                                      borderRadius: '10px',
                                      maxHeight: '300px',
                                      overflow: 'hidden'
                                    }
                                  }
                                }}
                                style={{ /*width: '100%',*/ marginTop: 15 }}
                              >
                                <div
                                  style={{
                                    marginTop: -10,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignContent: 'center'
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignContent: 'center',
                                      textTransform: 'lowercase',
                                      fontSize: 12
                                    }}
                                  >
                                    <div
                                      onClick={() => history.push(`/user/${item.parent.username}`)}
                                      style={{
                                        width: 32,
                                        height: 32,
                                        background: `url(${generateHash(
                                          item.parent.username
                                        )}), url(https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${item.parent.username[0].toUpperCase()}.svg), ${stringToHslColor(
                                          item.parent.username,
                                          80,
                                          45
                                        )}`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        borderRadius: '50%',
                                        marginRight: 10,
                                        cursor: 'pointer',
                                        backgroundRepeat: 'no-repeat'
                                      }}
                                    />
                                    <strong>
                                      <a
                                        style={{
                                          textDecoration: 'none',
                                          color: 'rgb(0, 121, 211)'
                                        }}
                                        href={`/user/${item.parent.username}`}
                                      >
                                        {item.parent && item.parent.username}
                                      </a>
                                    </strong>
                                    &nbsp;·&nbsp;
                                    {moment(item.parent && item.parent.createdAt).format(
                                      'MMM D, YYYY h:mm A'
                                    )}
                                    &nbsp;
                                    {item.parent && item.parent.type === 'Post' && (
                                      <React.Fragment>
                                        ·&nbsp;
                                        <a
                                          href={`/post/${item.parent && item.parent._id}`}
                                          style={{
                                            textDecoration: 'none',
                                            color: 'rgb(0, 121, 211)'
                                          }}
                                        >
                                          {shorten(60, (item.parent && item.parent.title) || '')}
                                        </a>
                                      </React.Fragment>
                                    )}
                                  </div>
                                  <div style={{ alignContent: 'flex-start' }}>
                                    <img
                                      onClick={() =>
                                        history.push(`/post/${item.parent && item.parent._id}`)
                                      }
                                      src="https://d1ppmvgsdgdlyy.cloudfront.net/more.svg"
                                      alt="more"
                                      style={{ width: 15, height: 'auto', cursor: 'pointer' }}
                                    />
                                  </div>
                                </div>
                                <br />
                                {/* String length <= 250 or add '...' */}
                                {item.parent && item.parent.type === 'Post'
                                  ? item.parent && (
                                      <div>
                                        <div className="text-sm my-1 mt-4">
                                          {item.parent && item.parent.address}
                                        </div>
                                        <div className="text-sm my-1 mt-4">
                                          {item.parent && `Description: ${item.parent.description}`}
                                        </div>
                                        <div className="mt-4"></div>
                                        {item.parent.text &&
                                          JSON.parse(item.parent.text).type === 'food' &&
                                          foodCartJSX(JSON.parse(item.parent.text).cart)}
                                      </div>
                                    )
                                  : item.parent && shorten(250, item.parent.content)}
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignContent: 'center',
                                    marginTop: 10,
                                    textTransform: 'lowercase',
                                    fontSize: 12,
                                    zIndex: 200
                                  }}
                                >
                                  <strong>
                                    {item.parent && item.parent.upVotes.length !== 0 ? (
                                      <div style={{ color: 'green', display: 'inline' }}>
                                        +{item.parent && item.parent.upVotes.length} upvotes
                                      </div>
                                    ) : (
                                      '0 upvotes'
                                    )}{' '}
                                    ,{' '}
                                    {item.parent && item.parent.downVotes.length !== 0 ? (
                                      <div style={{ color: 'red', display: 'inline' }}>
                                        -{item.parent && item.parent.downVotes.length} downvotes
                                      </div>
                                    ) : (
                                      '0 downvotes'
                                    )}
                                  </strong>
                                  <div>
                                    <strong>
                                      {item.parent && item.parent.comments.length} comments
                                    </strong>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          )}
                          {item.type === 'Comment' && (
                            <div style={{ paddingTop: 20 }}>
                              <Input
                                overrides={{
                                  InputContainer: {
                                    style: {
                                      border: 0,
                                      borderRadius: '5px'
                                    }
                                  }
                                }}
                                clearable
                                onClick={() => history.push('/submit')}
                                size={SIZE.compact}
                                onKeyPress={async event => {
                                  var code = event.keyCode || event.which;
                                  if (code === 13 && event.target.value !== '') {
                                    // post comment if post parent, reply if comment parent
                                    if (item.parent.type === 'Post') {
                                      await addCommentDispatch({
                                        env: process.env.REACT_APP_NODE_ENV,
                                        postId: item.parent._id,
                                        newComment: event.target.value
                                      });
                                    } else if (item.parent.type === 'Comment') {
                                      await addReplyDispatch({
                                        env: process.env.REACT_APP_NODE_ENV,
                                        postId: item.postId,
                                        commentId: item._id,
                                        newReply: event.target.value
                                      });
                                    }

                                    history.push(`/post/${item._id}`);
                                  }
                                }}
                                placeholder="add a comment..."
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    maxHeight: 'calc(0.2 * 550px)',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    marginTop: 10
                  }}
                >
                  {props.match.url !== '/home/ongoing' ? (
                    <div style={{ display: 'flex', alignContent: 'center', marginLeft: 15 }}>
                      <CopyToClipboard text={`${window.location.origin}/post/${item._id}`}>
                        <StatefulPopover
                          placement={PLACEMENT.bottomLeft}
                          content={({ close }) => (
                            <StatefulMenu
                              items={[
                                {
                                  label: 'Copy Link'
                                }
                              ]}
                              onItemSelect={item => {
                                close();
                                switch (item.item.label) {
                                  case 'Copy Link':
                                    break;
                                  default:
                                    break;
                                }
                              }}
                              overrides={{
                                List: { style: { outline: 'none', padding: '0px' } }
                              }}
                            />
                          )}
                        >
                          <Button
                            style={{ outline: 'none', padding: 0 }}
                            kind="minimal"
                            size={SIZE.compact}
                          >
                            <img
                              src="https://d1ppmvgsdgdlyy.cloudfront.net/share.svg"
                              alt="share"
                              style={{ height: 22, width: 'auto', display: 'block' }}
                            />
                            <div
                              style={{
                                marginLeft: 5,
                                textTransform: 'uppercase',
                                fontSize: 12
                              }}
                            >
                              <strong>Share</strong>
                            </div>
                          </Button>
                        </StatefulPopover>
                      </CopyToClipboard>
                    </div>
                  ) : (
                    <div />
                  )}
                  <div style={{ display: 'flex', alignContent: 'center' }}>
                    {confetti && <Confetti width={width} height={height} recycle={false} />}
                    {item.type === 'Post' &&
                      !item.completed &&
                      props.match.url === '/home/discover' &&
                      !item.assignedUser && (
                        <div style={{ display: 'flex', alignContent: 'center', marginLeft: 15 }}>
                          <Button
                            style={{ outline: 'none', padding: 0 }}
                            kind="minimal"
                            size={SIZE.compact}
                            onClick={() => {
                              if (item.assignedUser) {
                                alert(
                                  'someone is already helping on this task (in progress) - please look other requests'
                                );
                                return;
                              }

                              if (
                                window.confirm(
                                  'Please confirm your committment to helping this person - by saying yes, other people cannot claim this request.'
                                )
                              ) {
                                claimTaskDispatch({
                                  env: process.env.REACT_APP_NODE_ENV,
                                  postId: item._id
                                });

                                removeDiscover(item._id);

                                showConfetti(false);
                                showConfetti(true);
                              }
                            }}
                          >
                            <img
                              src="https://d1ppmvgsdgdlyy.cloudfront.net/help_color.svg"
                              alt="help"
                              style={{ height: 22, width: 'auto', display: 'block' }}
                            />
                            <div
                              style={{ marginLeft: 5, textTransform: 'uppercase', fontSize: 12 }}
                            >
                              <strong>Help</strong>
                            </div>
                          </Button>
                        </div>
                      )}
                    {props.match.url !== '/home/ongoing' && (
                      <div style={{ display: 'flex', alignContent: 'center', marginLeft: 15 }}>
                        <Button
                          style={{ outline: 'none', padding: 0 }}
                          kind="minimal"
                          size={SIZE.compact}
                          onClick={() => history.push(`/post/${item._id}`)}
                        >
                          <img
                            src="https://d1ppmvgsdgdlyy.cloudfront.net/comment.svg"
                            alt="comment"
                            style={{ height: 22, width: 'auto', display: 'block' }}
                          />
                          <div style={{ marginLeft: 5, textTransform: 'uppercase', fontSize: 12 }}>
                            <strong>{item.comments.length}&nbsp;</strong>
                          </div>
                        </Button>
                      </div>
                    )}
                    {props.match.url === '/home/ongoing' && (
                      <div className="flex justify-between items-center" style={{ marginLeft: 15 }}>
                        <Button
                          style={{ outline: 'none', padding: 0, marginRight: 15 }}
                          kind="minimal"
                          size={SIZE.compact}
                          onClick={() => {
                            let cancelReason = window.prompt(
                              'Why are you cancelling? Too many cancelled requests will flag your account'
                            );

                            if (cancelReason) {
                              unclaimTaskDispatch({
                                env: process.env.REACT_APP_NODE_ENV,
                                postId: item._id,
                                cancelReason
                              });

                              removeOngoing(item._id);
                            }
                          }}
                        >
                          <div style={{ marginLeft: 5, textTransform: 'uppercase', fontSize: 12 }}>
                            cancel
                          </div>
                        </Button>
                        <StatefulPopover
                          placement={PLACEMENT.bottomLeft}
                          content={({ close }) => (
                            <StatefulMenu
                              items={[
                                {
                                  label: 'Manually Add Details',
                                  key: 'manual'
                                }
                              ]}
                              onItemSelect={i => {
                                close();
                                switch (i.item.key) {
                                  case 'manual':
                                    setPostId(item._id);
                                    setOpenFoodTracking(true);
                                    break;
                                  case 'postmates':
                                    window.open('https://postmates.com/', '_blank');
                                    break;
                                  case 'ubereats':
                                    window.open('https://www.ubereats.com/', '_blank');
                                    break;
                                  case 'amazonfresh':
                                    window.open(
                                      'https://www.amazon.com/alm/storefront?almBrandId=QW1hem9uIEZyZXNo',
                                      '_blank'
                                    );
                                    break;
                                  case 'walmart':
                                    window.open('https://grocery.walmart.com/', '_blank');
                                    break;
                                  case 'costco':
                                    window.open(
                                      'https://www.costco.com/my-life-costco-grocery-online-delivery.html',
                                      '_blank'
                                    );
                                    break;
                                  case 'grubhub':
                                    window.open('https://grocery.walmart.com/', '_blank');
                                    break;
                                  case 'seamless':
                                    window.open('https://www.seamless.com/', '_blank');
                                    break;
                                  case 'instacart':
                                    window.open('https://www.instacart.com/', '_blank');
                                    break;
                                  case 'doordash':
                                    window.open('https://www.doordash.com/', '_blank');
                                    break;
                                  default:
                                    break;
                                }
                              }}
                              overrides={{
                                List: { style: { outline: 'none', padding: '0px' } }
                              }}
                            />
                          )}
                        >
                          <Button
                            style={{ outline: 'none', padding: 0 }}
                            kind="minimal"
                            size={SIZE.compact}
                          >
                            <div
                              style={{ marginLeft: 5, textTransform: 'uppercase', fontSize: 12 }}
                            >
                              <strong>Mark Completed</strong>
                            </div>
                          </Button>
                        </StatefulPopover>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Expand>
        </div>
      );
    });
  };

  render();

  return (
    <StickyFooter>
      <Navigation selectMenuDispatch={selectMenuDispatch} searchBarPosition="center" />
      <Modal
        overrides={{ Dialog: { style: { borderRadius: '7px' } } }}
        onClose={() => setOpenFoodTracking(false)}
        isOpen={openFoodTracking}
      >
        <ModalHeader>Mark Completed</ModalHeader>
        <ModalBody>
          When is the food arriving (ETA)?
          <Input
            value={eta}
            onChange={e => setETA(e.target.value)}
            placeholder="4/2/2020 @ 6:40pm"
          />
          <br />
          Are you missing anything from the order?
          <Input
            value={missing}
            onChange={e => setOrderMissing(e.target.value)}
            placeholder="spinach was out"
          />
          <br />
          Who is delivering the food? (name, phone number, etc)
          <Input
            value={deliverer}
            onChange={e => setOrderDeliverer(e.target.value)}
            placeholder="Barack Obama, 6465335281"
          />
          <br />
        </ModalBody>
        <ModalFooter>
          <ModalButton size={'compact'} kind={'minimal'} 
          onClick={() => setOpenFoodTracking(false)}>
            Cancel
          </ModalButton>
          <ModalButton
            size={'compact'}
            onClick={() => {
              if (eta && missing && deliverer && postId) {
                completeTaskDispatch({
                  env: process.env.REACT_APP_NODE_ENV,
                  postId: postId,
                  trackingDetails: {
                    method: 'manual',
                    created: new Date(),
                    dropoffEta: eta,
                    notes: `${missing}. \n\n${deliverer}`
                  }
                });

                showConfetti(false);
                showConfetti(true);
                setOpenFoodTracking(false); // close dialog
              } else {
                alert('you need to fill all the details');
              }
            }}
          >
            Submit
          </ModalButton>
        </ModalFooter>
      </Modal>

      <div className="max-w-screen-lg w-full mx-auto xl:flex xl:max-w-6xl pt-12 mb-8">
        
        <Sidebar {...props} />
        <section className="xl:w-1/2 px-6 lg:px-12">
          <NewsfeedTable
            {...props}
            authenticated={authenticated}
            address={address}
            setNewPost={setNewPost}
            hasMoreItems={hasMoreItems}
            selectMenuDispatch={selectMenuDispatch}
            id={id}
            items={items}
            resetItems={resetItems}
            setOpenCustomAddress={setOpenCustomAddress}
            setAddress={setAddress}
            setLatLng={setLatLng}
            latLng={latLng}
            newPost={newPost}
            selectMenu={selectMenu}
            openCustomAddress={openCustomAddress}
            setUpdateNews={setUpdateNews}
          />
        </section>
        <section className="hidden xl:block">
          <div
            style={{
              width: '344px'
            }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div className="text-left" style={{ fontWeight: 300 }}>
                <div
                  style={{
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: 16,
                    lineHeight: '20px',
                    color: '#545454',
                    paddingTop: '0px'
                  }}
                  className={`mb-4`}
                >
                  Global Leaderboard
                </div>
                <div
                  style={{
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: 12,
                    lineHeight: '14px',
                    color: '#545454'
                  }}
                >
                  Top Helpers
                </div>
              </div>
              <button
                className="bg-transparent hover:bg-gray-600 text-gray-700 font-semibold hover:text-white py-1 px-3 border border-gray-600 hover:border-transparent transition duration-150 rounded"
                style={{ outline: 'none' }}
                onClick={() => history.push('/leaderboard')}
              >
                <span style={{ fontSize: 12 }}>See full list</span>
              </button>
            </div>
            <div className="mt-4">
              <LeaderboardTable limit={10} />
            </div>
            {Number(userRanking) >= 0 && (
              <div className="mt-8">
                <div
                  style={{
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: 12,
                    lineHeight: '14px',
                    color: '#545454'
                  }}
                  className="text-left mb-4"
                >
                  Your Ranking
                </div>
                <LeaderboardTable user={user} />
                <StatefulPopover
                  placement={PLACEMENT.bottomRight}
                  overrides={{
                    Arrow: {
                      style: {
                        borderRadius: '50px'
                      }
                    },
                    Body: {
                      style: {
                        borderRadius: '50px'
                      }
                    },
                    Root: {
                      style: {
                        borderRadius: '50px',
                        boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
                      }
                    }
                  }}
                  content={({ close }) => (
                    <div className="bg-white rounded-lg p-5 shadow-lg">
                      <div className="tooltip-heading py-1 mb-1">
                        How does Karma on Giving Tree work?
                      </div>
                      <div className="tooltip-text py-1">
                        Your karma points accumulate when other users upvote your completed
                        requests.
                      </div>
                      <div className="tooltip-text py-1">
                        Upvotes you receive from users with higher karma have a greater influence on
                        your karma points.
                      </div>
                      <div className="tooltip-text py-1">
                        Have thoughts about our karma system?{' '}
                        <a className="tooltip-heading" href="mailto:givingtree@gmail.com">
                          Email Us
                        </a>
                      </div>
                    </div>
                  )}
                >
                  <div
                    style={{
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: 12,
                      lineHeight: '14px',
                      color: '#545454',
                      cursor: 'pointer'
                    }}
                    className="text-left mt-4"
                  >
                    Want to improve your ranking?{' '}
                    <span className="font-bold hover:text-indigo-600 transition duration-150">
                      Find out how
                    </span>
                  </div>
                </StatefulPopover>
              </div>
            )}
          </div>
        </section>
      </div>
    </StickyFooter>
  );
}

const mapDispatchToProps = dispatch => ({
  getCurrentUserDispatch: payload => dispatch(getCurrentUser(payload)),
  loadNewsfeedDispatch: payload => dispatch(loadNewsfeed(payload)),
  claimTaskDispatch: payload => dispatch(claimTask(payload)),
  unclaimTaskDispatch: payload => dispatch(unclaimTask(payload)),
  completeTaskDispatch: payload => dispatch(completeTask(payload)),
  upvoteDispatch: payload => dispatch(upvote(payload)),
  downvoteDispatch: payload => dispatch(downvote(payload)),
  signupDispatch: payload => dispatch(register(payload)),
  addCommentDispatch: payload => dispatch(addComment(payload)),
  addReplyDispatch: payload => dispatch(addReply(payload)),
  selectMenuDispatch: payload => dispatch(selectMenu(payload)),
  loginDispatch: payload => dispatch(login(payload)),
  initiateResetDispatch: payload => dispatch(initiateReset(payload))
});

const mapStateToProps = state => ({
  user: state.auth.user,
  newsfeed: state.auth.newsfeed,
  currentPage: state.auth.currentPage,
  selectMenu: state.auth.selectMenu,
  pages: state.auth.pages,
  numOfResults: state.auth.numOfResults,
  newsfeedSuccess: state.auth.newsfeedSuccess,
  newsfeedUpdated: state.auth.newsfeedUpdated,
  newsfeedLoading: state.auth.newsfeedLoading,
  userRanking: state.auth.userRanking,
  errorMessage: state.auth.errorMessage,
  registerLoading: state.auth.registerLoading,
  registerSuccess: state.auth.registerSuccess,
  registerFailure: state.auth.registerFailure,
  isRegistered: state.auth.isRegistered,
  loginLoading: state.auth.loginLoading,
  loginSuccess: state.auth.loginSuccess,
  loginFailure: state.auth.loginFailure,
  initiateResetSuccess: state.auth.initiateResetSuccess
});

export default connect(mapStateToProps, mapDispatchToProps)(geolocated()(NewsFeedPageOLD));