import { call, put, takeLatest } from 'redux-saga/effects';
import ACTION_TYPE from '../../actions/user/action-types';
import Api from './api';

export function* submitDraft(action) {
  try {
    let token = localStorage.getItem('giving_tree_jwt');
    const data = yield call(
      Api.submitDraft,
      action.payload.env,
      action.payload.data,
      token
    );
    const submittedDraft = data.data;

    yield put({
      type: ACTION_TYPE.SUBMIT_DRAFT_SUCCESS,
      payload: {
        submittedDraft
      }
    });
  } catch (error) {
    console.log('error: ', error);
    yield put({ type: ACTION_TYPE.SUBMIT_DRAFT_FAILURE, payload: error });
  }
}

export function* getDraft(action) {
  try {
    let token = localStorage.getItem('giving_tree_jwt');
    const data = yield call(Api.getDraft, action.payload.env, action.payload.draftId, token);
    const foundDraft = data.data;

    yield put({
      type: ACTION_TYPE.GET_DRAFT_SUCCESS,
      payload: {
        foundDraft
      }
    });
  } catch (error) {
    console.log('error: ', error);
    yield put({ type: ACTION_TYPE.GET_DRAFT_FAILURE, payload: error });
  }
}

export function* saveDraft(action) {
  try {
    let token = localStorage.getItem('giving_tree_jwt');
    const data = yield call(
      Api.saveDraft,
      action.payload.env,
      action.payload.postId,
      action.payload.title,
      action.payload.text,
      action.payload.categories,
      token
    );
    const submittedDraft = data.data;

    yield put({
      type: ACTION_TYPE.SAVE_DRAFT_SUCCESS,
      payload: {
        submittedDraft
      }
    });
  } catch (error) {
    console.log('error: ', error);
    yield put({ type: ACTION_TYPE.SAVE_DRAFT_FAILURE, payload: error });
  }
}

/**
 * Update the post with some new data
 *
 * @export
 * @param {*} action
 */
export function* patchPost(action) {
  try {
    let token = localStorage.getItem('giving_tree_jwt');
    const data = yield call(
      Api.patchPost,
      action.payload.env,
      action.payload.postId,
      action.payload.data,
      token
    );

    const submittedPost = data.data;

    yield put({
      type: ACTION_TYPE.PATCH_POST_SUCCESS,
      payload: {
        submittedPost
      }
    });
  } catch (error) {
    console.log('error: ', error);
    yield put({
      type: ACTION_TYPE.PATCH_POST_FAILURE, 
      payload: error
    });
  }
}

export function* publishPost(action) {
  try {
    let token = localStorage.getItem('giving_tree_jwt');
    const data = yield call(
      Api.publishPost,
      action.payload.env,
      action.payload.postId,
      action.payload.data,
      token
    );
    const submittedPost = data.data;

    yield put({
      type: ACTION_TYPE.PUBLISH_POST_SUCCESS,
      payload: {
        submittedPost
      }
    });
  } catch (error) {
    console.log('error: ', error);
    yield put({ type: ACTION_TYPE.PUBLISH_POST_FAILURE, payload: error });
  }
}

export function* uploadPhoto(action) {
  try {
    let token = localStorage.getItem('giving_tree_jwt');
    console.log('uploading photo saga');
    const data = yield call(Api.uploadPhoto, action.payload.env, action.payload.rawImage, token);

    let { url } = data.data;

    yield put({
      type: ACTION_TYPE.UPLOAD_PHOTO_SUCCESS,
      payload: {
        url
      }
    });
  } catch (error) {
    yield put({ type: ACTION_TYPE.UPLOAD_PHOTO_FAILURE, payload: error });
  }
}

/**
 * Tell the back end if the specified tutorial modal has been seen
 *
 * @export
 * @param {*} action
 */
export function* markSeen(action) {
  try {
    let token = localStorage.getItem('giving_tree_jwt');
    yield call(Api.markSeen, action.payload.env, action.payload.type, token);

    yield put({
      type: ACTION_TYPE.SEEN_SUBMIT_TUTORIAL_SUCCESS
    });
  } catch (error) {
    console.log('error: ', error);
    yield put({ type: ACTION_TYPE.SEEN_SUBMIT_TUTORIAL_FAILURE, payload: error });
  }
}

export default function* watchUserSagas() {
  yield takeLatest(ACTION_TYPE.SUBMIT_DRAFT_REQUESTED, submitDraft);
  yield takeLatest(ACTION_TYPE.UPLOAD_PHOTO_REQUESTED, uploadPhoto);
  yield takeLatest(ACTION_TYPE.GET_DRAFT_REQUESTED, getDraft);
  yield takeLatest(ACTION_TYPE.SAVE_DRAFT_REQUESTED, saveDraft);
  yield takeLatest(ACTION_TYPE.PATCH_POST_REQUESTED, patchPost);
  yield takeLatest(ACTION_TYPE.PUBLISH_POST_REQUESTED, publishPost);
  yield takeLatest(ACTION_TYPE.SEEN_SUBMIT_TUTORIAL_REQUESTED, markSeen);
}
