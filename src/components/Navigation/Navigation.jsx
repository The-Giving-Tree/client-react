import * as React from 'react';
import Constants from '../Constants';
import { useHistory, Link } from 'react-router-dom';
import { StatefulMenu, OptionProfile } from 'baseui/menu';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';
import {
  logout,
  getCurrentUser,
  addToNotifications,
  clearAllNotifications,
  selectMenu
} from '../../store/actions/auth/auth-actions';
import { search } from '../../store/actions/global/global-actions';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import { subscribeToNotifications } from '../../utils/socket';
import moment from 'moment';

import { connect } from 'react-redux';

import { ReactComponent as IconSearch } from '../../assets/icons/search.svg';
import {
  ReactComponent as LogoFull 
} from '../../assets/logos/tgt-text-and-logo-beta.svg';
import {
  ReactComponent as LogoIcon
} from '../../assets/logos/tgt-icon-only-beta.svg';
import {
  ReactComponent as IconGuidelines
} from '../../assets/icons/Guidelines.svg';

import './Navigation.css';
import ModalLoginSignUp from '../Modals/LoginSignUp/ModalLoginSignUp';


function Navigation(props) {
  const {
    user,
    logoutDispatch,
    getCurrentUserDispatch,
    addToNotificationsDispatch,
    searchResults,
    selectMenuDispatch,
    searchLoading,
    clearAllNotificationsDispatch,
    searchDispatch
  } = props;

  require('dotenv').config();

  const history = useHistory();
  const [showSearch, setShowSearch] = React.useState(false);

  let searchInp;

  // Detects when mouse is clicked outside of search results
  const [shouldCloseSearchResults, setShouldCloseSearchResults] = React.useState(false);
  function useOutsideDetector(ref) {
    React.useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShouldCloseSearchResults(true);
        }
      }

      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  /**
   * Wrapper around search results that detects when mouse clicks outside
   */
  function OutsideDetector(props) {
    const wrapperRef = React.useRef(null);
    useOutsideDetector(wrapperRef);

    return <div ref={wrapperRef}>{props.children}</div>;
  }

  const authenticated = localStorage.getItem('giving_tree_jwt');

  React.useEffect(() => {
    subscribeToNotifications(user._id, (err, notification) =>
      addToNotificationsDispatch(notification)
    );
  }, [user._id, addToNotificationsDispatch]);

  React.useEffect(() => {
    console.log('updated notification');
  }, [props.markSeen, props.updatedUser]);

  const refresh = async () => {
    if (authenticated && !user.username) {
      await getCurrentUserDispatch({
        env: process.env.NODE_ENV
      });
    }
  };

  refresh();

  let notifications = user.notifications || [];

  const [isOpen, setIsOpen] = React.useState(false);

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

  function sanitize(str) {
    let half = str.replace(new RegExp('<em>', 'g'), '');
    let whole = half.replace(new RegExp('</em>', 'g'), '');
    return whole;
  }

  function generateHash(username = '', version) {
    const secret = 'givingtree';
    const hash = require('crypto')
      .createHmac('sha256', secret)
      .update(username.toLowerCase())
      .digest('hex');

    const suffix = Number(version) === 0 || !version ? '' : `%3Fver%3D${version}`;
    const url = `https://d1ppmvgsdgdlyy.cloudfront.net/user/${hash}${suffix}`;
    return url;
  }

  const notificationMenu = close => {
    let labels = [];

    let actionLegend = {
      Upvote: 'upvoted',
      Complete: 'completed',
      Claim: 'claimed',
      Unclaim: 'unclaimed',
      Downvote: 'downvoted',
      Comment: 'commented on',
      Reply: 'replied to',
      'New Post': 'published a new post',
      Update: 'edited their reply to'
    };

    for (var i = 0; i < notifications.length; i++) {
      try {
        let newObj = {
          label: `${notifications[i].from.username} ${actionLegend[notifications[i].action]}${
            notifications[i].action !== 'New Post'
              ? ' your ' + notifications[i].postId.type.toLowerCase()
              : ''
          }`,
          subText: notifications[i].postId.content,
          timeStamp: moment(notifications[i].postId.createdAt).format('MMM D, YYYY h:mm A'),
          postId: (notifications[i].postId.type.toLowerCase() === 'comment') ? notifications[i].postId.parentId : notifications[i].postId.postId,
          imgUrl: notifications[i].from.profilePictureUrl
        };
        labels.push(newObj);
      } catch(e) {}
    }

    // only show when there are notifications
    if (notifications.length > 0) {
      labels.unshift({
        label: 'Clear All Notifications'
      });
    }

    return (
      <StatefulMenu
        noResultsMsg="No Notifications"
        items={labels}
        onItemSelect={item => {
          close();
          if (item.item.label === 'Clear All Notifications') {
            clearAllNotificationsDispatch({ env: process.env.NODE_ENV });
          } else {
            history.push(`/post/${item.item.postId}/?user=${user._id}`);
          }
        }}
        overrides={{
          List: { style: { width: '400px', outline: 'none', maxHeight: '550px' } },
          ProfileImgContainer: { style: { height: '32px', width: '32px' } },
          ListItemProfile: { style: { display: 'flex', alignContent: 'center' } },
          ProfileLabelsContainer: { style: { display: 'flex', alignContent: 'center' } },
          Option: {
            component: OptionProfile,
            props: {
              getProfileItemLabels: ({ label, timeStamp, subText }) => ({
                title: shorten(20, subText),
                subtitle: label,
                body: timeStamp
              }),
              getProfileItemImg: item => item.imgUrl,
              getProfileItemImgText: item => item.label
            }
          }
        }}
      />
    );
  };

  function stringToHslColor(str = 'a', s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  // If the user IS logged in, display this nav...
  if (authenticated) {
    return (
      <header className="Navigation flex items-center justify-start px-6 py-1 bg-white relative shadow-md">
        
        {/* Main logo */}
        <button className="mr-auto" onClick={() => {
          const url = (authenticated) ? '/home/discover' : '/';
          window.location = url;
        }}>
          <LogoFull className="hidden sm:inline-block h-10" />
          <LogoIcon className="inline-block sm:hidden w-10 h-10" />
        </button>

        {/* Search bar */}
        <div className="hidden sm:block max-w-md ml-auto px-5 w-full">
          <div className="search-wrapper relative">
            <div className={`overflow-hidden ${showSearch ? 'w-full' : 'w-0'}
            rounded-full bg-gray-200`}>
              <input placeholder="Search..."
              ref={(inp) => searchInp = inp }
              className="bg-transparent px-3 py-2 w-full outline-none"
              onChange={(e) => {
                searchDispatch({ env: process.env.NODE_ENV, query: e.target.value });
                setShouldCloseSearchResults(false);
              }} />
              {searchResults.length !== 0 && !shouldCloseSearchResults && (
                <OutsideDetector>
                  <StatefulMenu
                    overrides={{
                      List: {
                        style: {
                          outline: 'none',
                          padding: '0px',
                          position: 'absolute',
                          width: '100%',
                          maxHeight: '400px',
                          borderBottomLeftRadius: '25px',
                          borderBottomRightRadius: '25px',
                          zIndex: 100
                        }
                      },
                      ProfileImgContainer: { style: { height: '32px', width: '32px' } },
                      ListItemProfile: {
                        style: { display: 'flex', alignContent: 'center' }
                      },
                      ProfileLabelsContainer: {
                        style: { display: 'flex', alignContent: 'center' }
                      },
                      Option: {
                        component: OptionProfile,
                        props: {
                          getProfileItemLabels: ({ username, label, name, title, type }) => ({
                            title: username,
                            subtitle: (
                              <div style={{ display: 'inline' }}>
                                ...{sanitize(label.split('<em>')[0])}
                                <div style={{ backgroundColor: '#FFFF00', display: 'inline' }}>
                                  {sanitize(label.split('<em>')[1].split('</em>')[0])}
                                </div>
                                {sanitize(label.split('</em>')[1])}...
                              </div>
                            ),
                            body: type === 'post' ? title : name
                          }),
                          getProfileItemImg: item => item.image,
                          getProfileItemImgText: item => (
                            <div>
                              {item.label.replace('<em>', '<strong>').replace('</em>', '</strong>')}
                            </div>
                          )
                        }
                      }
                    }}
                    items={searchResults}
                    noResultsMsg="No Results"
                    onItemSelect={item => {
                      setShouldCloseSearchResults(true);
                      history.push(
                        item.item.type === 'post'
                          ? `/post/${item.item._id}`
                          : item.item.type === 'user'
                          ? `/user/${item.item.username}`
                          : ''
                      );
                    }}
                  />
                </OutsideDetector>
              )}
              {searchLoading && <div className="loading-spinner absolute"></div>}
            </div>
            
            <button className="p-2 absolute right-0 btn-show-search"
            onClick={() => {
              setShowSearch(!showSearch);
              searchInp.focus();
            }}>
              <IconSearch className="inline-block w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Submit Link */}
        <Link
          className="mr-5 h-6 w-6 inline-block flex-shrink-0"
          to={Constants.PATHS.SUBMIT}
          onClick={() => {
            selectMenuDispatch({ selectMenu: '' });
            window.location = Constants.PATHS.SUBMIT;
          }}
        >
          <img 
            src="https://d1ppmvgsdgdlyy.cloudfront.net/submit.svg"
            alt="document"
          />
        </Link>

        {/* Guidelines Link */}
        <Link
          className="hidden md:block mr-5 h-6 w-6 inline-block flex-shrink-0"
          to={Constants.PATHS.GUIDELINES}
          onClick={() => history.push(Constants.PATHS.GUIDELINES)}
        >
          <IconGuidelines />
        </Link>

        {/* Notifications */}
        <StatefulPopover
          placement={PLACEMENT.bottomLeft}
          content={({ close }) => notificationMenu(close)}
        >
          <div
            className="flex items-center mr-5 h-6 w-6 inline-block flex-shrink-0"
            style={{
              cursor: 'pointer',
              height: 40
            }}
          >
            <img
              src="https://d1ppmvgsdgdlyy.cloudfront.net/notification.svg"
              alt="notification" />
            {notifications.length > 0 && (
              <div style={{ marginLeft: -10, marginRight: 20 }}>
                <NotificationBadge count={notifications.length} effect={Effect.SCALE} />
              </div>
            )}
          </div>
        </StatefulPopover>

        {/* User profile */}
        <StatefulPopover
          placement={PLACEMENT.bottomLeft}
          content={({ close }) => (
            <StatefulMenu
              items={[
                {
                  label: 'My Profile',
                  icon: 'https://d1ppmvgsdgdlyy.cloudfront.net/user.svg'
                },
                // {
                //   label: 'Settings',
                //   icon: 'https://d1ppmvgsdgdlyy.cloudfront.net/setting.svg'
                // },
                {
                  label: 'Log Out',
                  icon: 'https://d1ppmvgsdgdlyy.cloudfront.net/logout.svg'
                }
              ]}
              onItemSelect={item => {
                close();
                switch (item.item.label) {
                  case 'My Profile':
                    history.push(`/user/${user.username}`);
                    break;
                  case 'Settings':
                    history.push(`/settings`);
                    break;
                  case 'Log Out':
                    logoutDispatch({
                      env: process.env.NODE_ENV
                    });
                    break;
                  default:
                    break;
                }
              }}
              overrides={{
                List: { style: { width: '213px', outline: 'none' } }
              }}
            />
          )}
        >
          <div className="flex-shrink-0">
            <div
              className="profilePic flex items-center lg:hidden"
              style={{
                width: 32,
                height: 32,
                background: `url(${generateHash(
                  user.username,
                  user.profileVersion
                )}), url(https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${user.username &&
                  user.username[0].toUpperCase()}.svg), ${stringToHslColor(user.username, 80, 45)}`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: '50%',
                cursor: 'pointer',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div
              className="hidden lg:flex items-center px-4 py-2 rounded-full 
              bg-gray-200"
            >
              <div
                className="profilePic"
                style={{
                  width: 32,
                  height: 32,
                  background: `url(${generateHash(
                    user.username,
                    user.profileVersion
                  )}), url(https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${user.username &&
                    user.username[0].toUpperCase()}.svg), ${stringToHslColor(
                    user.username,
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
              {user.username && user.username.length < 12 ? user.username : 'Profile'}
            </div>
          </div>
        </StatefulPopover>
      </header>
    );
  } else {
    // If the user is NOT logged in, display this nav...
    return (
      <header className="Navigation flex items-center justify-start px-6 py-1 
      bg-white z-10 shadow-md relative">
        <ModalLoginSignUp isOpen={isOpen} setIsOpen={setIsOpen} 
        type={`login`}/>
        {/* Main logo */}
        <button className="mr-auto" onClick={() => {
          const url = (authenticated) ? '/home/discover' : '/';
          window.location = url;
        }}>
          <LogoFull className="hidden sm:inline-block h-10" />
          <LogoIcon className="inline-block sm:hidden w-10 h-10" />
        </button>
        <div className="ml-auto flex items-center justify-end">
          {/* How it works */}
          <Link to={Constants.PATHS.HOWITWORKS}
          className="mr-6 hidden sm:inline" onClick={() => {
            history.push(Constants.PATHS.HOWITWORKS)
          }}>
            How it works
          </Link>
          {/* Guidelines button */}
          <Link
            className="mr-3 bg-transparent hover:bg-red-500 
            text-red-700 font-semibold hover:text-white py-1 px-6 border 
            border-red-500 hover:border-transparent rounded"
            to={Constants.PATHS.GUIDELINES}
            onClick={() => history.push(Constants.PATHS.GUIDELINES)}
          >
            Safety
          </Link>

          {/* Login link */}
          <button className="bg-transparent bg-green-700 text-white font-semibold 
          hover:bg-green-900 px-6 py-1 rounded" onClick={() => setIsOpen(true)}>
            Login
          </button>
        </div>
      </header>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logoutDispatch: payload => dispatch(logout(payload)),
  getCurrentUserDispatch: payload => dispatch(getCurrentUser(payload)),
  addToNotificationsDispatch: payload => dispatch(addToNotifications(payload)),
  clearAllNotificationsDispatch: payload => dispatch(clearAllNotifications(payload)),
  searchDispatch: payload => dispatch(search(payload)),
  selectMenuDispatch: payload => dispatch(selectMenu(payload))
});

const mapStateToProps = state => ({
  user: state.auth.user,
  userLoggedIn: state.auth.userLoggedIn,
  loggingOut: state.auth.loggingOut,
  markSeen: state.auth.markSeen,
  updatedUser: state.auth.updatedUser,
  searchResults: state.global.searchResults,
  searchLoading: state.global.searchLoading
});

Navigation.defaultProps = {
  searchBarPosition: 'left'
};

Navigation.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
