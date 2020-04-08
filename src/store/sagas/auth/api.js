import Axios from 'axios';
import * as Sentry from '@sentry/browser';

import ROUTES from '../../../utils/routes';

/**
 * @function
 * @name login
 * @returns {string} - login
 */
const login = async (env, username, password, rememberMe) => {
  try {
    const payload = {
      username,
      password,
      rememberMe
    };
    const data = await Axios.post(`${ROUTES[env].giving_tree}/v1/user/login`, payload);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

/**
 * @function
 * @name register
 * @returns {string} - register
 */
const register = async (env, name, email, username, password) => {
  try {
    const payload = {
      username,
      password,
      name,
      email
    };
    const data = await Axios.post(`${ROUTES[env].giving_tree}/v1/user/register`, payload);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const follow = async (env, userId, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const data = await Axios.post(
      `${ROUTES[env].giving_tree}/v1/user/follow/${userId}`,
      {},
      headers
    );
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const unfollow = async (env, userId, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const data = await Axios.post(
      `${ROUTES[env].giving_tree}/v1/user/unfollow/${userId}`,
      {},
      headers
    );
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const deleteComment = async (env, postId, commentId, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const data = await Axios.delete(
      `${ROUTES[env].giving_tree}/v1/post/${postId}/comments/${commentId}`,
      headers
    );
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const addComment = async (env, postId, text, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const payload = { text };

    const data = await Axios.post(
      `${ROUTES[env].giving_tree}/v1/post/${postId}/comments`,
      payload,
      headers
    );
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const addReply = async (env, postId, commentId, text, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const payload = { text };

    const data = await Axios.post(
      `${ROUTES[env].giving_tree}/v1/post/${postId}/comments/${commentId}/replies`,
      payload,
      headers
    );
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const editComment = async (env, postId, commentId, newContent, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const data = await Axios.put(
      `${ROUTES[env].giving_tree}/v1/post/${postId}/comments/${commentId}/update`,
      { newContent },
      headers
    );
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const claimTask = async (env, postId, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const data = await Axios.put(`${ROUTES[env].giving_tree}/v1/post/${postId}/claim`, {}, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const unclaimTask = async (env, postId, cancelReason, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const data = await Axios.put(
      `${ROUTES[env].giving_tree}/v1/post/${postId}/unclaim`,
      { reason: cancelReason },
      headers
    );
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const completeTask = async (env, postId, trackingDetails, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const data = await Axios.put(
      `${ROUTES[env].giving_tree}/v1/post/${postId}/complete`,
      trackingDetails,
      headers
    );
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const upvote = async (env, postId, commentId = '', token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    if (commentId === '') {
      const data = await Axios.put(
        `${ROUTES[env].giving_tree}/v1/post/${postId}/vote-up`,
        {},
        headers
      );
      return data;
    } else {
      const data = await Axios.put(
        `${ROUTES[env].giving_tree}/v1/post/${postId}/comments/${commentId}/vote-up`,
        {},
        headers
      );
      return data;
    }
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const downvote = async (env, postId, commentId = '', token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    if (commentId === '') {
      const data = await Axios.put(
        `${ROUTES[env].giving_tree}/v1/post/${postId}/vote-down`,
        {},
        headers
      );
      return data;
    } else {
      const data = await Axios.put(
        `${ROUTES[env].giving_tree}/v1/post/${postId}/comments/${commentId}/vote-down`,
        {},
        headers
      );
      return data;
    }
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const loadPost = async (env, id, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const data = await Axios.get(`${ROUTES[env].giving_tree}/refresh/${id}`, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const deletePost = async (env, id, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const data = await Axios.delete(`${ROUTES[env].giving_tree}/v1/post/${id}`, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const loadUser = async (env, username) => {
  try {
    const data = await Axios.get(`${ROUTES[env].giving_tree}/v1/user/${username}`);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

const getLeaderboard = async (env, location = 'global', token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    let query = '';
    if (location !== 'global') {
      query += `lat=${location.lat}&lng=${location.lng}`;
    }

    let data = await Axios.get(`${ROUTES[env].giving_tree}/leaderboard?${query}`, headers);

    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const loadNewsFeed = async (env, page, location = undefined, feed, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    let query = '';
    if (location && location.lat && location.lng) {
      query += `lat=${location.lat}&lng=${location.lng}`;
    }

    let data = '';
    switch (feed) {
      case 'Home':
        data = await Axios.get(`${ROUTES[env].giving_tree}/home/${page}`, headers);
        break;
      case 'Discover':
        data = await Axios.get(`${ROUTES[env].giving_tree}/discover/${page}?${query}`);
        break;
      case 'Newest':
        data = await Axios.get(`${ROUTES[env].giving_tree}/newest/${page}`, headers);
        break;
      case 'Popular':
        data = await Axios.get(`${ROUTES[env].giving_tree}/popular/${page}`, headers);
        break;
      case 'Ongoing':
        data = await Axios.get(`${ROUTES[env].giving_tree}/ongoing/${page}`, headers);
        break;
      case 'Completed':
        data = await Axios.get(`${ROUTES[env].giving_tree}/completed/${page}`, headers);
        break;
      case 'Global':
        data = await Axios.get(`${ROUTES[env].giving_tree}/global/${page}`, headers);
        break;
      default:
        data = await Axios.get(`${ROUTES[env].giving_tree}/discover/${page}?${query}`);
        break;
    }

    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const loadPicture = async (env, id, token) => {
  try {
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const data = await Axios.get(`${ROUTES[env].giving_tree}/v1/user/${id}/pictures`, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const markSeen = async (env, postId, userId, token) => {
  try {
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const payload = {
      postId,
      userId
    };

    const data = await Axios.post(`${ROUTES[env].giving_tree}/seen`, payload, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const updateProfile = async (env, summary, rawImage, rawHeader, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const formData = new FormData();
    formData.append('image', rawImage);
    formData.append('header', rawHeader);

    const data = await Axios.put(
      `${ROUTES[env].giving_tree}/v1/user/?summary=${summary}`,
      formData,
      headers
    );
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const getCurrentUser = async (env, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const data = await Axios.get(`${ROUTES[env].giving_tree}/v1/user`, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const logout = async (env, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const data = await Axios.post(`${ROUTES[env].giving_tree}/v1/user/logout`, {}, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const logoutAll = async (env, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const data = await Axios.post(`${ROUTES[env].giving_tree}/v1/user/logoutall`, {}, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const confirmPassword = async (env, password, token) => {
  try {
    const data = await Axios.post(`${ROUTES[env].giving_tree}/v1/user/confirm-password`, {
      password,
      token
    });
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const initiateReset = async (env, email) => {
  try {
    const data = await Axios.post(`${ROUTES[env].giving_tree}/v1/user/reset-password`, { email });
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const clearNotifications = async (env, token) => {
  try {
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const data = await Axios.post(
      `${ROUTES[env].giving_tree}/v1/user/clear-notifications`,
      {},
      headers
    );
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const Api = {
  login,
  initiateReset,
  clearNotifications,
  confirmPassword,
  updateProfile,
  getCurrentUser,
  editComment,
  addReply,
  addComment,
  deleteComment,
  claimTask,
  unclaimTask,
  completeTask,
  upvote,
  follow,
  loadPicture,
  unfollow,
  markSeen,
  downvote,
  getLeaderboard,
  deletePost,
  loadNewsFeed,
  loadPost,
  loadUser,
  register,
  logout,
  logoutAll
};

export default Api;
