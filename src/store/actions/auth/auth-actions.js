import ACTION_TYPE from './action-types';

/**
 * @function
 * @name login
 * @param { object } payload - log in
 */
export const login = payload => ({
  type: ACTION_TYPE.LOGIN_REQUESTED,
  payload
});

export const refreshItem = payload => ({
  type: ACTION_TYPE.REFRESH_ITEM_REQUESTED,
  payload
});

export const claimTask = payload => ({
  type: ACTION_TYPE.CLAIM_TASK_REQUESTED,
  payload
});

export const unclaimTask = payload => ({
  type: ACTION_TYPE.UNCLAIM_TASK_REQUESTED,
  payload
});

export const completeTask = payload => ({
  type: ACTION_TYPE.COMPLETE_TASK_REQUESTED,
  payload
});

export const upvote = payload => ({
  type: ACTION_TYPE.UPVOTE_REQUESTED,
  payload
});

export const downvote = payload => ({
  type: ACTION_TYPE.DOWNVOTE_REQUESTED,
  payload
});

export const loadUser = payload => ({
  type: ACTION_TYPE.LOAD_USER_REQUESTED,
  payload
});

export const initiateReset = payload => ({
  type: ACTION_TYPE.INITIATE_RESET_REQUESTED,
  payload
});

export const updateProfile = payload => ({
  type: ACTION_TYPE.UPDATE_PROFILE_REQUESTED,
  payload
});

export const addToNotifications = payload => ({
  type: ACTION_TYPE.ADD_NOTIFICATIONS_REQUESTED,
  payload
});

export const clearAllNotifications = payload => ({
  type: ACTION_TYPE.CLEAR_NOTIFICATIONS_REQUESTED,
  payload
});

export const markSeen = payload => ({
  type: ACTION_TYPE.MARK_SEEN_REQUESTED,
  payload
});

export const confirmPassword = payload => ({
  type: ACTION_TYPE.CONFIRM_PASSWORD_REQUESTED,
  payload
});

export const addComment = payload => ({
  type: ACTION_TYPE.ADD_COMMENT_REQUESTED,
  payload
});

export const addReply = payload => ({
  type: ACTION_TYPE.ADD_REPLY_REQUESTED,
  payload
});

export const deleteComment = payload => ({
  type: ACTION_TYPE.DELETE_COMMENT_REQUESTED,
  payload
});

export const editComment = payload => ({
  type: ACTION_TYPE.EDIT_COMMENT_REQUESTED,
  payload
});

export const loadNewsfeed = payload => ({
  type: ACTION_TYPE.LOAD_NEWSFEED_REQUESTED,
  payload
});

export const selectMenu = payload => ({
  type: ACTION_TYPE.SELECT_MENU_REQUESTED,
  payload
});

export const getLeaderboard = payload => ({
  type: ACTION_TYPE.GET_LEADERBOARD_REQUESTED,
  payload
});

export const getCurrentUser = payload => ({
  type: ACTION_TYPE.GET_CURRENT_USER_REQUESTED,
  payload
});

/**
 * @function
 * @name register
 * @param { object } payload - register
 */
export const register = payload => ({
  type: ACTION_TYPE.REGISTER_REQUESTED,
  payload
});

export const loadPost = payload => ({
  type: ACTION_TYPE.LOAD_POST_REQUESTED,
  payload
});

export const deletePost = payload => ({
  type: ACTION_TYPE.DELETE_POST_REQUESTED,
  payload
});

export const follow = payload => ({
  type: ACTION_TYPE.FOLLOW_REQUESTED,
  payload
});

export const unfollow = payload => ({
  type: ACTION_TYPE.UNFOLLOW_REQUESTED,
  payload
});

/**
 * @function
 * @name logout - restores reducer to original state
 */
export const logout = payload => ({
  type: ACTION_TYPE.LOGOUT_REQUESTED,
  payload
});

export const logoutAll = payload => ({
  type: ACTION_TYPE.LOGOUT_ALL_REQUESTED,
  payload
});

export const loadStats = payload => ({
  type: ACTION_TYPE.LOAD_STATS_REQUESTED,
  payload
});
