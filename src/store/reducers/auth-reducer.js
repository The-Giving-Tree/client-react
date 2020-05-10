import ACTION_TYPE from '../actions/auth/action-types';

const initialState = {
  user: {},
  foundUser: {},
  foundUserUpdated: false,
  foundPost: {},
  newsfeed: [],
  newsfeedUpdated: false,
  foundUserNull: false,
  updatedUser: false,
  currentPage: 1,
  pages: '',
  numOfResults: '',
  loadPostSuccess: false,
  newsfeedLoading: false,
  newsfeedSuccess: false,
  newsfeedFailure: false,
  userLoggedIn: false,
  isRegistered: false,
  errorMessage: '',
  loggingOut: false,
  loginLoading: false,
  loginSuccess: false,
  loginFailure: false,
  registerLoading: false,
  registerSuccess: false,
  registerFailure: false,
  errorObject: null,
  markSeen: false,
  markSeenFailure: false,

  initiateResetLoading: false,
  initiateResetSuccess: false,
  initiateResetFailure: false,

  confirmPasswordLoading: false,
  confirmPasswordSuccess: false,
  confirmPasswordFailure: false,

  updatedProfile: false,

  claimRequestLoading: false,
  claimRequestSuccess: false,
  claimRequestFailure: false,

  unclaimRequestLoading: false,
  unclaimRequestSuccess: false,
  unclaimRequestFailure: false,

  completeRequestLoading: false,
  completeRequestSuccess: false,
  completeRequestFailure: false,

  deletePostSuccess: false,

  selectMenu: '',
  title: '',
  leaderboard: [],
  userRanking: 0,
  loadLeaderboardLoading: false,
  loadLeaderboardSuccess: false,
  loadLeaderboardFailure: false,

  stats: {},
  loadingStats: false,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE.MARK_SEEN_SUCCESS:
      return Object.assign({}, state, {
        markSeen: true
      });
    case ACTION_TYPE.UPDATE_PROFILE_REQUESTED:
      return Object.assign({}, state, {
        updatedProfile: false,
        errorMessage: ''
      });
    case ACTION_TYPE.UPDATE_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        updatedProfile: true
      });
    case ACTION_TYPE.UPDATE_PROFILE_FAILURE:
      return Object.assign({}, state, {
        updatedProfile: false,
        errorMessage: action.payload.message
      });

    case ACTION_TYPE.GET_LEADERBOARD_REQUESTED:
      return Object.assign({}, state, {
        claimRequestLoading: true,
        claimRequestSuccess: false,
        claimRequestFailure: false
      });
    case ACTION_TYPE.GET_LEADERBOARD_SUCCESS:
      return Object.assign({}, state, {
        claimRequestLoading: false,
        claimRequestSuccess: true,
        claimRequestFailure: false,
        leaderboard: action.payload.leaderboard,
        userRanking: action.payload.userRanking
      });
    case ACTION_TYPE.GET_LEADERBOARD_FAILURE:
      return Object.assign({}, state, {
        claimRequestLoading: false,
        claimRequestSuccess: false,
        claimRequestFailure: true
      });

    case ACTION_TYPE.SELECT_MENU_REQUESTED:
      return Object.assign({}, state, {
        selectMenu: action.payload.selectMenu,
        title: action.payload.title
      });

    case ACTION_TYPE.CLAIM_REQUEST_REQUESTED:
      return Object.assign({}, state, {
        claimRequestLoading: true,
        claimRequestSuccess: false,
        claimRequestFailure: false
      });
    case ACTION_TYPE.CLAIM_REQUEST_SUCCESS:
      return Object.assign({}, state, {
        claimRequestLoading: false,
        claimRequestSuccess: true,
        claimRequestFailure: false
      });
    case ACTION_TYPE.CLAIM_REQUEST_FAILURE:
      return Object.assign({}, state, {
        claimRequestLoading: false,
        claimRequestSuccess: false,
        claimRequestFailure: true
      });

    case ACTION_TYPE.UNCLAIM_REQUEST_REQUESTED:
      return Object.assign({}, state, {
        unclaimRequestLoading: true,
        unclaimRequestSuccess: false,
        unclaimRequestFailure: false
      });
    case ACTION_TYPE.UNCLAIM_REQUEST_SUCCESS:
      return Object.assign({}, state, {
        unclaimRequestLoading: false,
        unclaimRequestSuccess: true,
        unclaimRequestFailure: false
      });
    case ACTION_TYPE.UNCLAIM_REQUEST_FAILURE:
      return Object.assign({}, state, {
        unclaimRequestLoading: false,
        unclaimRequestSuccess: false,
        unclaimRequestFailure: true
      });

    case ACTION_TYPE.COMPLETE_REQUEST_REQUESTED:
      return Object.assign({}, state, {
        completeRequestLoading: true,
        completeRequestSuccess: false,
        completeRequestFailure: false
      });
    case ACTION_TYPE.COMPLETE_REQUEST_SUCCESS:
      return Object.assign({}, state, {
        completeRequestLoading: false,
        completeRequestSuccess: true,
        completeRequestFailure: false
      });
    case ACTION_TYPE.COMPLETE_REQUEST_FAILURE:
      return Object.assign({}, state, {
        completeRequestLoading: false,
        completeRequestSuccess: false,
        completeRequestFailure: true
      });

    case ACTION_TYPE.CONFIRM_PASSWORD_REQUESTED:
      return Object.assign({}, state, {
        confirmPasswordLoading: true,
        confirmPasswordSuccess: false,
        confirmPasswordFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPE.INITIATE_RESET_REQUESTED:
      return Object.assign({}, state, {
        initiateResetLoading: true,
        initiateResetSuccess: false,
        initiateResetFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPE.CONFIRM_PASSWORD_SUCCESS:
      return Object.assign({}, state, {
        confirmPasswordLoading: false,
        confirmPasswordSuccess: true
      });
    case ACTION_TYPE.INITIATE_RESET_SUCCESS:
      return Object.assign({}, state, {
        initiateResetLoading: false,
        initiateResetSuccess: true
      });
    case ACTION_TYPE.CONFIRM_PASSWORD_FAILURE:
      return Object.assign({}, state, {
        confirmPasswordLoading: false,
        confirmPasswordSuccess: false,
        confirmPasswordFailure: true,
        errorMessage: action.payload.message
      });
    case ACTION_TYPE.INITIATE_RESET_FAILURE:
      return Object.assign({}, state, {
        initiateResetLoading: false,
        initiateResetSuccess: false,
        initiateResetFailure: true,
        errorMessage: action.payload.message
      });
    case ACTION_TYPE.LOAD_NEWSFEED_REQUESTED:
      return Object.assign({}, state, {
        newsfeedLoading: true,
        newsfeedSuccess: false,
        newsfeedFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPE.LOAD_USER_REQUESTED:
      return Object.assign({}, state, {
        loginLoading: true,
        loginSuccess: false,
        loginFailure: false,
        errorMessage: '',
        foundUserNull: false
      });
    case ACTION_TYPE.GET_CURRENT_USER_REQUESTED:
    case ACTION_TYPE.LOGIN_REQUESTED:
      return Object.assign({}, state, {
        loginLoading: true,
        loginSuccess: false,
        loginFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPE.ADD_COMMENT_REQUESTED:
    case ACTION_TYPE.ADD_REPLY_REQUESTED:
    case ACTION_TYPE.DELETE_COMMENT_REQUESTED:
    case ACTION_TYPE.UPVOTE_REQUESTED:
    case ACTION_TYPE.DOWNVOTE_REQUESTED:
    case ACTION_TYPE.EDIT_COMMENT_REQUESTED:
      return Object.assign({}, state, {
        errorMessage: '',
        newsfeedUpdated: false
      });
    case ACTION_TYPE.CLEAR_NOTIFICATIONS_REQUESTED:
    case ACTION_TYPE.ADD_NOTIFICATIONS_REQUESTED:
      return Object.assign({}, state, {
        updatedUser: false
      });
    case ACTION_TYPE.CLEAR_NOTIFICATIONS_FAILURE:
    case ACTION_TYPE.ADD_NOTIFICATIONS_FAILURE:
      return Object.assign({}, state, {
        updatedUser: false
      });
    case ACTION_TYPE.CLEAR_NOTIFICATIONS_SUCCESS: {
      let currentUser = state.user;
      currentUser.notifications = [];

      return Object.assign({}, state, {
        user: currentUser,
        updatedUser: true,
        errorMessage: ''
      });
    }
    case ACTION_TYPE.ADD_NOTIFICATIONS_SUCCESS: {
      let newNotification = action.action.payload;
      let currentUser = state.user;

      let currentIds = currentUser.notifications.map(map => map._id);
      if (!currentIds.includes(newNotification._id)) {
        currentUser.notifications.unshift(newNotification);
      }

      return Object.assign({}, state, {
        user: currentUser,
        updatedUser: true,
        errorMessage: ''
      });
    }
    case ACTION_TYPE.DELETE_COMMENT_SUCCESS: {
      let newsfeed = state.newsfeed;
      for (var i = 0; i < newsfeed.length; i++) {
        if (newsfeed[i]._id.toString() === action.payload.newItem._id.toString()) {
          // remove element
          newsfeed.splice(i, 1);
        }
      }
      return Object.assign({}, state, {
        newsfeed,
        newsfeedUpdated: true
      });
    }
    case ACTION_TYPE.EDIT_COMMENT_SUCCESS:
    case ACTION_TYPE.UPVOTE_SUCCESS:
    case ACTION_TYPE.DOWNVOTE_SUCCESS: {
      let newsfeed = state.newsfeed;
      for (var j = 0; j < newsfeed.length; j++) {
        if (newsfeed[j]._id.toString() === action.payload.newItem._id.toString()) {
          newsfeed[j] = action.payload.newItem;
        }
      }
      return Object.assign({}, state, {
        newsfeed,
        newsfeedUpdated: true
      });
    }
    case ACTION_TYPE.ADD_COMMENT_SUCCESS:
    case ACTION_TYPE.ADD_REPLY_SUCCESS: {
      return Object.assign({}, state, {
        newsfeedUpdated: true
      });
    }
    case ACTION_TYPE.MARK_SEEN_FAILURE:
      return Object.assign({}, state, {
        markSeenFailure: true
      });
    case ACTION_TYPE.ADD_COMMENT_FAILURE:
    case ACTION_TYPE.ADD_REPLY_FAILURE:
    case ACTION_TYPE.DELETE_COMMENT_FAILURE:
    case ACTION_TYPE.EDIT_COMMENT_FAILURE:
    case ACTION_TYPE.UPVOTE_FAILURE:
    case ACTION_TYPE.DOWNVOTE_FAILURE:
      return Object.assign({}, state, {
        errorMessage: action.payload
      });
    case ACTION_TYPE.FOLLOW_REQUESTED:
    case ACTION_TYPE.UNFOLLOW_REQUESTED:
      return Object.assign({}, state, {
        foundUserUpdated: false
      });

    case ACTION_TYPE.FOLLOW_SUCCESS:
    case ACTION_TYPE.UNFOLLOW_SUCCESS:
      return Object.assign({}, state, {
        foundUser: {
          ...state.foundUser,
          followers: action.payload.foundUser.followers
        },
        foundUserUpdated: true
      });

    case ACTION_TYPE.FOLLOW_FAILURE:
    case ACTION_TYPE.UNFOLLOW_FAILURE:
      return Object.assign({}, state, {
        errorMessage: action.payload.message
      });

    case ACTION_TYPE.LOAD_NEWSFEED_SUCCESS:
      return Object.assign({}, state, {
        newsfeed: action.payload.newsfeed,
        currentPage: action.payload.currentPage,
        pages: action.payload.pages,
        numOfResults: action.payload.numOfResults,
        newsfeedLoading: false,
        newsfeedSuccess: true,
        newsfeedFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPE.LOAD_POST_REQUESTED:
      return Object.assign({}, state, {
        loadPostSuccess: false,
        errorMessage: ''
      });
    case ACTION_TYPE.LOAD_POST_SUCCESS:
      return Object.assign({}, state, {
        loadPostSuccess: true,
        foundPost: action.payload.post,
        errorMessage: ''
      });
    case ACTION_TYPE.DELETE_POST_REQUESTED:
      return Object.assign({}, state, {
        deletePostSuccess: false,
        errorMessage: ''
      });
    case ACTION_TYPE.DELETE_POST_SUCCESS:
      return Object.assign({}, state, {
        deletePostSuccess: true,
        errorMessage: ''
      });
    case ACTION_TYPE.LOAD_USER_SUCCESS:
      return Object.assign({}, state, {
        foundUser: action.payload,
        loginLoading: false,
        loginSuccess: false,
        errorMessage: ''
      });
    case ACTION_TYPE.GET_CURRENT_USER_SUCCESS:
      return Object.assign({}, state, {
        user: action.payload,
        loginLoading: false,
        userLoggedIn: true,
        loginSuccess: false,
        errorMessage: ''
      });
    case ACTION_TYPE.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        user: action.payload,
        loginLoading: false,
        userLoggedIn: true,
        loginSuccess: true,
        errorMessage: ''
      });
    case ACTION_TYPE.LOAD_NEWSFEED_FAILURE:
      return Object.assign({}, state, {
        newsfeedLoading: false,
        newsfeedSuccess: false,
        newsfeedFailure: true,
        errorMessage: action.payload.message
      });
    case ACTION_TYPE.LOAD_USER_FAILURE:
      return Object.assign({}, state, {
        errorMessage: action.payload.message,
        foundUserNull: true
      });
    case ACTION_TYPE.LOAD_POST_FAILURE:
      return Object.assign({}, state, {
        loadPostSuccess: false,
        loadPostFailure: true,
        errorMessage: action.payload.message
      });
    case ACTION_TYPE.GET_CURRENT_USER_FAILURE:
    case ACTION_TYPE.LOGIN_FAILURE:
      return Object.assign({}, state, {
        loginLoading: false,
        loginSuccess: false,
        loginFailure: true,
        errorMessage: action.payload.message
      });
    case ACTION_TYPE.REGISTER_REQUESTED:
      return Object.assign({}, state, {
        registerLoading: true,
        registerSuccess: false,
        registerFailure: false,
        errorMessage: ''
      });
    case ACTION_TYPE.REGISTER_SUCCESS:
      return Object.assign({}, state, {
        user: action.payload,
        registerLoading: false,
        registerSuccess: true,
        loginSuccess: true,
        errorMessage: ''
      });
    case ACTION_TYPE.REGISTER_FAILURE:
      return Object.assign({}, state, {
        registerLoading: false,
        registerSuccess: false,
        registerFailure: true,
        errorMessage: action.payload.message,
        errorObject: action.payload.errors,
      });
    case ACTION_TYPE.LOGOUT_REQUESTED:
      return Object.assign({}, state, {
        loggingOut: true
      });
    case ACTION_TYPE.LOGOUT_SUCCESS:
      return Object.assign({}, state, initialState);
    case ACTION_TYPE.LOAD_STATS_REQUESTED:
      return Object.assign({}, state, {
        loadingStats: true
      });
    case ACTION_TYPE.LOAD_STATS_SUCCESS:
      return Object.assign({}, state, {
        stats: action.payload,
        loadingStats: false
      });
    
    default:
      return state;
  }
};

export default auth;
