import * as React from 'react';
import Media from 'react-media';

// Custom Components
import Navigation from '../../components/Navigation';
import Sidebar from '../../components/Sidebar/Sidebar';
import NewsfeedTable from '../NewsFeed/NewsfeedTable';
import LeaderboardTable from '../../components/LeaderboardTable/LeaderboardTable';
import LocationBar from '../../components/LocationBar';
import TaskCard from '../../components/TaskCard';
import HelpMenu from '../../components/HelpMenu';
import DeskopOnboarding from './components/DesktopOnboarding/DeskopOnboarding';
import MobileOnboarding from './components/MobileOnboarding/MobileOnboarding';

// Libraries
import { hotjar } from 'react-hotjar';
import { connect } from 'react-redux';
import { geolocated } from 'react-geolocated';
import { useHistory } from 'react-router-dom';

// Base UI
import { StatefulPopover, PLACEMENT } from 'baseui/popover';

import {
  getCurrentUser,
  loadNewsfeed,
  addComment,
  register,
  addReply,
  selectMenu,
  initiateReset,
  login
} from '../../store/actions/auth/auth-actions';

function NewsFeedPage(props) {
  const {
    user,
    loadNewsfeedDispatch,
    newsfeed,
    currentPage,
    pages,
    selectMenu,
    selectMenuDispatch,
    userRanking
  } = props;

  const history = useHistory();
  const [latLng, setLatLng] = React.useState({});
  const [address, setAddress] = React.useState('');
  const [updatedNews, setUpdateNews] = React.useState(false);
  const [openCustomAddress, setOpenCustomAddress] = React.useState(false);
  const [hasMoreItems, setHasMoreItems] = React.useState(true);
  const [newPost, setNewPost] = React.useState('');
  const [newsfeedSort, setSort] = React.useState('');
  const [newsfeedDictionary] = React.useState({});
  const authenticated = localStorage.getItem('giving_tree_jwt');
  const [news] = React.useState([]);
  const location = getLocation();
  const items = [];

  // Controls the "on login" modal
  const [onLoginIsOpen, setOnLoginIsOpen] = React.useState(true);

  // id dictates the type of feed
  let id = props.match.params ? props.match.params[0].toLowerCase() : '';

  if (true) {
    switch (id) {
      case '':
        if (newsfeedSort !== 'Home') {
          setSort('Home');
        }
        break;
      case 'discover':
        if (newsfeedSort !== 'Discover') {
          setSort('Discover');
          console.log('loading discover');
          loadNewsfeedDispatch({
            env: process.env.REACT_APP_NODE_ENV,
            page: Number(currentPage),
            location: location.latLng,
            feed: 'Discover'
          });
        }
        break;
      case 'ongoing':
        if (newsfeedSort !== 'Ongoing') {
          setSort('Ongoing');
          loadNewsfeedDispatch({
            env: process.env.REACT_APP_NODE_ENV,
            page: Number(currentPage),
            location: location.latLng,
            feed: 'Ongoing'
          });
        }
        break;
      // case 'completed':
      //   if (newsfeedSort !== 'Completed') {
      //     setSort('Completed');
      //     loadNewsfeedDispatch({
      //       env: process.env.REACT_APP_NODE_ENV,
      //       page: Number(currentPage),
      //       location: latLng,
      //       feed: 'Completed'
      //     });
      //   }
      //   break;
      // case 'global':
      //   if (newsfeedSort !== 'Global') {
      //     setSort('Global');
      //     loadNewsfeedDispatch({
      //       env: process.env.REACT_APP_NODE_ENV,
      //       page: Number(currentPage),
      //       feed: 'Global'
      //     });
      //   }
      //   break;
      case 'popular':
        if (newsfeedSort !== 'Popular') {
          setSort('Popular');
          loadNewsfeedDispatch({
            env: process.env.REACT_APP_NODE_ENV,
            page: Number(currentPage),
            feed: 'Popular'
          });
        }
        break;
      case 'newest':
        if (newsfeedSort !== 'Newest') {
          setSort('Newest');
          loadNewsfeedDispatch({
            env: process.env.REACT_APP_NODE_ENV,
            page: Number(currentPage),
            location: location.latLng,
            feed: 'Newest'
          });
        }
        break;
      default:
        break;
    }
  }

  /**
   * Retrieve the user's location from local storage
   * By default, set to Earth.
   */
  function getLocation() {
    // If there's a saved location, use it
    const loc = JSON.parse(localStorage.getItem('userLocation'));
    if (loc && loc.name) return loc;
    // If no location is saved, set the default state
    return {
      name: 'Earth 🌍',
      latLng: {
        lat: '',
        lng: ''
      }
    }  
  }

  // remove items
  const resetItems = () => {
    window.location = `/home/discover?lat=${latLng.lat}&lng=${latLng.lng}`; 
    // explicit lat and lng coordinates
  };

  async function loadNewsfeedHelper() {
    if (pages === '') {
    } else if (Number(currentPage) < Number(pages)) {
      let nextPage = Number(currentPage) + 1;
      await loadNewsfeedDispatch({
        env: process.env.REACT_APP_NODE_ENV,
        location: latLng,
        page: nextPage,
        feed: newsfeedSort
      });
      for (var j = 0; j < newsfeed.length; j++) {
        if (newsfeedDictionary[newsfeed[j]._id] === undefined) {
          news.push(newsfeed[j]);
          newsfeedDictionary[newsfeed[j]._id] = true;
        }
      }
    } else {
      setHasMoreItems(false);
      if (newsfeed) {
        for (var k = 0; k < newsfeed.length; k++) {
          if (newsfeedDictionary[newsfeed[k]._id] === undefined) {
            news.push(newsfeed[k]);
            newsfeedDictionary[newsfeed[k]._id] = true;
          }
        }
      }
    }
  }

  React.useEffect(() => {
    loadNewsfeedHelper();
    setUpdateNews(false);
  }, [updatedNews]);

  React.useEffect(() => {
    setLatLng(location.latLng); // initialize
    hotjar.initialize('1751072', 6);
  }, []);

  React.useEffect(() => {
    // if (props.match.url === '/home/discover') {
    //   loadNewsfeedDispatch({
    //     env: process.env.REACT_APP_NODE_ENV,
    //     page: Number(currentPage),
    //     location: location.latLng,
    //     feed: 'Discover'
    //   });
    // }
  }, [
    loadNewsfeedDispatch,
    currentPage, 
    latLng,  
    // !openCustomAddress,
    props.match.url
  ]);

  const render = () => {
    news.map((item, i) => {
      // If the user is viewing the 'discover' page...
      if (newsfeedSort === 'Discover') {
        const date = new Date();
        const expired = (date > new Date(item.dueDate));
        // Check the item is NOT expired, then add to array.
        if (!expired) {
          return items.push(
            <TaskCard item={item} key={i} user={user} className="mb-4"
            index={i} />
          );
        }
      } else {
        // if the user is viewing any other page, push all tasks to the array.
        return items.push(
          <TaskCard item={item} key={i} user={user} className="mb-4"
          index={i} />
        );
      }
    });
  };

  render();

  return (
    <React.Fragment>
      {/* Main Header & Navigation */}
      <Navigation selectMenuDispatch={selectMenuDispatch} />
      
      {/* If the user just logged in, show the modal */}
      {props.loginSuccess && 
        <Media
          queries={{
            xs: '(max-width: 414px)',
            sm: '(min-width: 415px) and (max-width: 767px)',
            md: '(min-width: 768px) and (max-width: 1023px)',
            lg: '(min-width: 1024px) and (max-width: 1279px)',
            xl: '(min-width: 1280px)'
          }}
        >
          {matches => {
            if (!matches.xs && !matches.sm) {
              return(
                <DeskopOnboarding 
                  history={history}
                  isOpen={onLoginIsOpen} 
                  setIsOpen={setOnLoginIsOpen} />
              );
            } else {
              return (
                <MobileOnboarding 
                  history={history}
                  show={onLoginIsOpen} 
                  setIsOpen={setOnLoginIsOpen} />
              );
            }
          }}
        </Media>
      }

      {/* Begin template for page layout */}
      <div 
        className="lg:max-w-4xl xl:max-w-screen-xl w-full mx-auto py-12 px-6">
        <div className="block xl:flex">
          <div className="xl:pr-6 sidebar-wrapper">
            <Sidebar {...props} />
          </div>
          <section className="w-full xl:px-6">
            <LocationBar className="mb-4" location={location} match={props.match} />
            <NewsfeedTable
              {...props}
              authenticated={authenticated}
              address={address}
              setNewPost={setNewPost}
              hasMoreItems={hasMoreItems}
              selectMenuDispatch={selectMenuDispatch}
              id={id}
              items={items}
              resetItems={resetItems}
              setOpenCustomAddress={setOpenCustomAddress}
              setAddress={setAddress}
              setLatLng={setLatLng}
              latLng={latLng}
              newPost={newPost}
              selectMenu={selectMenu}
              openCustomAddress={openCustomAddress}
              setUpdateNews={setUpdateNews}
            />
          </section>
          <section className="hidden xl:block xl:pl-6 w-full" style={{
            maxWidth: '344px'
          }}>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="text-left" style={{ fontWeight: 300 }}>
                  <div
                    style={{
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: 16,
                      lineHeight: '20px',
                      color: '#545454',
                      paddingTop: '0px'
                    }}
                    className={`mb-4`}
                  >
                    Leaderboard
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
                </div>
                <button
                  className="bg-transparent hover:bg-gray-600 text-gray-700 font-semibold hover:text-white py-1 px-3 border border-gray-600 hover:border-transparent transition duration-150 rounded"
                  style={{ outline: 'none' }}
                  onClick={() => history.push('/leaderboard')}
                >
                  <span style={{ fontSize: 12 }}>See full list</span>
                </button>
              </div>
              <div className="mt-4">
                <LeaderboardTable limit={10} />
              </div>
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
                      <div className="bg-white rounded-lg p-5 shadow-lg"
                        style={{
                          maxWidth: 375,
                          fontSize: 12
                        }}>
                        <p className="text-hlgreen font-semibold mb-2">
                          How does Karma on Giving Tree work?
                        </p>

                        <p className="mb-1">You receive two Karma points for every request 
                          you complete. </p>

                        <p className="mb-1">You also accumulate Karma points when other users 
                          upvote your completed requests. Upvotes you receive 
                          from users with higher Karma have a greater influence 
                          on your Karma points.</p>

                        <p className="mb-1">Have feedback on our Karma system? 
                          <a href="mailto:givingtree@gmail.com"
                            className="ml-2 text-hlgreen">Email us</a>
                        </p>
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
                      <span className="font-bold hover:text-blue-600 transition duration-150">
                        Find out how
                      </span>
                    </div>
                  </StatefulPopover>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <HelpMenu user={user} />  
    </React.Fragment>
  );
}

const mapDispatchToProps = dispatch => ({
  getCurrentUserDispatch: payload => dispatch(getCurrentUser(payload)),
  loadNewsfeedDispatch: payload => dispatch(loadNewsfeed(payload)),
  signupDispatch: payload => dispatch(register(payload)),
  addCommentDispatch: payload => dispatch(addComment(payload)),
  addReplyDispatch: payload => dispatch(addReply(payload)),
  selectMenuDispatch: payload => dispatch(selectMenu(payload)),
  loginDispatch: payload => dispatch(login(payload)),
  initiateResetDispatch: payload => dispatch(initiateReset(payload))
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
  errorMessage: state.auth.errorMessage,
  registerLoading: state.auth.registerLoading,
  registerSuccess: state.auth.registerSuccess,
  registerFailure: state.auth.registerFailure,
  isRegistered: state.auth.isRegistered,
  loginLoading: state.auth.loginLoading,
  loginSuccess: state.auth.loginSuccess,
  loginFailure: state.auth.loginFailure,
  initiateResetSuccess: state.auth.initiateResetSuccess
});

export default connect(mapStateToProps, mapDispatchToProps)(geolocated()(NewsFeedPage));
