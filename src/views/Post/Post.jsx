import * as React from 'react';
import { Button, SHAPE } from 'baseui/button';
import { Input, SIZE } from 'baseui/input';
import { Tag, KIND } from 'baseui/tag';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { StatefulTooltip } from 'baseui/tooltip';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';
import Navigation from '../../components/Navigation';
import { geolocated } from 'react-geolocated';
import { StyledBody } from 'baseui/card';
import { Block } from 'baseui/block';
import { getDistance } from 'geolib';
import { ChevronUp, ChevronDown } from 'baseui/icon';
import { Drawer } from 'baseui/drawer';
import { Notification } from 'baseui/notification';
import moment from 'moment';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal';
import Sidebar from '../../components/Sidebar/Sidebar';
import { connect } from 'react-redux';
import { hotjar } from 'react-hotjar';

import {
  getCurrentUser,
  loadUser,
  editComment,
  deleteComment,
  deletePost,
  addComment,
  loadPost,
  upvote,
  downvote,
  addReply,
  markSeen,
  getLeaderboard
} from '../../store/actions/auth/auth-actions';

import { editPost } from '../../store/actions/user/user-actions';
import LeaderboardTable from '../../components/LeaderboardTable/LeaderboardTable';
import HelpMenu from '../../components/HelpMenu';
import Heading from '../../components/Heading';

