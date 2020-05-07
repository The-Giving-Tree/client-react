import Axios from 'axios';
import * as Sentry from '@sentry/browser';

import ROUTES from '../../../utils/routes';

const submitDraft = async (env, payload, token) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const data = await Axios.post(`${ROUTES[env].giving_tree}/v1/post/new`, payload, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const getDraft = async (env, draftId, token) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const data = await Axios.get(`${ROUTES[env].giving_tree}/v1/post/draft/${draftId}`, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const saveDraft = async (env, postId, title, text, categories, token) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const payload = {
    categories,
    text,
    title
  };

  try {
    const data = await Axios.put(
      `${ROUTES[env].giving_tree}/v1/post/save/${postId}`,
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

const uploadPhoto = async (env, image, token) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const formData = new FormData();
  formData.append('inlineImage', image);

  try {
    const data = await Axios.put(`${ROUTES[env].giving_tree}/v1/user/upload`, formData, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

/**
 * Update/Edit an existing post with new data
 */
const patchPost = async (env, postId, dataObj, token) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const payload = dataObj;

  try {
    const data = await Axios.patch(`${ROUTES[env].giving_tree}/v1/post/${postId}`, payload, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
}

const publishPost = async (env, postId, payload, token) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const data = await Axios.post(
      `${ROUTES[env].giving_tree}/v1/post/publish/${postId}`,
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

const markSeen = async (env, type, token) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const payload = {
    type
  };

  try {
    const data = await Axios.put(`${ROUTES[env].giving_tree}/v1/user/seen`, payload, headers);
    return data;
  } catch (e) {
    const error = e.response.data ? e.response.data : e;
    Sentry.captureException(new Error(JSON.stringify(error)));
    throw error;
  }
};

const Api = {
  submitDraft,
  saveDraft,
  publishPost,
  patchPost,
  markSeen,
  getDraft,
  uploadPhoto
};

export default Api;
