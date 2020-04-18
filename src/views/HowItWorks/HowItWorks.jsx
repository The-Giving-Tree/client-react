/* eslint-disable */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { geolocated } from 'react-geolocated';
import { connect } from 'react-redux';
import { hotjar } from 'react-hotjar';

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

function HowItWorks(props) {
  const { user, getCurrentUserDispatch, getLeaderboardDispatch, userRanking, leaderboard } = props;

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

  React.useEffect(() => {
    getLeaderboardDispatch({ env: process.env.REACT_APP_NODE_ENV, location: 'global' });
  }, []);

  return (
    <div>
      <Navigation searchBarPosition="center" />
      <section className="bg-white py-20">
        <div className="lg:max-w-4xl xl:max-w-screen-xl mx-auto px-6">
          <h1 className="about-heading justify-center mb-20"
            style={{ fontSize: 44, textTransform: 'uppercase' }}
          >
            How The Giving Tree Works
          </h1>
          <h2 id={'how-it-works'} className="about-heading">How it works</h2>
          <ol className="list-decimal text-xl mb-12">
            <li>Doug needs help getting groceries, so he posts a request on The Giving Tree</li>
            <li>Nadia, who lives 0.6 miles away, sees it and reaches out to help Doug</li>
            <li>Nadia shops carefully, following all COVID-19 safety protocol, and safely delivers groceries to Doug. He reimburses her electronically.</li>
          </ol>

          <h3 className="font-bold text-xl mb-6">When communicating with other users, please remember to:</h3>

          <ul className="list-disc text-xl">
            <li>Exchange contact information so that you can communicate directly with one another.</li>
            <li>Ask/answer all questions clearly.</li>
            <li>Agree on how/where items should be delivered, and keeping each other updated on timing.</li>
            <li>Agree on a reimbursement method beforehand for any purchases made.
              <ol className="pl-6 list-disc">
                <li>Aim for a contactless exchange of money, like Paypal, Venmo, or another e-transfer method.</li>
                <li>If using cash, please make sure that the cash exchange complies with social distancing regulations (e.g. put the cash in an envelope at your doorstep for your helper).</li>
              </ol>
            </li>
            
            <li>Review and follow all local <a href="https://www.givingtreeproject.org/guidelines" className="text-green-600">Health &amp; Safety guidelines</a> regarding COVID-19.</li>
          </ul>
        </div>
        
      </section>
      <section>
        <div className="lg:max-w-4xl xl:max-w-screen-xl mx-auto px-6 py-12">
          <h2 id={'how-to-provide-help'} className="about-heading">
            How to provide help
          </h2>
          <ol className="list-decimal text-xl mb-8">
            <li>Explore the <strong>Requests Feed</strong> to find new requests in your area.</li>
            <li>Click on a request to see all details, and comment if you have questions.</li>
            <li>Once you've found a request you can help with, press <strong>Help</strong> to claim it!</li>
            <li>Communicate with the requester directly, using their preferred contact method (phone/email/in-app comments).</li>
          </ol>

          <p className="text-xl">If for any reason you are unable to complete the request, let the person know right away, and click “Release Request” to return it to the Requests Feed. Please note that when releasing a request, you may lose Karma points which could negatively impact your credibility with other users.</p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="lg:max-w-4xl xl:max-w-screen-xl mx-auto px-6">
          <h2 id={'how-to-request-help'} className="about-heading">How to Request Help</h2>
          <p className="mb-6 text-xl">Remember that ordinary citizens are braving COVID-19 on your behalf, and try to create as few requests as possible so that you’re not sending multiple people out to multiple stores on your behalf. Instead, consolidate your asks into one request, and try to think of ways your helper could procure your needs from a single destination (e.g. Safeway, IGA).</p>
          <p className="text-xl">Help your helpers feel safe. Please don’t ask them to breach social distancing to hand-deliver your goods, or to exchange cash or other items.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="lg:max-w-4xl xl:max-w-screen-xl mx-auto px-6">
          <h2 id={'how-to-create-a-request'} className="about-heading">How to create a new request</h2>
          <ol className="list-decimal text-xl mb-8">
            <li>Click on “Create Request”, or call/text our hotline at 415-964-4261 to have our team create one on your behalf.</li>
            <li>When completing the request form, be specific so your helper can quickly and easily understand your needs.</li>
            <li>Be as flexible with the timing (“needed by” date/time) as you can, to give helpers a chance to find and fulfill your request.</li>
            <li>Once your request is posted, keep an eye out for comments notifications from potential helpers!</li>
          </ol>
        </div>
      </section>
      
      <button
        onClick={() => window.scrollTo(0, 0)}
        className="justify-center flex items-center hover:text-green-700 transition-duration uppercase mx-auto mb-12"
      >
        Back to top 
        <img
          className="ml-2"
          src="https://d1ppmvgsdgdlyy.cloudfront.net/back-to-top.svg"
          alt="back-to-top"
        />
      </button>
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

HowItWorks.defaultProps = {};

HowItWorks.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(geolocated()(HowItWorks));
