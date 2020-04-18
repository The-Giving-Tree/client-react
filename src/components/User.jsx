import * as React from 'react';
import { Button, SIZE } from 'baseui/button';
import Navigation from './Navigation/Navigation';
import { Avatar } from 'baseui/avatar';
import { useHistory } from 'react-router-dom';
import { Card, StyledBody } from 'baseui/card';
import { Block } from 'baseui/block';
import { hotjar } from 'react-hotjar';
import { Tabs, Tab } from 'baseui/tabs';
import moment from 'moment';
import { getDistance } from 'geolib';
import Check from 'baseui/icon/check';
import { geolocated } from 'react-geolocated';
import { Input } from 'baseui/input';
import { StatefulTooltip } from 'baseui/tooltip';
import Dropzone from 'react-dropzone';
import Sidebar from './Sidebar/Sidebar';

import { connect } from 'react-redux';

import {
  getCurrentUser,
  loadUser,
  follow,
  unfollow,
  updateProfile,
  selectMenu
} from '../store/actions/auth/auth-actions';
import StickyFooter from './StickyFooter/StickyFooter';

function User(props) {
  const {
    user,
    foundUser,
    followDispatch,
    unfollowDispatch,
    coords,
    foundUserNull,
    loadUserDispatch,
    updateProfileDispatch,
    selectMenuDispatch,
    updatedProfile
  } = props;
  const id = props.match.params.id.toLowerCase();

  const history = useHistory();

  const [followHover, setFollowHover] = React.useState(false);
  const [hoverHeader, setHoverHeader] = React.useState(false);
  const [hoverAvatar, setHoverAvatar] = React.useState(false);
  const [activeKey, setActiveKey] = React.useState('0');
  const [editorMode, setEditorMode] = React.useState(false);
  const [summaryText, setSummaryText] = React.useState('');
  const [profilePictureUrl, setProfilePictureUrl] = React.useState('');
  const [image, setImage] = React.useState({ preview: '', raw: '' });
  const [newFileName, setNewFileName] = React.useState('');
  const [header, setHeader] = React.useState({ preview: '', raw: '' });
  const [newHeaderFileName, setNewHeaderFileName] = React.useState('');
  const [hoverPost, setHoverPost] = React.useState([]);

  // load on page load
  React.useEffect(() => {
    loadUserDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      username: id
    });
  }, [id, loadUserDispatch]);

  React.useEffect(() => {}, [
    props.foundUserUpdated,
    props.foundUser,
    foundUserNull,
    props.updatedProfile
  ]);

  React.useEffect(() => {
    loadUserDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      username: id
    });
  }, [props.updatedProfile, id, loadUserDispatch]);

  React.useEffect(() => {
    hotjar.initialize('1751072', 6);
  }, []);

  function mouseOut() {
    setFollowHover(false);
  }

  function mouseOver() {
    setFollowHover(true);
  }

  function mouseOverHeader() {
    setHoverHeader(true);
  }

  function mouseOutHeader() {
    setHoverHeader(false);
  }

  function mouseOverAvatar() {
    setHoverAvatar(true);
  }

  function mouseOutAvatar() {
    setHoverAvatar(false);
  }

  function calculateDistance(requestLocation) {
    if (requestLocation && requestLocation.lat && requestLocation.lng && coords) {
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

      return mi ? mi.toFixed(2) : '-';
    } else {
      return '-';
    }
  }

  let followers = foundUser.followers ? foundUser.followers.length : '0';
  let following = foundUser.following ? foundUser.following.length : '0';
  let createdAt = foundUser.createdAt ? foundUser.createdAt : '';
  let karma = Number(foundUser.karma) >= 0 ? foundUser.karma : '';
  let username = foundUser.username;
  let name = foundUser.name;
  let verified = foundUser.verified;
  let summary = foundUser.summary;

  let profileFollowersArray = foundUser.followers
    ? foundUser.followers.map(function(obj) {
        return obj.followerId;
      })
    : [];
  let profileFollowingArray = foundUser.following
    ? foundUser.following.map(function(obj) {
        return obj.leaderId;
      })
    : [];

  let userFollowsProfile = profileFollowersArray.includes(user._id && user._id.toString());
  let userLeadsProfile = profileFollowingArray.includes(user._id && user._id.toString());
  let selfProfile = foundUser.username === user.username;

  function handleClick() {
    // following => unfollow
    if (userFollowsProfile) {
      unfollowDispatch({ env: process.env.REACT_APP_NODE_ENV, userId: foundUser._id });
    } else {
      followDispatch({ env: process.env.REACT_APP_NODE_ENV, userId: foundUser._id });
    }
  }

  const isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  const onDropHeader = files => {
    if (files.length > 1) {
      alert('only 1 picture is allowed at a time');
    } else {
      setHeader({
        preview: URL.createObjectURL(files[0]),
        raw: files[0]
      });
      setNewHeaderFileName(files[0].name);
    }
  };

  function stringToHslColor(str, s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  const onDrop = files => {
    if (files.length > 1) {
      alert('only 1 picture is allowed at a time');
    } else {
      setImage({
        preview: URL.createObjectURL(files[0]),
        raw: files[0]
      });
      setNewFileName(files[0].name);
    }
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

  function mouseOutDown(i) {
    setHoverPost(hoverPost.filter(item => item !== i));
  }

  function mouseOverDown(i) {
    setHoverPost(hoverPost.concat(i));
  }

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

  const cartJSX = cart => {
    return cart.length === 0 ? (
      <div className="text-center">no items in cart</div>
    ) : (
      <table className="table-auto" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th className="px-4 py-2">Item Description</th>
            <th className="px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, i) => (
            <tr className={i % 2 === 0 && `bg-gray-100`}>
              <td className={`border px-4 py-2`}>{item.name}</td>
              <td className={`border px-4 py-2`}>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  var postElements = <StyledBody>No requests!</StyledBody>;
  if (!foundUserNull && !isEmpty(foundUser) && foundUser.posts.length > 0) {
    console.log(foundUser.posts);
    postElements = foundUser.posts.map(post => (
      <Card
        overrides={{
          Root: {
            style: {
              width: '230px',
              height: '230px',
              borderRadius: '5px',
              cursor: 'pointer',
              overflow: 'hidden',
              margin: 'auto'
            }
          },
          Contents: {
            style: {
              margin: '0px'
            }
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '230px',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{
              height: 'calc(0.8 * 230px)',
              margin: '5px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={() => mouseOverDown(post._id)}
            onMouseLeave={() => mouseOutDown(post._id)}
            onClick={() => history.push(`/post/${post._id}`)}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  margin: 7,
                  marginBottom: 10
                }}
              >
                <div style={{ textTransform: 'lowercase', fontSize: 12, display: 'inline-flex' }}>
                  {post.upVotes.length !== 0 ? (
                    <div style={{ color: 'green', display: 'flex', alignContent: 'center' }}>
                      +{post.upVotes.length}{' '}
                      <img
                        src="https://d1ppmvgsdgdlyy.cloudfront.net/like.svg"
                        alt="ago"
                        style={{ width: '10px', marginLeft: 5 }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignContent: 'center' }}>
                      0
                      <img
                        src="https://d1ppmvgsdgdlyy.cloudfront.net/like.svg"
                        alt="ago"
                        style={{ width: '10px', marginLeft: 5 }}
                      />
                    </div>
                  )}
                  ,&nbsp;&nbsp;
                  {post.downVotes.length !== 0 ? (
                    <div style={{ color: 'red', display: 'flex', alignContent: 'center' }}>
                      -{post.downVotes.length}{' '}
                      <img
                        src="https://d1ppmvgsdgdlyy.cloudfront.net/dislike.svg"
                        alt="ago"
                        style={{ width: '10px', marginLeft: 5 }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignContent: 'center' }}>
                      0
                      <img
                        src="https://d1ppmvgsdgdlyy.cloudfront.net/dislike.svg"
                        alt="ago"
                        style={{ width: '10px', marginLeft: 5 }}
                      />
                    </div>
                  )}
                </div>
                <div style={{ textTransform: 'lowercase', fontSize: 12 }}>
                  <StatefulTooltip content={moment(post.updatedAt).format('MMM D, YYYY h:mm A')}>
                    <div style={{ display: 'flex', alignContent: 'center' }}>
                      <img
                        src="https://d1ppmvgsdgdlyy.cloudfront.net/future.svg"
                        alt="ago"
                        style={{ width: '12px', marginRight: 5 }}
                      />
                      {moment(post.updatedAt).fromNow()}
                    </div>
                  </StatefulTooltip>
                </div>
              </div>
              <div style={{ margin: 7 }}>
                <div>
                  <div className="font-bold text-base text-left my-1 mt-4">
                    {post.location && coords
                      ? `${calculateDistance(post.location)} miles from
                                      you ${
                                        post.postal
                                          ? `(${post.postal.split('-')[0] ||
                                              post.postal})`
                                          : ''
                                      }`
                      : `Zip Code: ${
                          post.postal
                            ? `${post.postal.split('-')[0] ||
                                post.postal}`
                            : ''
                        }`}
                  </div>
                  <div className="font-bold text-base text-left my-1 mt-4">
                    {post && `Description: ${post.description}`}
                  </div>
                  <div className="mt-4"></div>
                  {post.requestType === 'food' &&
                    cartJSX(post.cart)}
                </div>
              </div>
            </div>
            <div style={{ margin: 7 }}>
              <div>{post.categories.map(tag => `#${tag}`).join(', ')}</div>
            </div>
          </div>
          <div
            style={{
              height: 'calc(0.2 * 230px)',
              overflow: 'hidden',
              backgroundColor: hoverPost.includes(post._id) ? '#E8F0FE' : '#FFF',
              color: '#1967D2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src="https://d1ppmvgsdgdlyy.cloudfront.net/help.svg"
              alt="post"
              style={{ width: '16px', marginRight: 10 }}
            />
            {shorten(28, post.title)}
          </div>
        </div>
      </Card>
    ));
  }

  let draftElements = (
    <StyledBody>
      No drafts available.{' '}
      <a
        className="text-indigo-600 hover:text-indigo-800"
        style={{ textDecoration: 'none' }}
        href={'/submit'}
      >
        Get started!
      </a>
    </StyledBody>
  );
  if (!isEmpty(user) && user.drafts && user.drafts.length > 0) {
    draftElements = user.drafts.map(draft => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ fontSize: '14px' }}>
          {' '}
          <li>
            <a style={{ textDecoration: 'none' }} href={`/draft/${draft._id}`} alt={draft.title}>
              {draft.title}
            </a>
          </li>
        </div>
        <div style={{ fontSize: '14px' }}>
          &nbsp;-&nbsp;updated {moment(draft.updatedAt).fromNow()}
        </div>
      </div>
    ));
  }

  let commentElements = (
    <StyledBody>{foundUser.username} has not commented on anything yet!</StyledBody>
  );
  if (!foundUserNull && !isEmpty(foundUser) && foundUser.comments.length > 0) {
    commentElements = foundUser.comments.map(comment => (
      <div>
        <Card
          overrides={{
            Root: {
              style: {
                borderRadius: '10px'
              }
            }
          }}
          style={{ width: '100%', marginTop: 15 }}
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
                onClick={() => history.push(`/user/${comment.username}`)}
                style={{
                  width: 32,
                  height: 32,
                  background: `url(${generateHash(
                    comment.username
                  )}), url(https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${comment.username[0].toUpperCase()}.svg), ${stringToHslColor(
                    comment.username,
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
                  style={{ textDecoration: 'none', color: 'rgb(0, 121, 211)' }}
                  href={`/user/${comment.username}`}
                >
                  {comment && comment.username}
                </a>
              </strong>
              &nbsp;·&nbsp;
              {moment(comment && comment.createdAt).format('MMM D, YYYY h:mm A')}
            </div>
            <div style={{ alignContent: 'flex-start' }}>
              <img
                onClick={() => history.push(`/post/${comment._id}`)}
                src="https://d1ppmvgsdgdlyy.cloudfront.net/more.svg"
                alt="more"
                style={{ width: 15, height: 'auto', cursor: 'pointer' }}
              />
            </div>
          </div>
          <br />
          {shorten(250, comment.content)}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignContent: 'center',
              marginTop: 20,
              marginBottom: -10,
              textTransform: 'lowercase',
              fontSize: 12
            }}
          >
            <strong>
              {comment.upVotes && comment.upVotes.length !== 0 ? (
                <div style={{ color: 'green', display: 'inline' }}>
                  +{comment.upVotes.length} upvotes
                </div>
              ) : (
                '0 upvotes'
              )}{' '}
              ,{' '}
              {comment.downVotes && comment.downVotes.length !== 0 ? (
                <div style={{ color: 'red', display: 'inline' }}>
                  -{comment.downVotes.length} downvotes
                </div>
              ) : (
                '0 downvotes'
              )}
            </strong>
            <div></div>
          </div>
        </Card>
      </div>
    ));
  }

  function createVoteFeed(votes) {
    let response = votes.map(vote => (
      <div>
        <Card
          overrides={{
            Root: {
              style: {
                borderRadius: '10px',
                maxHeight: '300px',
                overflow: 'hidden',
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,1), rgba(0,0,0,0))`
              }
            }
          }}
          style={{ width: '100%', marginTop: 15 }}
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
                onClick={() => history.push(`/user/${vote.username}`)}
                style={{
                  width: 32,
                  height: 32,
                  background: `url(${generateHash(
                    vote.username
                  )}), url(https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${vote.username[0].toUpperCase()}.svg), ${stringToHslColor(
                    vote.username,
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
                  style={{ textDecoration: 'none', color: 'rgb(0, 121, 211)' }}
                  href={`/user/${vote.username}`}
                >
                  {vote && vote.username}
                </a>
              </strong>
              &nbsp;·&nbsp;
              {moment(vote && vote.createdAt).format('MMM D, YYYY h:mm A')}
            </div>
            <div style={{ alignContent: 'flex-start' }}>
              <img
                onClick={() => history.push(`/post/${vote._id}`)}
                src="https://d1ppmvgsdgdlyy.cloudfront.net/more.svg"
                alt="more"
                style={{ width: 15, height: 'auto', cursor: 'pointer' }}
              />
            </div>
          </div>
          <br />
          {vote.type === 'Comment' ? (
            shorten(250, vote.content)
          ) : vote.type === 'Post' ? (
            <div>
              <strong>{shorten(100, vote.title)}</strong>
              <br />
              <div>
                <div className="font-bold text-base text-left my-1 mt-4">
                  {vote.address}
                </div>
                <div className="font-bold text-base text-left my-1 mt-4">
                  {vote && `Description: ${vote.description}`}
                </div>
                <div className="mt-4"></div>
                {vote.requestType === 'food' &&
                  cartJSX(vote.cart)}
              </div>
            </div>
          ) : (
            ''
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignContent: 'center',
              marginTop: 20,
              marginBottom: -10,
              textTransform: 'lowercase',
              fontSize: 12
            }}
          >
            <strong>
              {vote.upVotes && vote.upVotes.length !== 0 ? (
                <div style={{ color: 'green', display: 'inline' }}>
                  +{vote.upVotes.length} upvotes
                </div>
              ) : (
                '0 upvotes'
              )}{' '}
              ,{' '}
              {vote.downVotes && vote.downVotes.length !== 0 ? (
                <div style={{ color: 'red', display: 'inline' }}>
                  -{vote.downVotes.length} downvotes
                </div>
              ) : (
                '0 downvotes'
              )}
            </strong>
            <div></div>
          </div>
        </Card>
      </div>
    ));

    return response;
  }

  let upvoteFeed = '';
  if (!foundUserNull && !isEmpty(foundUser) && foundUser.upvotes) {
    if (foundUser.upvotes.length > 0) {
      upvoteFeed = createVoteFeed(foundUser.upvotes);
    } else {
      upvoteFeed = <StyledBody>{foundUser.username} hasn't upvoted anything yet!</StyledBody>;
    }
  } else {
    upvoteFeed = <StyledBody>{foundUser.username} hasn't upvoted anything yet!</StyledBody>;
  }

  let downvoteFeed = '';
  if (!foundUserNull && !isEmpty(foundUser) && foundUser.downvotes) {
    if (foundUser.downvotes.length > 0) {
      downvoteFeed = createVoteFeed(foundUser.downvotes);
    } else {
      downvoteFeed = <StyledBody>{foundUser.username} hasn't downvoted anything yet!</StyledBody>;
    }
  } else {
    downvoteFeed = <StyledBody>{foundUser.username} hasn't downvoted anything yet!</StyledBody>;
  }

  function dayAge(date) {
    var diff = new Date() - new Date(date);
    return diff / 1000 / (60 * 60 * 24);
  }

  return (
    <StickyFooter>
      <Navigation selectMenuDispatch={selectMenuDispatch} searchBarPosition="center" />
      <div className="lg:max-w-4xl xl:max-w-screen-xl w-full mx-auto py-12 px-6">
        <div className="block xl:flex">
          <aside className="xl:pr-6 sidebar-wrapper">
            <Sidebar {...props} />
          </aside>
          <section className="w-full xl:px-6">
            {foundUserNull && isEmpty(foundUser) ? (
              <div style={{ margin: '0 auto', textAlign: 'center' }}>
                Sorry, {id} is banned or is not a real user
              </div>
            ) : (    
              <div className="user-cards-container">
                  <Card
                    headerImage={header.preview || foundUser.headerPictureUrl}
                    overrides={{
                      Root: {
                        style: {
                          margin: '0 auto',
                          position: 'relative'
                        }
                      },
                      HeaderImage: {
                        style: {
                          width: '100%',
                          objectFit: 'cover',
                          height: '250px',
                          opacity: editorMode ? (hoverHeader ? '80%' : '30%') : '100%',
                          zIndez: 0
                        }
                      }
                    }}
                  >
                    {editorMode && (
                      <Dropzone
                        accept="image/*"
                        onDrop={files => onDropHeader(files)}
                        className="dropzone-box"
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div {...getRootProps()} style={{ outline: 'none' }}>
                              <input {...getInputProps()} />
                              <div
                                style={{
                                  display: 'block',
                                  position: 'absolute',
                                  width: 30,
                                  height: 30,
                                  top: '30px',
                                  right: '30px',
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'center',
                                  cursor: 'pointer',
                                  backgroundImage: `url('https://d1ppmvgsdgdlyy.cloudfront.net/photo.svg')`
                                }}
                                onMouseEnter={() => mouseOverHeader()}
                                onMouseLeave={() => mouseOutHeader()}
                              />
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    )}
                    {username && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignContent: 'center'
                        }}
                      >
                        {editorMode ? (
                          <div type="file" style={{ position: 'relative', cursor: 'pointer' }}>
                            <Dropzone
                              accept="image/*"
                              onDrop={files => onDrop(files)}
                              className="dropzone-box"
                            >
                              {({ getRootProps, getInputProps }) => (
                                <section>
                                  <div
                                    {...getRootProps()}
                                    style={{ outline: 'none' }}
                                    onMouseEnter={() => mouseOverAvatar()}
                                    onMouseLeave={() => mouseOutAvatar()}
                                  >
                                    <input {...getInputProps()} />
                                    <div
                                      style={{
                                        display: 'block',
                                        position: 'absolute',
                                        width: 30,
                                        height: 30,
                                        top: '55px',
                                        left: '55px',
                                        zIndex: '1',
                                        marginTop: '-94px',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                        backgroundImage: `url('https://d1ppmvgsdgdlyy.cloudfront.net/photo.svg')`
                                      }}
                                    />
                                    <Avatar
                                      overrides={{
                                        Avatar: {
                                          style: {
                                            opacity: hoverAvatar ? '90%' : '60%',
                                            background: stringToHslColor(username, 80, 45)
                                          }
                                        },
                                        Initials: { style: { backgroundColor: 'white' } },
                                        Root: {
                                          style: {
                                            marginTop: '-94px'
                                          }
                                        }
                                      }}
                                      name={username}
                                      src={
                                        image.preview ||
                                        foundUser.profilePictureUrl ===
                                          'https://d1ppmvgsdgdlyy.cloudfront.net/acacia.svg'
                                          ? `https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${username[0].toUpperCase()}.svg`
                                          : foundUser.profilePictureUrl
                                      }
                                      size={'140px'}
                                      key={'140px'}
                                    />
                                  </div>
                                </section>
                              )}
                            </Dropzone>
                            {newFileName && (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <p
                                  className="my-2"
                                  style={{ fontSize: 8, textAlign: 'center', color: 'green' }}
                                >
                                  {newFileName}
                                </p>
                                <Check style={{ height: 16, color: 'green' }} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <Avatar
                            name={username}
                            overrides={{
                              Root: {
                                style: {
                                  marginTop: '-94px',
                                  background: stringToHslColor(username, 80, 45)
                                }
                              }
                            }}
                            src={
                              updatedProfile && image.preview
                                ? image.preview
                                : foundUser.profilePictureUrl ===
                                  'https://d1ppmvgsdgdlyy.cloudfront.net/acacia.svg'
                                ? `https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${username[0].toUpperCase()}.svg`
                                : foundUser.profilePictureUrl
                            }
                            size={'140px'}
                            key={'140px'}
                          />
                        )}
                        {selfProfile && editorMode ? (
                          <div style={{ alignContent: 'flex-start' }}>
                            <Button
                              onClick={() => {
                                setEditorMode(false);
                                setImage({ preview: '', raw: '' });
                                setHeader({ preview: '', raw: '' });
                              }}
                              style={{ marginRight: 15, fontSize: '14px' }}
                              kind={'secondary'}
                              shape={'pill'}
                              size={'compact'}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => {
                                // submit dispatch
                                updateProfileDispatch({
                                  env: process.env.REACT_APP_NODE_ENV,
                                  summary: summaryText,
                                  rawImage: image.raw || '',
                                  rawHeader: header.raw || ''
                                });
                                setNewFileName('');
                                setEditorMode(false);
                              }}
                              shape={'pill'}
                              style={{ fontSize: '14px' }}
                              size={'compact'}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          selfProfile && (
                            <div style={{ alignContent: 'flex-start' }}>
                              <img
                                src="https://d1ppmvgsdgdlyy.cloudfront.net/edit.svg"
                                alt="edit"
                                onClick={() => {
                                  //
                                  setSummaryText(summary);
                                  setProfilePictureUrl(foundUser.profilePictureUrl);

                                  setEditorMode(true);
                                }}
                                style={{ cursor: 'pointer', width: 15 }}
                              />
                            </div>
                          )
                        )}
                      </div>
                    )}
                    {
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignContent: 'center',
                            marginTop: 30
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <p
                              className="my-2"
                              style={{ textTransform: 'capitalize', margin: 'auto 0', fontSize: 20 }}
                            >
                              <strong>{username}</strong>
                              {name && ` - ${name}`}
                            </p>
                            {verified && (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                  src="https://d1ppmvgsdgdlyy.cloudfront.net/verified.svg"
                                  alt="verified"
                                  style={{ marginLeft: 14, height: 20 }}
                                />
                                <div style={{ marginLeft: 5, fontSize: 12 }}>
                                  <strong>verified</strong>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            {userLeadsProfile && (
                              <div style={{ marginRight: 20, display: 'inline' }}>Follows You</div>
                            )}
                            {!selfProfile && (
                              <Button
                                style={{
                                  outline: 'none',
                                  backgroundColor: userFollowsProfile
                                    ? followHover
                                      ? 'rgb(202, 32, 85)'
                                      : 'rgb(0, 121, 211)'
                                    : 'rgb(238, 238, 238)',
                                  color: userFollowsProfile ? 'white' : 'black'
                                }}
                                onClick={() => handleClick()}
                                onMouseEnter={() => mouseOver()}
                                onMouseLeave={() => mouseOut()}
                                size={SIZE.compact}
                                shape={'pill'}
                                kind={'secondary'}
                              >
                                {userFollowsProfile
                                  ? followHover
                                    ? 'Unfollow'
                                    : 'Following'
                                  : 'Follow'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    }

                    {createdAt && (
                      <p
                        className="my-2"
                        style={{ textTransform: 'capitalize', margin: 'auto 0', fontSize: 12 }}
                      >
                        {Number(karma) >= 0 ? Number(karma) : 0} karma · Member since{' '}
                        {moment(createdAt).format('MMM D, YYYY')}
                      </p>
                    )}

                    <Block>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: 20,
                          alignContent: 'center'
                        }}
                      >
                        {editorMode ? (
                          <Input
                            placeholder="add a description..."
                            size={'compact'}
                            overrides={{ Root: { style: { width: '500px' } } }}
                            value={summaryText}
                            onChange={event => setSummaryText(event.currentTarget.value)}
                            onKeyPress={async event => {
                              var code = event.keyCode || event.which;
                              if (code === 13 && event.target.value !== '') {
                                // submit dispatch
                                updateProfileDispatch({
                                  env: process.env.REACT_APP_NODE_ENV,
                                  summary: summaryText,
                                  rawImage: image.raw || '',
                                  rawHeader: header.raw || ''
                                });
                                setNewFileName('');
                                setEditorMode(false);
                              }
                            }}
                          ></Input>
                        ) : (
                          <div style={{ fontSize: 16 }}>{summary}</div>
                        )}
                        <div style={{ fontSize: 16 }}>
                          <strong>{following}&nbsp;</strong> following &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <strong>{followers}&nbsp;</strong> followers
                        </div>
                      </div>
                    </Block>
                  </Card>
                  {/* Add this later */}
                  {/* <Card
                    overrides={{
                      Root: {
                        style: {
                          margin: '0 auto',
                          marginTop: '30px'
                        }
                      }
                    }}
                  >
                    <StyledBody>Latest Activity</StyledBody>
                  </Card> */}
                  <Card
                    overrides={{
                      Root: {
                        style: {
                          margin: '0 auto',
                          marginBottom: '60px',
                          marginTop: '30px'
                        }
                      }
                    }}
                  >
                    <Tabs
                      onChange={({ activeKey }) => {
                        setActiveKey(activeKey);
                      }}
                      activeKey={activeKey}
                      overrides={{
                        TabContent: { style: { paddingLeft: '0px', paddingRight: '0px' } },
                        TabBar: {
                          style: {
                            overflow: 'auto'
                          }
                        }
                      }}
                    >
                      <Tab
                        overrides={{
                          Tab: { style: { outline: 'none' } },
                          TabContent: { style: { paddingLeft: '12px', paddingRight: '12px' } }
                        }}
                        title="Requests"
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridGap: '0',
                            gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))',
                            gridTemplateRows: 'repeat(auto-fill,minmax(250px,1fr))',
                            maxHeight: '500px',
                            overflow: 'auto'
                          }}
                        >
                          {postElements}
                        </div>
                      </Tab>
                      {selfProfile && (
                        <Tab overrides={{ Tab: { style: { outline: 'none' } } }} title="Drafts">
                          <div style={{ maxHeight: '500px', overflow: 'auto' }}>{draftElements}</div>
                        </Tab>
                      )}
                      {/* <Tab
                        overrides={{
                          Tab: { style: { outline: 'none' } },
                          TabContent: { style: { paddingLeft: '12px', paddingRight: '12px' } }
                        }}
                        title="Funding"
                      >
                        Something
                      </Tab> */}
                      <Tab overrides={{ Tab: { style: { outline: 'none' } } }} title="Comments">
                        <div style={{ maxHeight: '500px', overflow: 'auto', paddingRight: '10px' }}>
                          {commentElements}
                        </div>
                      </Tab>
                      <Tab overrides={{ Tab: { style: { outline: 'none' } } }} title="Upvotes">
                        <div style={{ maxHeight: '500px', overflow: 'auto', paddingRight: '10px' }}>
                          {upvoteFeed}
                        </div>
                      </Tab>
                      <Tab overrides={{ Tab: { style: { outline: 'none' } } }} title="Downvotes">
                        <div style={{ maxHeight: '500px', overflow: 'auto', paddingRight: '10px' }}>
                          {downvoteFeed}
                        </div>
                      </Tab>
                    </Tabs>
                  </Card>
                </div>
            )}
          </section>
        </div>
        
      </div>
    </StickyFooter>   
  );
}

const mapDispatchToProps = dispatch => ({
  getCurrentUserDispatch: payload => dispatch(getCurrentUser(payload)),
  loadUserDispatch: payload => dispatch(loadUser(payload)),
  followDispatch: payload => dispatch(follow(payload)),
  unfollowDispatch: payload => dispatch(unfollow(payload)),
  updateProfileDispatch: payload => dispatch(updateProfile(payload)),
  selectMenuDispatch: payload => dispatch(selectMenu(payload))
});

const mapStateToProps = state => ({
  user: state.auth.user,
  foundUser: state.auth.foundUser,
  errorMessage: state.auth.errorMessage,
  foundUserUpdated: state.auth.foundUserUpdated,
  foundUserNull: state.auth.foundUserNull,
  updatedProfile: state.auth.updatedProfile
});

User.defaultProps = {};

User.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(geolocated()(User));