function Post(props) {
  const {
    user,
    errorMessage,
    foundPost,
    loadPostDispatch,
    downvoteDispatch,
    upvoteDispatch,
    loadPostSuccess,
    loadPostFailure,
    editCommentDispatch,
    deleteCommentDispatch,
    deletePostDispatch,
    getLeaderboardDispatch,
    userRanking,
    addCommentDispatch,
    coords,
    addReplyDispatch,
    markSeenDispatch,
    editPostDispatch,
    markSeenBool,
    markSeenFailure,
    editPostLoading,
    editPostSuccess
  } = props;
  const id = props.match.params.id;
  let parsed = queryString.parse(window.location.href);
  parsed = Object.values(parsed)[0];

  const history = useHistory();

  const [title, setTitle] = React.useState('');
  const [updated, setUpdated] = React.useState(true);
  const [text, setText] = React.useState('');
  const [upvoteHover, setUpvoteHover] = React.useState([]);
  const [downvoteHover, setDownvoteHover] = React.useState([]);
  const [replyArray, setReplyArray] = React.useState([]);
  const [editArray, setEditArray] = React.useState([]);
  const [editState, setEditState] = React.useState({});
  const [annotationOpen, setAnnotationOpen] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [deleteChild, setDeleteChild] = React.useState({});
  const [postComment, setPostComment] = React.useState('');
  const [successComment, setSuccessComment] = React.useState(false);
  const [editor, setEditor] = React.useState(false);

  const [tags, setTags] = React.useState([]);

  // not null
  if (parsed !== null && !markSeenBool && !markSeenFailure) {
    markSeenDispatch({ env: process.env.REACT_APP_NODE_ENV, postId: id, userId: parsed });
  }

  React.useEffect(() => {
    loadPostDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      id
    });
    setUpdated(false);
  }, [props.newsfeed, props.newsfeedUpdated, id, loadPostDispatch, editPostSuccess]);

  React.useEffect(() => {
    console.log('updating state');
    if (!isEmpty(foundPost) && loadPostSuccess) {
      setTitle(foundPost.title);
      setTags(foundPost.categories);
      setText({
        address: foundPost.address || null,
        publicAddress: foundPost.publicAddress || null,
        requestType: foundPost.requestType || null,
        description: foundPost.description || null,
        cart: foundPost.cart || null,
        contactMethod: foundPost.contactMethod || null,
        email: foundPost.email || null,
        name: foundPost.name || null,
        dueDate: foundPost.dueDate || null,
        location: foundPost.location || null,
        postal: foundPost.postal || null,
        phoneNumber: foundPost.phoneNumber || null,
      });
    }
  }, [foundPost, loadPostSuccess]);

  React.useEffect(() => {
    hotjar.initialize('1751072', 6);
    getLeaderboardDispatch({ env: process.env.REACT_APP_NODE_ENV, location: 'global' });
  }, []);

  const cart = text ? text.cart : [];

  const isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  const getLeaderboardIcon = place => {
    switch (place.toString()) {
      case '1':
        return (
          <img
            src="https://d1ppmvgsdgdlyy.cloudfront.net/1st.svg"
            alt="1st"
            style={{ height: 20 }}
          />
        );
      case '2':
        return (
          <img
            src="https://d1ppmvgsdgdlyy.cloudfront.net/2nd.svg"
            alt="2nd"
            style={{ height: 20 }}
          />
        );
      case '3':
        return (
          <img
            src="https://d1ppmvgsdgdlyy.cloudfront.net/3rd.svg"
            alt="3rd"
            style={{ height: 20 }}
          />
        );
      default:
        return place;
    }
  };

  const handlePostLoad = async id => {
    if (!loadPostFailure && (isEmpty(foundPost) || !updated)) {
      await loadPostDispatch({
        env: process.env.REACT_APP_NODE_ENV,
        id
      });
      setUpdated(true);
    }
  };

  handlePostLoad(id);

  async function handleUpClick(type, _id, postId = '') {
    if (isEmpty(user)) {
      alert('need to login first!');
    } else {
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
  }

  async function handleDownClick(type, _id, postId = '') {
    if (isEmpty(user)) {
      alert('need to login first!');
    } else {
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
  }

  function stringToHslColor(str, s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  function mouseOutUp(i) {
    setUpvoteHover(upvoteHover.filter(item => item !== i));
  }

  function mouseOverUp(i) {
    setUpvoteHover(upvoteHover.concat(i));
  }

  function mouseOutDown(i) {
    setDownvoteHover(downvoteHover.filter(item => item !== i));
  }

  function handleCancelReply(id) {
    setReplyArray(replyArray.filter(item => item !== id));
  }

  function handleCancelEdit(id) {
    setEditArray(editArray.filter(item => item !== id));
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

  function generateCommentHTML(childComment, leftIndent, index) {
    return (
      <div key={index}
        style={{
          alignContent: 'center',
          marginLeft: Number(leftIndent) + 25,
          background: id === childComment._id ? '#FDF7E3' : ''
        }}
      >
        <div style={{ display: 'table' }}>
          <div style={{ textAlign: 'center' }}>
            <ChevronUp
              size={25}
              color={
                upvoteHover.includes(childComment._id) || childComment.upVotes.includes(user._id)
                  ? '#268bd2'
                  : '#aaa'
              }
              style={{ alignContent: 'center', cursor: 'pointer' }}
              onMouseEnter={() => mouseOverUp(childComment._id)}
              onMouseLeave={() => mouseOutUp(childComment._id)}
              onClick={async () =>
                await handleUpClick(
                  childComment.type,
                  childComment._id,
                  childComment.type === 'Comment' && childComment.postId
                )
              }
            />
            <div style={{ alignContent: 'center', marginBottom: 3 }}>{childComment.voteTotal}</div>
            <ChevronDown
              color={
                downvoteHover.includes(childComment._id) ||
                childComment.downVotes.includes(user._id)
                  ? '#268bd2'
                  : '#aaa'
              }
              size={25}
              style={{ alignContent: 'center', cursor: 'pointer' }}
              onMouseEnter={() => mouseOverDown(childComment._id)}
              onMouseLeave={() => mouseOutDown(childComment._id)}
              onClick={async () =>
                await handleDownClick(
                  childComment.type,
                  childComment._id,
                  childComment.type === 'Comment' && childComment.postId
                )
              }
            />
          </div>
          <div
            style={{
              display: 'table-cell',
              verticalAlign: 'middle',
              tableLayout: 'fixed',
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
              {childComment.type === 'Comment' && (
                <div>
                  <Block
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
                        flexWrap: 'wrap',
                        alignItems: 'center'
                      }}
                    >
                      <div
                        onClick={() => history.push(`/user/${childComment.username}`)}
                        style={{
                          flexShrink: 0,
                          width: 32,
                          height: 32,
                          background: `url(${generateHash(
                            childComment.username
                          )}), url(https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${childComment.username[0].toUpperCase()}.svg), ${stringToHslColor(
                            childComment.username,
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
                      <a style={{ 
                          textDecoration: 'none',
                          color: 'rgb(0, 121, 211)'
                        }}
                        className="mr-2"
                        href={`/user/${childComment.username}`}
                      >
                        <strong>{childComment.username}</strong>
                      </a>
                      <span className="">
                        {moment(childComment.updatedAt).format('MMM D, YYYY h:mm A')}{' '}
                        {childComment.updatedAt !== childComment.createdAt && '(edited)'}
                        &nbsp;
                        {childComment.type === 'Post' && (
                          <React.Fragment>
                            ·&nbsp;
                            <a
                              href={`/post/${childComment._id}`}
                              style={{ textDecoration: 'none', color: 'rgb(0, 121, 211)' }}
                            >
                              {childComment.title || ''}
                            </a>
                          </React.Fragment>
                        )}
                      </span>
                    </div>
                    {editArray.includes(childComment._id) ? (
                      <div style={{ paddingTop: 5, paddingBottom: 10 }}>
                        <Input
                          overrides={{
                            InputContainer: {
                              style: {
                                border: 0,
                                borderRadius: '5px'
                              }
                            }
                          }}
                          autoFocus
                          value={editState[childComment._id]}
                          onChange={event => {
                            let copyEditState = Object.assign({}, editState);
                            copyEditState[childComment._id.toString()] = event.currentTarget.value;
                            setEditState(copyEditState);
                          }}
                          size={SIZE.compact}
                          onKeyPress={event => {
                            var code = event.keyCode || event.which;
                            if (code === 13 && event.target.value !== '') {
                              // submit comment edit
                              editCommentDispatch({
                                env: process.env.REACT_APP_NODE_ENV,
                                postId: foundPost._id,
                                commentId: childComment._id,
                                newContent: editState[childComment._id]
                              });

                              // close
                              handleCancelEdit(childComment._id);
                            }
                          }}
                          placeholder="add a comment..."
                        />
                        <div
                          style={{
                            fontSize: 12,
                            marginLeft: 6,
                            cursor: 'pointer',
                            color: 'rgb(0, 121, 211)'
                          }}
                          onClick={() => handleCancelEdit(childComment._id)}
                        >
                          cancel
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 10 }}>
                        <StyledBody>{childComment.content}</StyledBody>
                      </div>
                    )}
                  </Block>
                  <div
                    style={{
                      display: 'flex',
                      alignContent: 'center',
                      marginTop: -10,
                      opacity: '50%'
                    }}
                  >
                    <Button
                      style={{ padding: 0 }}
                      onClick={() => setReplyArray(replyArray.concat(childComment._id))}
                      kind="minimal"
                      size={SIZE.compact}
                    >
                      <img
                        src="https://d1ppmvgsdgdlyy.cloudfront.net/reply.svg"
                        alt="reply"
                        style={{ height: 10, width: 'auto', display: 'block' }}
                      />
                      <div style={{ marginLeft: 5, textTransform: 'capitalize', fontSize: 10 }}>
                        <strong>Reply</strong>
                      </div>
                    </Button>
                    {childComment.username === user.username && (
                      <React.Fragment>
                        <Button
                          style={{ padding: 0, marginLeft: 4 }}
                          onClick={() => {
                            let copyEditState = Object.assign({}, editState);
                            copyEditState[childComment._id.toString()] = childComment.content; // update the name property, assign a new value
                            setEditState(copyEditState);
                            setEditArray(editArray.concat(childComment._id));
                          }}
                          kind="minimal"
                          size={SIZE.compact}
                        >
                          <div style={{ marginLeft: 5, textTransform: 'capitalize', fontSize: 10 }}>
                            <strong>Edit</strong>
                          </div>
                        </Button>
                        <Button
                          style={{ padding: 0, marginLeft: 4 }}
                          onClick={() => {
                            setDeleteModal(true);
                            setDeleteChild(childComment);
                          }}
                          kind="minimal"
                          size={SIZE.compact}
                        >
                          <div style={{ marginLeft: 5, textTransform: 'capitalize', fontSize: 10 }}>
                            <strong>Delete</strong>
                          </div>
                        </Button>
                        <Modal onClose={() => setDeleteModal(false)} isOpen={deleteModal}>
                          <ModalHeader>Delete Comment?</ModalHeader>
                          <ModalBody>
                            This cannot be undone. Comment and replies will be removed from your
                            profile and the newsfeed of any accounts that follow you.
                          </ModalBody>
                          <ModalFooter>
                            <ModalButton
                              size={'compact'}
                              kind={'minimal'}
                              onClick={() => setDeleteModal(false)}
                            >
                              Cancel
                            </ModalButton>
                            <ModalButton
                              size={'compact'}
                              onClick={() => {
                                deleteCommentDispatch({
                                  env: process.env.REACT_APP_NODE_ENV,
                                  postId: foundPost._id,
                                  commentId: deleteChild._id
                                });
                                setDeleteModal(false);
                              }}
                            >
                              Delete
                            </ModalButton>
                          </ModalFooter>
                        </Modal>
                      </React.Fragment>
                    )}
                  </div>
                  {replyArray.includes(childComment._id) && (
                    <div style={{ paddingTop: 5, paddingBottom: 10 }}>
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
                        autoFocus
                        size={SIZE.compact}
                        onKeyPress={event => {
                          var code = event.keyCode || event.which;
                          if (code === 13 && event.target.value !== '') {
                            addReplyDispatch({
                              env: process.env.REACT_APP_NODE_ENV,
                              postId: foundPost._id,
                              commentId: childComment._id,
                              newReply: event.target.value
                            });

                            // close
                            handleCancelReply(childComment._id);
                          }
                        }}
                        placeholder="add a comment..."
                      />
                      <div
                        style={{
                          fontSize: 12,
                          marginLeft: 6,
                          cursor: 'pointer',
                          color: 'rgb(0, 121, 211)'
                        }}
                        onClick={() => handleCancelReply(childComment._id)}
                      >
                        cancel
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function mouseOverDown(i) {
    setDownvoteHover(downvoteHover.concat(i));
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

  function recursiveCommentGenerator(comments, leftIndent) {
    let returnDOM = [];
    if (comments && comments.length > 0) {
      for (var index = 0; index < comments.length; index++) {
        const childComment = comments[index];

        let existingElement = generateCommentHTML(childComment, leftIndent , index);

        if (childComment.comments.length > 0) {
          let newElement = recursiveCommentGenerator(
            childComment.comments,
            Number(leftIndent) + 25
          );

          returnDOM.push(
            <div>
              {existingElement}
              {newElement}
            </div>
          );
        } else {
          returnDOM.push(existingElement);
        }
      }
      return returnDOM;
    }
  }

  let commentFeed = '';
  const createCommentFeed = async () => {
    commentFeed = recursiveCommentGenerator(foundPost.comments, 0);
  };

  createCommentFeed();

  const cartJSX = () => {
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
            <tr className={i % 2 === 0 && `bg-gray-100`} key={i}>
              <td className={`border px-4 py-2`}>{item.name}</td>
              <td className={`border px-4 py-2`}>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <Navigation searchBarPosition="center" />
      {successComment && (
        <Notification
          autoHideDuration={3000}
          kind="positive"
          overrides={{
            Body: {
              style: {
                backgroundColor: 'rgb(54, 135, 89)',
                bottom: 0,
                color: 'white',
                margin: '0 auto',
                position: 'fixed',
                textAlign: 'center'
              }
            }
          }}
        >
          Added comment successfully!
        </Notification>
      )}
      <div className="lg:max-w-4xl xl:max-w-screen-xl w-full mx-auto py-12 px-6">
        <div className="block xl:flex">
          <div className="xl:pr-6 sidebar-wrapper">
            <Sidebar {...props} />
          </div>
          <div className="w-full xl:px-6">
            {/* ELEMENT TO SHOW IF THERE IS AN ERROR MESSAGE */}
            {errorMessage && (
              <div
                style={{
                  color: 'rgb(204, 50, 63)',
                  width: '50%',
                  textAlign: 'center'
                }}
              >
                {errorMessage}
              </div>
            )}
            {/* SHOW THE ACTUAL POST IF THERE IS NO ERROR MESSAGE */}
            {!errorMessage && (
              <div>
                <Drawer
                  autoFocus
                  isOpen={annotationOpen}
                  onClose={() => setAnnotationOpen(false)}
                  overrides={{
                    Backdrop: {
                      style: {
                        opacity: 0
                      }
                    },
                    Close: {
                      style: {
                        border: 0
                      }
                    }
                  }}
                  size="auto"
                >
                  <div style={{ width: '17vw' }}>NOTES!</div>
                </Drawer>
                
                <div>
                  {isEmpty(foundPost) ? (
                    <div className="flex justify-center">
                      <div className="loading-spinner"></div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-4 shadow">
                      <div
                          style={{
                            alignContent: 'center',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            paddingBottom: 15
                          }}
                        >
                          <div className="flex items-center mr-1">
                            <div onClick={() => { 
                              history.push(`/user/${foundPost.username}`)
                            }}
                              style={{
                                background: `url(${generateHash(
                                  foundPost.username,
                                  foundPost.authorId.profileVersion
                                )}), url(https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${foundPost.username[0].toUpperCase()}.svg), ${stringToHslColor(
                                  foundPost.username,
                                  80,
                                  45
                                )}`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                borderRadius: '50%',
                                marginRight: 10,
                                cursor: 'pointer',
                                backgroundRepeat: 'no-repeat',
                                height: 32,
                                width: 32,
                                flexShrink: 0
                              }}
                            />
                            <div>
                              <strong>
                                <a
                                  style={{
                                    color: 'rgb(0, 121, 211)',
                                    textDecoration: 'none'
                                  }}
                                  href={`/user/${foundPost.username}`}
                                >
                                  {foundPost.username}
                                </a>
                              </strong>{' '}
                              ·{' '}
                              <StatefulTooltip
                                content={moment(foundPost.updatedAt).format('MMM D, YYYY h:mm A')}
                              >{`${
                                foundPost.createdAt === foundPost.updatedAt ? 'published' : 'updated'
                              } ${moment(new Date(foundPost.updatedAt)).fromNow()}`}</StatefulTooltip>
                            </div>
                            {/* <div style={{ textTransform: 'capitalize' }}>&nbsp;·&nbsp;{0}&nbsp;Views</div> */}
                          </div>
                          <div className="my-1"
                            style={{
                              alignContent: 'flex-start'
                            }}
                          >
                            <div
                              style={{
                                alignContent: 'center',
                                display: 'flex'
                              }}
                            >
                              {foundPost.type === 'Post' &&
                                !editor &&
                                foundPost.categories.map(i => (
                                  <Tag
                                    key={i}
                                    closeable={false}
                                    color="#4327F1"
                                    kind={KIND.custom}
                                    overrides={{
                                      Root: {
                                        style: {
                                          marginTop: '0px',
                                          marginBottom: '0px'
                                        }
                                      }
                                    }}
                                  >
                                    {i}
                                  </Tag>
                                ))}
                              {foundPost.assignedUser && !foundPost.completed && (
                                <Tag
                                  closeable={false}
                                  color="#FFA500"
                                  kind={KIND.custom}
                                  overrides={{
                                    Root: {
                                      style: {
                                        marginBottom: '0px',
                                        marginRight: '15px',
                                        marginTop: '0px'
                                      }
                                    }
                                  }}
                                >
                                  In Progress
                                </Tag>
                              )}
                              {foundPost.assignedUser && foundPost.completed && (
                                <Tag
                                  closeable={false}
                                  color="#4BCA81"
                                  kind={KIND.custom}
                                  overrides={{
                                    Root: {
                                      style: {
                                        marginRight: '15px',
                                        marginTop: '0px',
                                        marginBottom: '0px'
                                      }
                                    }
                                  }}
                                >
                                  Completed
                                </Tag>
                              )}
                              {!isEmpty(user) &&
                                user._id.toString() === foundPost.authorId._id.toString() &&
                                !foundPost.assignedUser &&
                                !foundPost.completed &&
                                (editor ? (
                                  <div className="flex items-center">
                                    <img
                                      onClick={() => {
                                        if (window.confirm('Are you sure you want to delete?')) {
                                          deletePostDispatch({
                                            env: process.env.REACT_APP_NODE_ENV,
                                            postId: foundPost._id
                                          });

                                          setTimeout(function() {
                                            alert('post deleted succcessfully');
                                            window.location = '/home/discover';
                                          }, 2000);
                                        }
                                      }}
                                      style={{
                                        objectFit: 'cover',
                                        maxHeight: 15,
                                        overflow: 'auto',
                                        marginRight: 5,
                                        cursor: 'pointer'
                                      }}
                                      src="https://d1ppmvgsdgdlyy.cloudfront.net/trash.svg"
                                      alt="delete"
                                    ></img>
                                    <Button
                                      kind={'secondary'}
                                      onClick={() => setEditor(false)}
                                      shape={'pill'}
                                      size={'compact'}
                                      style={{
                                        fontSize: '12px',
                                        marginLeft: 10,
                                        marginRight: 10
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      disabled={editPostLoading}
                                      kind={KIND.secondary}
                                      onClick={() => {
                                        editPostDispatch({
                                          env: process.env.REACT_APP_NODE_ENV,
                                          postId: foundPost._id,
                                          title,
                                          text: foundPost.text,
                                          categories: tags.join(',')
                                        });

                                        setEditor(false);
                                      }}
                                      shape={SHAPE.pill}
                                      size={SIZE.compact}
                                      style={{
                                        backgroundColor: '#03a87c',
                                        color: 'white',
                                        fontSize: '12px'
                                      }}
                                    >
                                      {editPostLoading
                                        ? 'Saving...'
                                        : editPostSuccess
                                        ? 'Saved'
                                        : 'Save'}
                                    </Button>
                                  </div>
                                ) : (
                                  <img
                                    alt="edit"
                                    onClick={() => {
                                      setEditor(true);
                                    }}
                                    src="https://d1ppmvgsdgdlyy.cloudfront.net/edit.svg"
                                    style={{
                                      cursor: 'pointer',
                                      height: 25,
                                      marginLeft: 15,
                                      width: 15
                                    }}
                                  />
                                ))}
                            </div>
                          </div>
                        </div>
                        <div style={{ alignContent: 'center' }}>
                          <div style={{ display: 'table' }}>
                            <div style={{ textAlign: 'center' }}>
                              <ChevronUp
                                size={25}
                                color={
                                  upvoteHover.includes(foundPost._id) ||
                                  foundPost.upVotes.includes(user._id)
                                    ? '#268bd2'
                                    : '#aaa'
                                }
                                style={{ alignContent: 'center', cursor: 'pointer' }}
                                onMouseEnter={() => mouseOverUp(foundPost._id)}
                                onMouseLeave={() => mouseOutUp(foundPost._id)}
                                onClick={async () =>
                                  await handleUpClick(
                                    foundPost.type,
                                    foundPost._id,
                                    foundPost.type === 'Comment' && foundPost.postId
                                  )
                                }
                              />
                              <div style={{ alignContent: 'center', marginBottom: 3 }}>
                                {foundPost.voteTotal}
                              </div>
                              <ChevronDown
                                color={
                                  downvoteHover.includes(foundPost._id) ||
                                  foundPost.downVotes.includes(user._id)
                                    ? '#268bd2'
                                    : '#aaa'
                                }
                                size={25}
                                style={{ outline: 'none', alignContent: 'center', cursor: 'pointer' }}
                                onMouseEnter={() => mouseOverDown(foundPost._id)}
                                onMouseLeave={() => mouseOutDown(foundPost._id)}
                                onClick={async () =>
                                  await handleDownClick(
                                    foundPost.type,
                                    foundPost._id,
                                    foundPost.type === 'Comment' && foundPost.postId
                                  )
                                }
                              />
                            </div>
                            <div
                              style={{
                                display: 'table-cell',
                                verticalAlign: 'middle',
                                tableLayout: 'fixed',
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
                                {editor ? (
                                  <Input
                                    onChange={event => {
                                      setTitle(event.target.value);
                                    }}
                                    size={'compact'}
                                    value={title}
                                  ></Input>
                                ) : (
                                  <Heading 
                                    level="2" 
                                    className="text-xl">
                                      {foundPost.title}
                                  </Heading>
                                )}
                                <div
                                  className="mb-4"
                                  style={{ marginTop: 5 }}
                                  onClick={() => {
                                    // setAnnotationOpen(!editor ? true : false);
                                  }}
                                >
                                  {foundPost.type === 'Post' ? (
                                    <div style={{ marginTop: 20 }}>
                                      <div>
                                        { (text.address || text.publicAddress) && (
                                          <div className="text-sm my-1 mt-4">
                                            Address: {text.address || text.publicAddress}
                                          </div>
                                        ) }
                                        {text && (
                                          <div className="text-sm my-1 mt-4">
                                            {coords && text.location
                                              ? `${calculateDistance(text.location)} miles from
                                          you ${
                                            text.postal
                                              ? `(${text.postal.split('-')[0] || text.postal})`
                                              : ''
                                          }`
                                              : `Zip Code: ${
                                                  text.postal
                                                    ? `${text.postal.split('-')[0] || text.postal}`
                                                    : ''
                                                }`}
                                          </div>
                                        )}
                                        <div className="text-sm my-1 mt-4">
                                          {text && `Description: ${text.description}`}
                                        </div>
                                        <div className="text-sm my-1 mt-4">
                                          {text &&
                                            text.dueDate &&
                                            `Needed by: ${moment(new Date(text.dueDate)).fromNow()} (${
                                              moment(text.dueDate).calendar()
                                            })`}
                                        </div>
                                        {text && text.contactMethod && (
                                          <div className="text-sm my-1 mt-4">
                                            Preferred contact method: { text.contactMethod }
                                          </div>
                                        )}
                                        {text && text.contactMethod === 'phone' && (
                                          <div className="text-sm my-1 mt-4">
                                            Phone Number:{' '}
                                            {text.phoneNumber &&
                                              `***-***-${text.phoneNumber.substring(
                                                text.phoneNumber.length - 4
                                              )}`}
                                          </div>
                                        )}
                                        {text && text.contactMethod === 'email' && text.email && (
                                          <div className="text-sm my-1 mt-4">
                                            Email: <a href={`mailto:${text.email}`}>{text.email}</a>
                                          </div>
                                        )}
                                        <div className="mt-4"></div>
                                        {cartJSX()}
                                      </div>
                                    </div>
                                  ) : editor ? (
                                    <Input size={'compact'} value={foundPost.content}></Input>
                                  ) : (
                                    foundPost.content
                                  )}
                                </div>
                                {!editor && (
                                  <div style={{ paddingTop: 5, paddingBottom: 10 }}>
                                    <Input
                                      overrides={{
                                        InputContainer: {
                                          style: {
                                            border: 0,
                                            borderRadius: '5px'
                                          }
                                        }
                                      }}
                                      autoFocus
                                      value={postComment}
                                      onChange={event => {
                                        setPostComment(event.target.value);
                                        setSuccessComment(false);
                                      }}
                                      size={SIZE.compact}
                                      onKeyPress={event => {
                                        var code = event.keyCode || event.which;
                                        if (code === 13 && event.target.value !== '') {
                                          // submit comment
                                          addCommentDispatch({
                                            env: process.env.REACT_APP_NODE_ENV,
                                            postId: foundPost._id,
                                            newComment: postComment
                                          });
                                          // close
                                          setSuccessComment(true);
                                          setPostComment('');
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
                        <hr />
                        <div style={{ marginTop: 15 }}>
                          {commentFeed}
                        </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hidden xl:block xl:pl-6 w-full" style={{
            maxWidth: '344px'
          }}>
            <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-left" style={{ fontWeight: 300 }}>
                <div
                  style={{
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '20px',
                    color: '#545454',
                    paddingTop: '0px'
                  }}
                  className={`mb-4`}
                >
                  Leaderboard<br/>
                  <span style={{
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: 12,
                    lineHeight: '14px',
                    color: '#545454'
                  }}>
                    Most helpful people in your area
                  </span>
                </div>
              </div>
              <button
              className="bg-transparent hover:bg-gray-600 text-gray-700 
              font-semibold hover:text-white py-1 px-3 border border-gray-600 
              hover:border-transparent transition duration-150 rounded"
              style={{ outline: 'none' }}
              onClick={() => history.push('/leaderboard')}>
                <span style={{ fontSize: 12 }}>See full list</span>
              </button>
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
              <LeaderboardTable limit={10} />
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
            
            
          </div>
        </div>
      </div>
      <HelpMenu />
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  getCurrentUserDispatch: payload => dispatch(getCurrentUser(payload)),
  loadUserDispatch: payload => dispatch(loadUser(payload)),
  editCommentDispatch: payload => dispatch(editComment(payload)),
  deletePostDispatch: payload => dispatch(deletePost(payload)),
  deleteCommentDispatch: payload => dispatch(deleteComment(payload)),
  markSeenDispatch: payload => dispatch(markSeen(payload)),
  editPostDispatch: payload => dispatch(editPost(payload)),
  getLeaderboardDispatch: payload => dispatch(getLeaderboard(payload)),
  addReplyDispatch: payload => dispatch(addReply(payload)),
  loadPostDispatch: payload => dispatch(loadPost(payload)),
  upvoteDispatch: payload => dispatch(upvote(payload)),
  downvoteDispatch: payload => dispatch(downvote(payload)),
  addCommentDispatch: payload => dispatch(addComment(payload))
});

const mapStateToProps = state => ({
  user: state.auth.user,
  foundUser: state.auth.foundUser,
  foundPost: state.auth.foundPost,
  errorMessage: state.auth.errorMessage,
  userRanking: state.auth.userRanking,
  leaderboard: state.auth.leaderboard,
  newsfeedUpdated: state.auth.newsfeedUpdated,
  deletePostSuccess: state.auth.deletePostSuccess,
  loadPostSuccess: state.auth.loadPostSuccess,
  loadPostFailure: state.auth.loadPostFailure,
  markSeenBool: state.auth.markSeen,
  markSeenFailure: state.auth.markSeenFailure,
  editPostLoading: state.user.editPostLoading,
  editPostSuccess: state.user.editPostSuccess,
  editPostFailure: state.user.editPostFailure
});

Post.defaultProps = {};

Post.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(geolocated()(Post));
