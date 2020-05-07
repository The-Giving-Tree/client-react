import ACTION_TYPES from '../actions/user/action-types';

const initialState = {
  submittedPost: {},
  submitPostLoading: false,
  submitPostSuccess: false,
  submitPostFailure: false,
  getDraftLoading: false,
  getDraftSuccess: false,
  getDraftFailure: false,
  saveDraftLoading: false,
  saveDraftSuccess: false,
  saveDraftFailure: false,
  submittedDraft: {},
  submitDraftLoading: false,
  submitDraftSuccess: false,
  submitDraftFailure: false,

  uploadPhotoLoading: false,
  uploadPhotoSuccess: false,
  uploadPhotoFailure: false,
  uploadPhotoUrl: '',

  markSeenSubmitTutorial: false,
  errorMessage: ''
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SUBMIT_DRAFT_REQUESTED:
      return Object.assign({}, state, {
        submitDraftLoading: true,
        submitDraftSuccess: false,
        submitDraftFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPES.SUBMIT_DRAFT_SUCCESS:
      return Object.assign({}, state, {
        submitDraftLoading: false,
        submitDraftSuccess: true,
        submittedDraft: action.payload.submittedDraft
      });
    case ACTION_TYPES.SUBMIT_DRAFT_FAILURE:
      return Object.assign({}, state, {
        submitDraftLoading: false,
        submitDraftFailure: true,
        errorMessage: action.payload.message
      });

    case ACTION_TYPES.UPLOAD_PHOTO_REQUESTED:
      return Object.assign({}, state, {
        uploadPhotoLoading: true,
        uploadPhotoSuccess: false,
        uploadPhotoFailure: false,
        uploadPhotoUrl: '',
        errorMessage: ''
      });
    case ACTION_TYPES.UPLOAD_PHOTO_SUCCESS:
      return Object.assign({}, state, {
        uploadPhotoLoading: false,
        uploadPhotoSuccess: true,
        uploadPhotoFailure: false,
        uploadPhotoUrl: action.payload.url,
        errorMessage: ''
      });
    case ACTION_TYPES.UPLOAD_PHOTO_FAILURE:
      return Object.assign({}, state, {
        uploadPhotoLoading: false,
        uploadPhotoSuccess: false,
        uploadPhotoFailure: true,
        uploadPhotoUrl: '',
        errorMessage: action.payload.message
      });

    case ACTION_TYPES.GET_DRAFT_REQUESTED:
      return Object.assign({}, state, {
        getDraftLoading: true,
        getDraftSuccess: false,
        getDraftFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPES.GET_DRAFT_SUCCESS:
      return Object.assign({}, state, {
        getDraftLoading: false,
        getDraftSuccess: true,
        submittedDraft: action.payload.foundDraft
      });
    case ACTION_TYPES.GET_DRAFT_FAILURE:
      return Object.assign({}, state, {
        getDraftLoading: false,
        getDraftFailure: true,
        errorMessage: action.payload.message
      });

    case ACTION_TYPES.SAVE_DRAFT_REQUESTED:
      return Object.assign({}, state, {
        saveDraftLoading: true,
        saveDraftSuccess: false,
        saveDraftFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPES.SAVE_DRAFT_SUCCESS:
      return Object.assign({}, state, {
        saveDraftLoading: false,
        saveDraftSuccess: true,
        submittedDraft: action.payload.submittedDraft
      });
    case ACTION_TYPES.SAVE_DRAFT_FAILURE:
      return Object.assign({}, state, {
        saveDraftLoading: false,
        saveDraftFailure: true,
        errorMessage: action.payload.message
      });
    
    /**
     * Update existing post with new data
     */
    case ACTION_TYPES.PATCH_POST_REQUESTED:
      return Object.assign({}, state, {
        patchPostLoading: true,
        patchPostSuccess: false,
        patchPostFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPES.PATCH_POST_SUCCESS:
      return Object.assign({}, state, {
        patchPostLoading: false,
        patchPostSuccess: true,
        submittedPost: action.payload.data
      });
    case ACTION_TYPES.PATCH_POST_FAILURE:
      return Object.assign({}, state, {
        patchPostLoading: false,
        patchPostFailure: true,
        errorMessage: action.payload.message
      });


    case ACTION_TYPES.PUBLISH_POST_REQUESTED:
      return Object.assign({}, state, {
        submitPostLoading: true,
        submitPostSuccess: false,
        submitPostFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPES.PUBLISH_POST_SUCCESS:
      return Object.assign({}, state, {
        submitPostLoading: false,
        submitPostSuccess: true,
        submittedPost: action.payload.submittedPost
      });
    case ACTION_TYPES.PUBLISH_POST_FAILURE:
      return Object.assign({}, state, {
        submitPostLoading: false,
        submitPostFailure: true,
        errorMessage: action.payload.message
      });
    case ACTION_TYPES.SEEN_SUBMIT_TUTORIAL_SUCCESS:
      return Object.assign({}, state, {
        markSeenSubmitTutorial: true
      });

    default:
      return state;
  }
};

export default user;
