const ACTION_TYPE = {
  REGISTER_REQUESTED: 'REGISTER_REQUESTED',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',

  GET_CURRENT_USER_REQUESTED: 'GET_CURRENT_USER_REQUESTED',
  GET_CURRENT_USER_SUCCESS: 'GET_CURRENT_USER_SUCCESS',
  GET_CURRENT_USER_FAILURE: 'GET_CURRENT_USER_FAILURE',

  LOAD_USER_REQUESTED: 'LOAD_USER_REQUESTED',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',

  UPVOTE_REQUESTED: 'UPVOTE_REQUESTED',
  UPVOTE_SUCCESS: 'UPVOTE_SUCCESS',
  UPVOTE_FAILURE: 'UPVOTE_FAILURE',

  UPDATE_PROFILE_REQUESTED: 'UPDATE_PROFILE_REQUESTED',
  UPDATE_PROFILE_SUCCESS: 'UPDATE_PROFILE_SUCCESS',
  UPDATE_PROFILE_FAILURE: 'UPDATE_PROFILE_FAILURE',

  CLEAR_NOTIFICATIONS_REQUESTED: 'CLEAR_NOTIFICATIONS_REQUESTED',
  CLEAR_NOTIFICATIONS_SUCCESS: 'CLEAR_NOTIFICATIONS_SUCCESS',
  CLEAR_NOTIFICATIONS_FAILURE: 'CLEAR_NOTIFICATIONS_FAILURE',

  ADD_NOTIFICATIONS_REQUESTED: 'ADD_NOTIFICATIONS_REQUESTED',
  ADD_NOTIFICATIONS_SUCCESS: 'ADD_NOTIFICATIONS_SUCCESS',
  ADD_NOTIFICATIONS_FAILURE: 'ADD_NOTIFICATIONS_FAILURE',

  MARK_SEEN_REQUESTED: 'MARK_SEEN_REQUESTED',
  MARK_SEEN_SUCCESS: 'MARK_SEEN_SUCCESS',
  MARK_SEEN_FAILURE: 'MARK_SEEN_FAILURE',

  INITIATE_RESET_REQUESTED: 'INITIATE_RESET_REQUESTED',
  INITIATE_RESET_SUCCESS: 'INITIATE_RESET_SUCCESS',
  INITIATE_RESET_FAILURE: 'INITIATE_RESET_FAILURE',

  CONFIRM_PASSWORD_REQUESTED: 'CONFIRM_PASSWORD_REQUESTED',
  CONFIRM_PASSWORD_SUCCESS: 'CONFIRM_PASSWORD_SUCCESS',
  CONFIRM_PASSWORD_FAILURE: 'CONFIRM_PASSWORD_FAILURE',

  ADD_COMMENT_REQUESTED: 'ADD_COMMENT_REQUESTED',
  ADD_COMMENT_SUCCESS: 'ADD_COMMENT_SUCCESS',
  ADD_COMMENT_FAILURE: 'ADD_COMMENT_FAILURE',

  ADD_REPLY_REQUESTED: 'ADD_REPLY_REQUESTED',
  ADD_REPLY_SUCCESS: 'ADD_REPLY_SUCCESS',
  ADD_REPLY_FAILURE: 'ADD_REPLY_FAILURE',

  EDIT_COMMENT_REQUESTED: 'EDIT_COMMENT_REQUESTED',
  EDIT_COMMENT_SUCCESS: 'EDIT_COMMENT_SUCCESS',
  EDIT_COMMENT_FAILURE: 'EDIT_COMMENT_FAILURE',

  DELETE_COMMENT_REQUESTED: 'DELETE_COMMENT_REQUESTED',
  DELETE_COMMENT_SUCCESS: 'DELETE_COMMENT_SUCCESS',
  DELETE_COMMENT_FAILURE: 'DELETE_COMMENT_FAILURE',

  FOLLOW_REQUESTED: 'FOLLOW_REQUESTED',
  UNFOLLOW_REQUESTED: 'UNFOLLOW_REQUESTED',
  FOLLOW_SUCCESS: 'FOLLOW_SUCCESS',
  UNFOLLOW_SUCCESS: 'UNFOLLOW_SUCCESS',
  FOLLOW_FAILURE: 'FOLLOW_FAILURE',
  UNFOLLOW_FAILURE: 'UNFOLLOW_FAILURE',

  SELECT_MENU_REQUESTED: 'SELECT_MENU_REQUESTED',

  CLAIM_TASK_REQUESTED: 'CLAIM_TASK_REQUESTED',
  CLAIM_TASK_SUCCESS: 'CLAIM_TASK_SUCCESS',
  CLAIM_TASK_FAILURE: 'CLAIM_TASK_FAILURE',

  GET_LEADERBOARD_REQUESTED: 'GET_LEADERBOARD_REQUESTED',
  GET_LEADERBOARD_SUCCESS: 'GET_LEADERBOARD_SUCCESS',
  GET_LEADERBOARD_FAILURE: 'GET_LEADERBOARD_FAILURE',

  UNCLAIM_TASK_REQUESTED: 'UNCLAIM_TASK_REQUESTED',
  UNCLAIM_TASK_SUCCESS: 'UNCLAIM_TASK_SUCCESS',
  UNCLAIM_TASK_FAILURE: 'UNCLAIM_TASK_FAILURE',

  COMPLETE_TASK_REQUESTED: 'COMPLETE_TASK_REQUESTED',
  COMPLETE_TASK_SUCCESS: 'COMPLETE_TASK_SUCCESS',
  COMPLETE_TASK_FAILURE: 'COMPLETE_TASK_FAILURE',

  LOAD_POST_REQUESTED: 'LOAD_POST_REQUESTED',
  LOAD_POST_SUCCESS: 'LOAD_POST_SUCCESS',
  LOAD_POST_FAILURE: 'LOAD_POST_FAILURE',

  DELETE_POST_REQUESTED: 'DELETE_POST_REQUESTED',
  DELETE_POST_SUCCESS: 'DELETE_POST_SUCCESS',
  DELETE_POST_FAILURE: 'DELETE_POST_FAILURE',

  REFRESH_ITEM_REQUESTED: 'REFRESH_ITEM_REQUESTED',
  REFRESH_ITEM_SUCCESS: 'REFRESH_ITEM_SUCCESS',
  REFRESH_ITEM_FAILURE: 'REFRESH_ITEM_FAILURE',

  DOWNVOTE_REQUESTED: 'DOWNVOTE_REQUESTED',
  DOWNVOTE_SUCCESS: 'DOWNVOTE_SUCCESS',
  DOWNVOTE_FAILURE: 'DOWNVOTE_FAILURE',

  LOAD_NEWSFEED_REQUESTED: 'LOAD_NEWSFEED_REQUESTED',
  LOAD_NEWSFEED_SUCCESS: 'LOAD_NEWSFEED_SUCCESS',
  LOAD_NEWSFEED_FAILURE: 'LOAD_NEWSFEED_FAILURE',

  LOGIN_REQUESTED: 'LOGIN_REQUESTED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',

  LOGOUT_ALL_REQUESTED: 'LOGOUT_ALL_REQUESTED',
  LOGOUT_REQUESTED: 'LOGOUT_REQUESTED',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'LOGOUT_FAILURE',

  LOAD_STATS_REQUESTED: 'LOAD_STATS_REQUESTED',
  LOAD_STATS_SUCCESS: 'LOAD_STATS_SUCCESS',
  LOAD_STATS_FAILURE: 'LOAD_STATS_FAILURE',

  SET_ACCESS_TOKEN: 'SET_ACCESS_TOKEN'
};

export default ACTION_TYPE;
