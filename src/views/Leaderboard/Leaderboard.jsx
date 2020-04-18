/* eslint-disable */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Tabs, Tab } from 'baseui/tabs';
import Navigation from '../../components/Navigation';
import { geolocated } from 'react-geolocated';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';
import { connect } from 'react-redux';
import { hotjar } from 'react-hotjar';
import Sidebar from '../../components/Sidebar/Sidebar';

import {
  getCurrentUser,
  loadNewsfeed,
  claimTask,
  unclaimTask,
  completeTask,
  upvote,
  downvote,
  addComment,
  addReply,
  selectMenu,
  getLeaderboard
} from '../../store/actions/auth/auth-actions';
import HelpMenu from '../../components/HelpMenu';

function Leaderboard(props) {
  const {
    user, getCurrentUserDispatch, getLeaderboardDispatch, userRanking, 
    leaderboard
  } = props;

  const history = useHistory();
  const [activeKey, setActiveKey] = React.useState('0');

  let items = [];
  const authenticated = localStorage.getItem('giving_tree_jwt');
  const refresh = async () => {
    if (authenticated && !user.username) {
      await getCurrentUserDispatch({
        env: process.env.REACT_APP_NODE_ENV
      });
    }
  };

  React.useEffect(() => {
    hotjar.initialize('1751072', 6);
  }, []);

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

  function stringToHslColor(str, s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  const leaderboardJSX = () => {
    return leaderboard.length === 0 ? (
      <div className="text-center">no items in leaderboard</div>
    ) : (
      <table className="table-auto border-transparent" style={{ width: '99%' }}>
        <thead>
          <tr>
            <th
              className="px-4 py-2"
              style={{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '16px',
                lineHeight: '15px'
              }}
            >
              Rank
            </th>
            <th
              className="px-4 py-2 text-left"
              style={{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '16px',
                lineHeight: '15px'
              }}
            >
              Helper
            </th>
            <th
              className="px-4 py-2 text-left"
              style={{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '16px',
                lineHeight: '15px'
              }}
            >
              Karma
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((item, i) => (
            <tr className={i % 2 === 0 && `bg-white`}>
              <td
                className={`px-4 py-2 flex justify-center items-center`}
                style={{
                  fontSize: '14px',
                  lineHeight: '17px',
                  fontStyle: 'normal',
                  fontWeight: 'normal'
                }}
              >
                {getLeaderboardIcon(Number(i) + 1)}
              </td>
              <td
                onClick={() => history.push(`/user/${item.username}`)}
                className={`px-4 py-2 text-left hover:text-indigo-600 transition duration-150`}
                style={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  lineHeight: '17px',
                  fontStyle: 'normal',
                  fontWeight: 'normal'
                }}
              >
                <div className="flex items-center">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: `url(${generateHash(
                        item.username,
                        item.profileVersion
                      )}), url(https://d1ppmvgsdgdlyy.cloudfront.net/alphabet/${item.username[0].toUpperCase()}.svg), ${stringToHslColor(
                        item.username,
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
                  {item.username}
                </div>
              </td>
              <td
                className={`px-4 py-2`}
                style={{
                  fontSize: '14px',
                  lineHeight: '17px',
                  fontStyle: 'normal',
                  fontWeight: 'normal'
                }}
              >
                {item.karma}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  React.useEffect(() => {
    getLeaderboardDispatch({ env: process.env.REACT_APP_NODE_ENV, location: 'global' });
  }, []);

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

  return (
    <div>
      <Navigation searchBarPosition="center" />
      <div className="lg:max-w-4xl xl:max-w-screen-xl w-full mx-auto py-12 px-6">
        <div className="block xl:flex">
          <aside className="xl:pr-6 sidebar-wrapper">
            <Sidebar {...props} />
          </aside>
          <section className="w-full">
            <div className="leaderboard-heading mb-4" style={{ width: '80%' }}>
              Leaderboard
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center">
                <Tabs
                  overrides={{
                    Tab: {
                      style: {
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center'
                      }
                    },
                    Root: {
                      style: {
                        outline: 'none',
                        width: '80%',
                        margin: '0 auto'
                      }
                    },
                    TabBar: {
                      style: {
                        outline: 'none',
                        backgroundColor: 'white',
                        overflow: 'auto'
                      }
                    },
                    TabContent: {
                      style: {
                        outline: 'none',
                        color: '#059305'
                      }
                    }
                  }}
                  onChange={({ activeKey }) => {
                    setActiveKey(activeKey);
                  }}
                  activeKey={activeKey}
                >
                  <Tab
                    overrides={{
                      Tab: {
                        style: {
                          outline: 'none',
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: `${activeKey === '0' && '#059305'}`,
                          borderColor: `${activeKey === '0' && '#059305'}`
                        }
                      }
                    }}
                    title="Global"
                  ></Tab>
                  {/* <Tab
                    overrides={{
                      Tab: {
                        style: {
                          outline: 'none',
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: `${activeKey === '1' && '#059305'}`,
                          borderColor: `${activeKey === '1' && '#059305'}`
                        }
                      }
                    }}
                    disabled
                    title="SF (coming soon)"
                  ></Tab>
                  <Tab
                    overrides={{
                      Tab: {
                        style: {
                          outline: 'none',
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: `${activeKey === '2' && '#059305'}`,
                          borderColor: `${activeKey === '2' && '#059305'}`
                        }
                      }
                    }}
                    disabled
                    title="NYC (coming soon)"
                  ></Tab>
                  <Tab
                    overrides={{
                      Tab: {
                        style: {
                          outline: 'none',
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: `${activeKey === '3' && '#059305'}`,
                          borderColor: `${activeKey === '3' && '#059305'}`
                        }
                      }
                    }}
                    disabled
                    title="LA (coming soon)"
                  ></Tab> */}
                </Tabs>
              </div>
              <div className="mt-4" style={{ maxHeight: 550, overflow: 'auto' }}>
                {leaderboardJSX()}
              </div>
            </div>
          </section>
          
        </div>
      </div>
      <HelpMenu />
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  getCurrentUserDispatch: payload => dispatch(getCurrentUser(payload)),
  loadNewsfeedDispatch: payload => dispatch(loadNewsfeed(payload)),
  claimTaskDispatch: payload => dispatch(claimTask(payload)),
  unclaimTaskDispatch: payload => dispatch(unclaimTask(payload)),
  completeTaskDispatch: payload => dispatch(completeTask(payload)),
  upvoteDispatch: payload => dispatch(upvote(payload)),
  downvoteDispatch: payload => dispatch(downvote(payload)),
  addCommentDispatch: payload => dispatch(addComment(payload)),
  addReplyDispatch: payload => dispatch(addReply(payload)),
  selectMenuDispatch: payload => dispatch(selectMenu(payload)),
  getLeaderboardDispatch: payload => dispatch(getLeaderboard(payload))
});

const mapStateToProps = state => ({
  user: state.auth.user,
  newsfeed: state.auth.newsfeed,
  currentPage: state.auth.currentPage,
  selectMenu: state.auth.selectMenu,
  pages: state.auth.pages,
  numOfResults: state.auth.numOfResults,
  newsfeedSuccess: state.auth.newsfeedSuccess,
  newsfeedUpdated: state.auth.newsfeedUpdated,
  newsfeedLoading: state.auth.newsfeedLoading,
  userRanking: state.auth.userRanking,
  leaderboard: state.auth.leaderboard
});

Leaderboard.defaultProps = {};

Leaderboard.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(geolocated()(Leaderboard));
