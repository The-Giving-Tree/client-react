/* eslint-disable */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Navigation from './Navigation/Navigation';
import Footer from './Footer/Footer';
import { geolocated } from 'react-geolocated';
import { connect } from 'react-redux';
import { hotjar } from 'react-hotjar';
import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller
} from 'react-scroll';

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
} from '../store/actions/auth/auth-actions';

function Guidelines(props) {
  const { 
    user, getCurrentUserDispatch, getLeaderboardDispatch
  } = props;

  const history = useHistory();
  const [activeKey, setActiveKey] = React.useState('0');

  let items = [];
  const authenticated = localStorage.getItem('giving_tree_jwt');
  const refresh = async () => {
    if (authenticated && !user.username) {
      await getCurrentUserDispatch({
        env: process.env.NODE_ENV
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

  React.useEffect(() => {
    getLeaderboardDispatch({ env: process.env.NODE_ENV, location: 'global' });
  }, []);

  return (
    <div
      style={{
        width: '100%',
        backgroundPosition: '50% 50%',
        backgroundSize: 'cover',
        backgroundColor: '#fff'
      }}
    >
      <Navigation searchBarPosition="center" />
      <div
        style={{
          paddingTop: 40
        }}
      >
        <div
          style={{
            margin: '0 auto'
          }}
        >
          <div
            className="about-heading justify-center"
            style={{ fontSize: 44, textTransform: 'uppercase' }}
          >
            Guidelines
          </div>
          <div className="about-section">
            <div id={'health-and-safety'} className="about-heading mb-16">
              Health and Safety Guidelines
            </div>
            <div className="privacy-text mt-4">
              <h2 className="mb-12 text-2xl font-bold">Follow Local Regulations</h2>
              <p className="mb-8 text-xl">Regulations in various cities, regions, and countries are shifting constantly as our circumstances evolve, and our knowledge about COVID-19 increases. We recommend that all users stay informed of the local regulations for their community/city, and do not violate local, state, provincial, or federal regulations in order to complete a request.</p>

              <p className="mb-20 text-xl">Please remember that everyone’s health and safety is of utmost priority, and be sure to respect your boundaries and those of others when using The Giving Tree.</p>

              <h2 className="mb-12 text-2xl font-bold">COVID-19 Health &amp; Safety Protocol</h2>
              <ul className="list-disc text-xl mb-10">
                <li className="mb-4">Do not pick up requests if you or anyone you live with is feeling sick or experiencing any COVID-19 symptoms.</li>
                <li className="mb-4">Keep at least 6 feet of distance between yourself and others in public places, and when delivering/receiving items through The Giving Tree.</li>
                <li className="mb-4">Wash your hands thoroughly (for at least twenty seconds) or use a hand sanitizer with at least 60% alcohol after you have been in a public place, or after blowing your nose, coughing, or sneezing.</li>
                <li className="mb-4">Avoid touching your face, eyes, nose, and mouth with unwashed hands.</li>
                <li className="mb-4">Clean AND disinfect frequently touched surfaces daily. This includes: <strong>tables, doorknobs, light switches, countertops, handles, desks, phones, keyboards, toilets, faucets, and sinks.</strong></li>
                <li className="mb-4">Try not to directly touch any public door handles, buttons, or other machinery. Instead, use a tissue as a barrier for your hands, or wear gloves.</li>
              </ul>
              <p className="text-xl mb-4">Please review all CDC’s health and safety guidelines <a  className="text-green-600" href="https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html">here</a>.</p>
            </div>
          </div>
          <div className="about-section">
            <div id={'community'} className="about-heading">
              Community Guidelines
            </div>
            <div className="mt-4 mb-8 text-xl">
              The following is an ever-evolving list of community standards we expect all users to stay informed of, and adhere to when participating on The Giving Tree’s platform. Failure to comply with the Community Guidelines may result in your account’s deactivation and removal from the site.
              <br />
              <br />
              <ol className="list-decimal text-xl">
                <li className="mb-4">
                  Registered users must be 16 years old or older. If you are under 18, please have a parent or guardian attend any drop-offs or pick-ups as necessary.
                </li>
                <li className="mb-4">
                  Treat others -- and their personal information -- with respect. Never publicly share any information that someone asks to keep private, or any personal information that could be used to track or harass them (i.e. home/office addresses, phone numbers, email addresses).
                </li>
                <li className="mb-4">
                  Be honest about the nature of your request. Do not use The Giving Tree for personal financial gain or exploitation of others. If someone purchases items on your behalf, make sure to reimburse them accordingly.
                </li>
                <li className="mb-4">
                  The Giving Tree is a site open to everyone. Please refrain from inappropriate language to keep our community safe and welcoming to all. Inappropriate language includes any and all cursing, as well as racist, sexist, homophobic, transphobic, ableist, or otherwise bigoted language.
                </li>
                <li className="mb-4">
                  No personal advertisements (sexual solicitation, self-promotion about non-assistance related topics) are allowed on The Giving Tree. If you have questions about what constitutes a personal ad, please contact us.
                </li>
                <li className="mb-4">
                  No business advertisements (ie. promotion of paid services, whether overtly or in private messages/direct communication) are allowed on The Giving Tree. Any services you offer to other users must be provided entirely free of charge (barring reimbursement for purchased items).
                </li>
                <li className="mb-4">
                  No bots or spam accounts intended to bombard The Giving Tree or impede community collaboration.
                </li>
                <li className="mb-4">
                  Please respect our Karma system. Do not downvote a post or comment unless it violates one of our Community Guidelines.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => window.scrollTo(0, 0)}
        className="back-to-top justify-center hover:text-green-700 transition-duration"
      >
        Back to top{' '}
        <img
          className="ml-2"
          src="https://d1ppmvgsdgdlyy.cloudfront.net/back-to-top.svg"
          alt="back-to-top"
        />
      </div>
      <Footer />
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

Guidelines.defaultProps = {};

Guidelines.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(geolocated()(Guidelines));
