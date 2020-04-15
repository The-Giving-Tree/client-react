import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import Tag from '../../../components/Tag/Tag';
import Avatar from '../../../components/Avatar/Avatar';
import './NewsFeedCard.css';

import { getDistance } from 'geolib';
import { 
  upvote, downvote, claimTask, unclaimTask, completeTask
} from '../../../store/actions/auth/auth-actions';
import { ChevronUp, ChevronDown } from 'baseui/icon';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';
import { StatefulMenu } from 'baseui/menu';

import Confetti from 'react-confetti';

class NewsFeedCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      details: {},
      upvoteIndex: [],
      downvoteIndex: [],
      upvoteHover: [],
      downvoteHover: [],
      initialUpvotes: [],
      initialDownvotes: [],
      helpArrayDiscover: {}, // Tasks claimed by user (remove from discover)
      helpArrayOngoing: {}, // Tasks claimed by user (remove from discover)
      showConfetti: false,
    }
  }

  componentDidMount() {
    // Set the tags for this post (Food, in progress etc)
    this.setTags();
    // Set the post details (Zip code, phone no. etc.)
    this.setDetails();

    // Create the vote index
    this.setVoteIndex();

    // Set initial vote count based on the total votes sent from the back end
    this.setState({ voteCount: this.props.item.voteTotal})    
  }

  componentDidUpdate(prevProps, prevState) { 
    this.setVoteIndex()
  }

  /**
   * Set the voting index for this post
   *
   * @memberof NewsFeedCard
   */
  setVoteIndex() {
    if (this.props.item.downVotes.includes(this.props.user._id) &&
      !this.state.downvoteIndex.includes(this.props.index) &&
      !this.state.initialDownvotes.includes(this.props.index)
    ) {
      this.state.initialDownvotes.push(this.props.index);
      this.state.downvoteIndex.push(this.props.index);
    }
    if (this.props.item.upVotes.includes(this.props.user._id) && 
      !this.state.upvoteIndex.includes(this.props.index) &&
      !this.state.initialUpvotes.includes(this.props.index)
    ) {
      this.state.initialUpvotes.push(this.props.index);
      this.state.upvoteIndex.push(this.props.index);
    }
  }

  /**
   * Remove an item from the ongoing feed when it's released
   *
   * @param {*} id
   * @memberof NewsFeedCard
   */
  removeOngoing(id) {
    const prevOngoing = this.state.helpArrayOngoing;
    this.setState({
      helpArrayOngoing: {
        ...prevOngoing,
        [id]: !prevOngoing[id]
      }
    })
  };

  /**
   * Remove an item from the discover feed when it's claimed
   *
   * @param {*} id
   * @memberof NewsFeedCard
   */
  removeDiscover(id) {
    const prevDiscover = this.state.helpArrayDiscover;

    this.setState({
      helpArrayDiscover: {
        ...prevDiscover,
        [id]: !prevDiscover[id]
      }
    })
  };

  /**
   * Hide a card if it's claimed on discover, or released on ongoing page
   *
   * @param {*} i
   * @returns
   * @memberof NewsFeedCard
   */
  hideCard(i) {
    return this.props.match.url === '/home/discover'
      ? this.state.helpArrayDiscover[i]
      : this.props.match.url === '/home/ongoing'
      ? this.state.helpArrayOngoing[i]
      : true;
  }

  /**
   * Set the tags that will be shown on this card. Also sets the status tags.
   *
   * @memberof NewsFeedCard
   */
  setTags() {
    const tags = [];

    // Iterate over the categories and build tags.
    this.props.item.categories.forEach((cat, i) => {
      tags.push(
        <Tag label={cat} type="category" key={i} className="ml-1 mb-1" />
      );
    })

    // Set status based on assigned user
    if (this.props.item.assignedUser) { 
      const status = (this.props.completed) ? 'Completed' : 'In progress';
      tags.push(
        <Tag label={status} type={status} key={tags.length} 
        className="ml-1 mb-1" />
      )
    }

    return tags;
  }

  /**
   * Get the details of the task from the item.text string
   *
   * @memberof NewsFeedCard
   */
  setDetails() {
    const item = this.props.item;

    if (item) {
      const obj = {
        address: item.address || null,
        requestType: item.requestType || null,
        description: item.description || null,
        cart: item.cart || null,
        contactMethod: item.contactMethod || null,
        email: item.email || null,
        name: item.name || null,
        dueDate: item.dueDate || null,
        location: item.location || null,
        postal: item.postal || null,
        phoneNumber: item.phoneNumber || null,
        publicAddress: item.publicAddress || null
      };
      this.setState({ 
        details: obj 
      })  
    }
  }

  /**
   * Mask the users telephone number until the task has been claimed.
   *
   * @param {*} number
   * @memberof NewsFeedCard
   */
  maskPhoneNumber(number) {
    return `***-***-${number.substring(
      number - 4)}`;
  }
  
  /**
   * Return the user's phone number if the task is ongoing, otherwise, mask
   * the phone number
   *
   * @returns
   * @memberof NewsFeedCard
   */
  getPhoneNumber() {
    if (this.props.match.url === '/home/ongoing') {
      return this.state.details.phoneNumber;
    } else {
      return this.maskPhoneNumber(this.state.details.phoneNumber);
    }
  }

  /**
   * Calculate the distance to the user from the request location
   *
   * @param {*} requestLocation
   * @returns
   * @memberof NewsFeedCard
   */
  calculateDistance(requestLocation) {
    if (requestLocation && requestLocation.lat && requestLocation.lng && this.props.coords) {
      var request = {
        latitude: requestLocation.lat,
        longitude: requestLocation.lng
      };

      var user = {
        latitude: this.props.coords.latitude,
        longitude: this.props.coords.longitude
      };

      let distance = getDistance(request, user); // meters
      let km = distance / 1000;
      let mi = km * 0.621371;

      return mi.toFixed(2);
    } else {
      return '-';
    }
  }

  /**
   * Generate the JSX for the food cart section of the news feed item
   *
   * @param {*} cart
   * @returns
   * @memberof NewsFeedCard
   */
  foodCartJSX(cart) {
    return cart.length === 0 ? (
      <p className="text-center">no items in cart</p>
    ) : (
      <table className="table-auto w-full text-sm">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Item</th>
            <th className="px-4 py-2 text-right">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, i) => (
            <tr key={i} className={(i % 2 === 0) ? `bg-gray-100` : ''}>
              <td className={`px-4 py-2 text-left`}>{item.name}</td>
              <td className={`px-4 py-2 text-right`}>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // completed order details
  completedOrderJSX(trackingDetails) {
    return trackingDetails.length === 0 ? (
      <div className="text-center">no tracking details added yet</div>
    ) : (
      <React.Fragment>
        <div
          className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 
          text-sm p-4 mt-8"
          role="alert"
        >
          <div className="font-bold mb-4 underline capitalize">
            Order Details:
          </div>
          <p className="capitalize">order created: {trackingDetails.created}</p>
          <p className="capitalize">dropoff ETA: {trackingDetails.dropoffEta}</p>
          <p className="capitalize">method: {trackingDetails.method}</p>
          <p className="capitalize">notes: {trackingDetails.notes}</p>
        </div>
      </React.Fragment>
    );
  };

  completedOrderGlobalJSX = item => {
    return item.length === 0 || !item.assignedUser ? (
      <div className="text-center">no completed details available yet</div>
    ) : (
      <React.Fragment>
        <div
          className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 mt-8"
          role="alert"
        >
          {item.trackingDetails && (
            <React.Fragment>
              <div
                style={{
                  textTransform: 'capitalize',
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 10,
                  textDecoration: 'underline'
                }}
              >
                Order Details:
              </div>
              <p className="capitalize">
                order created: {moment(item.trackingDetails.created).format('MMM D, YYYY h:mm A')}
              </p>
              <p className="capitalize">
                dropoff ETA: {item.trackingDetails.dropoffEta}
              </p>
              <p className="capitalize">method: {item.trackingDetails.method}</p>
              <p className="capitalize">notes: {item.trackingDetails.notes}</p>
            </React.Fragment>
          )}

          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginTop: item.trackingDetails ? 15 : 0,
              textDecoration: 'underline'
            }}
          >
            Fulfilled By:
          </div>
          <p
            style={{ textTransform: 'lowercase', cursor: 'pointer' }}
            className="flex items-center"
          >
            <span
              onClick={() => this.props.history.push(`/user/${item.assignedUser.username}`)}
              className="hover:text-indigo-800"
            >
              {item.assignedUser.username}
            </span>
            {Number(item.assignedUser.karma) >= 0 && (
              <span>&nbsp;&bull; {item.assignedUser.karma} karma</span>
            )}
          </p>
          <p style={{ textTransform: 'lowercase' }}>
            email: <a href={`mailto:${item.assignedUser.email}`}>{item.assignedUser.email}</a>
          </p>
        </div>
      </React.Fragment>
    );
  };

  mouseOutUp(i) {
    this.setState({
      upvoteHover: this.state.upvoteHover.filter(item => item !== i)
    });
  }

  mouseOverUp(i) {
    this.setState({
      upvoteHover: this.state.upvoteHover.concat(i)
    });
  }

  mouseOutDown(i) {
    this.setState({
      downvoteHover: this.state.downvoteHover.filter(item => item !== i)
    });
  }

  mouseOverDown(i) {
    this.setState({
      downvoteHover: this.state.downvoteHover.concat(i)
    });
  }

  removeIndex(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }

  /**
   * Fired when user clicks upvote button. Requests a change to the backend
   *
   * @param {*} type
   * @param {*} _id
   * @param {string} [postId='']
   * @memberof NewsFeedCard
   */
  async handleUpClick(type, _id, postId = '') {
    switch (type) {
      case 'Post':
        await this.props.upvoteDispatch({
          env: process.env.NODE_ENV,
          postId: _id
        });
        break;
      case 'Comment':
        await this.props.upvoteDispatch({
          env: process.env.NODE_ENV,
          postId,
          commentId: _id
        });
        break;
      default:
        break;
    }
  }

  /**
   * Fired when user clicks downvote button. Requests a change to the backend
   *
   * @param {*} type
   * @param {*} _id
   * @param {string} [postId='']
   * @memberof NewsFeedCard
   */
  async handleDownClick(type, _id, postId = '') {
    switch (type) {
      case 'Post':
        await this.props.downvoteDispatch({
          env: process.env.NODE_ENV,
          postId: _id
        });
        break;
      case 'Comment':
        await this.props.downvoteDispatch({
          env: process.env.NODE_ENV,
          postId,
          commentId: _id
        });
        break;
      default:
        break;
    }
  }

  /**
   * Check the vote count on render (logs to console);
   *
   * @memberof NewsFeedCard
   */
  setVoteCount() {
    const propsTotal = this.props.item.voteTotal;

    const upvoteCalc = Number(
      this.state.upvoteIndex.includes(this.props.index)
        ? this.props.item.upVotes.includes(this.props.user._id)
            ? 0 : 1
        : this.props.item.upVotes.includes(this.props.user._id)
          ? -1 : 0
    )

    const downvoteCalc = Number(
      this.state.downvoteIndex.includes(this.props.index)
        ? this.props.item.downVotes.includes(this.props.user._id)
          ? 0
          : 1
        : this.props.item.downVotes.includes(this.props.user._id)
        ? -1
        : 0
    )

    const newVoteCount = propsTotal + upvoteCalc - downvoteCalc;
    
    this.setState({ voteCount: newVoteCount })
  }

  render() {
    const authenticated = localStorage.getItem('giving_tree_jwt');

    this.setVoteIndex();

    return (
      <article onClick={(e) => {
        this.props.history.push(`/post/${this.props.item._id}`)
        window.scrollTo(0,0);
      }}
      className={`${this.props.className} NewsFeedCard rounded shadow bg-white 
      p-4 block cursor-pointer ${this.hideCard(this.props.item._id) ? 
      'hidden' : ''}`}>
        {this.state.showConfetti && 
          <Confetti width={window.innerWidth} height={window.innerHeight} 
          recycle={false} />
        }
        <div className="flex items-center flex-wrap mb-3">
          <a href={`/user/${this.props.item.authorId.username}`} 
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="inline-block">
            <Avatar user={this.props.item.authorId} />
          </a>
          <strong className="mx-2 text-sm">
            {this.props.item.authorId.username}
          </strong>
          <small className="mr-3">
            {moment(new Date(this.props.item.createdAt)).fromNow()}
          </small>
          {/* TAGS GO HERE */}
          <div className="flex items-center ml-auto">
            {this.setTags()}
          </div>
        </div>
        <div className="flex mb-5">

          <div className="text-center flex flex-col items-center w-8">
            <ChevronUp size={25} color={
              this.state.upvoteIndex.includes(this.props.index) || 
                this.state.upvoteHover.includes(this.props.index) ? 
                  '#268bd2' : '#aaa'
            }
            style={{ alignContent: 'center', cursor: 'pointer' }}
            onMouseEnter={() => this.mouseOverUp(this.props.index)}
            onMouseLeave={() => this.mouseOutUp(this.props.index)}
            onTouchStart={() => this.mouseOverUp(this.props.index)}
            onTouchEnd={() => this.mouseOutUp(this.props.index)}
            onClick={async (e) => {
              e.stopPropagation();

              if (authenticated) {
                await this.handleUpClick(
                  this.props.item.type,
                  this.props.item._id,
                  this.props.item.type === 'Comment' && this.props.item.postId
                );

                if (this.state.downvoteIndex.includes(this.props.index)) {
                  this.removeIndex(this.state.downvoteIndex, this.props.index);
                }

                if (this.state.upvoteIndex.includes(this.props.index)) {
                  this.removeIndex(this.state.upvoteIndex, this.props.index);
                } else {
                  this.state.upvoteIndex.push(this.props.index);
                }

                this.setVoteCount();
              } else {
                alert('please signup first');
                this.props.history.push('/signup');
              }
            }}
          />            
          <span>
            {this.state.voteCount}
          </span>
          <ChevronDown color={
            this.state.downvoteIndex.includes(this.props.index) || 
              this.state.downvoteHover.includes(this.props.index) ? '#268bd2' : 
                '#aaa'}
            size={25}
            style={{ alignContent: 'center', cursor: 'pointer' }}
            onMouseEnter={() => this.mouseOverDown(this.props.index)}
            onMouseLeave={() => this.mouseOutDown(this.props.index)}
            onTouchStart={() => this.mouseOverDown(this.props.index)}
            onTouchEnd={() => this.mouseOutDown(this.props.index)}
            onClick={async (e) => {
            e.stopPropagation();
            if (authenticated) {
              await this.handleDownClick(
                this.props.item.type,
                this.props.item._id,
                this.props.item.type === 'Comment' && this.props.item.postId
              );

              if (this.state.upvoteIndex.includes(this.props.index)) {
                this.removeIndex(this.state.upvoteIndex, this.props.index);
              }

              if (this.state.downvoteIndex.includes(this.props.index)) {
                this.removeIndex(this.state.downvoteIndex, this.props.index);
              } else {
                this.state.downvoteIndex.push(this.props.index);
              }
              this.setVoteCount();
            } else {
              alert('please signup first');
              this.props.history.push('/signup');
            }
            }}
          />
          </div>
          
          <div className="pl-2 w-full">
            <h3 className="text-xl font-semibold mb-4">
              {this.props.item.title}
            </h3>
            { (this.state.details.address || this.state.details.publicAddress) && (
              <p className="text-sm mb-3">
                Address: {this.state.details.address || this.state.details.publicAddress}
              </p>
            ) }
            <p className="text-sm mb-3">{
              this.props.coords ? 
                this.calculateDistance(this.state.details.location) + 
                ' miles from you' : this.state.details.postal 
                    ? `Zip code: ${this.state.details.postal.split('-')[0] || 
                      this.state.details.postal}` : ''
            }</p>
            {this.state.details.dueDate && 
              <p className="text-sm mb-3">Needed by: 
              {` ${moment(new Date(this.state.details.dueDate)).fromNow()} `} 
              ({moment(this.state.details.dueDate).calendar()})</p>
            }
            {this.state.details.description &&
              <p className="text-sm mb-3">
                Special instructions: {this.state.details.description}
              </p>
            }
            {this.state.details.contactMethod &&
              <p className="text-sm mb-3">
                Preferred contact method: {
                  this.state.details.contactMethod === 'comments'
                    ? 'in-app comments'
                    : this.state.details.contactMethod
                }
              </p>
            }
            {this.state.details.phoneNumber &&
              <p className="text-sm my-1 mt-4">
                Phone Number: {this.getPhoneNumber()}
              </p>
            }
            <div className="mt-1">
              {this.props.item.type === 'Post' ? (
                <div className="mt-5">
                  {this.props.match.url !== '/home/ongoing' &&
                    this.state.details.type === 'food' &&
                    this.foodCartJSX(this.state.details.cart)
                  }
                  {this.props.match.url === '/home/global' &&
                    this.completedOrderGlobalJSX(this.props.item)
                  }
                </div>
              ) : (
                this.props.item.content
              )}
            </div>
          </div>
        </div>
        
        {this.props.match.url !== '/home/ongoing' && (
          <div className="flex items-center">
            <CopyToClipboard 
            text={`${window.location.origin}/post/${this.props.item._id}`}>
              <StatefulPopover onClick={(e) => {
                  e.stopPropagation()
                }}
                placement={PLACEMENT.bottomLeft}
                content={({ close }) => (
                  <StatefulMenu
                    items={[
                      {
                        label: 'Copy Link'
                      }
                    ]}
                    onItemSelect={(item) => {
                      item.event.stopPropagation();
                      close();
                      switch (item.item.label) {
                        case 'Copy Link':
                          break;
                        default:
                          break;
                      }
                    }}
                    overrides={{
                      List: { style: { outline: 'none', padding: '0px' } }
                    }}
                  />
                )}
              >
                <button className="text-xs flex items-center">
                  <img
                    src="https://d1ppmvgsdgdlyy.cloudfront.net/share.svg"
                    alt="share"
                    className="block h-5 mr-3"
                  />
                  <strong className="uppercase">Share</strong>
                </button>
              </StatefulPopover>
            </CopyToClipboard>
            
            <div className="ml-auto flex items-center">
              {this.props.item.type === 'Post' && !this.props.item.completed &&
                this.props.match.url === '/home/discover' && 
                  !this.props.item.assignedUser && (this.props.item.authorId._id !== this.props.user._id) && (
                    <button className="mr-4 flex items-center uppercase text-xs" 
                    onClick={(e) => {
                      e.stopPropagation()

                      if (this.props.item.assignedUser) {
                        alert('someone is already helping on this task ' + 
                        '(in progress) - please look other requests');
                        return;
                      }

                      if (window.confirm(
                        'Please confirm your commitment to helping this person - ' +
                        'by saying yes, other people cannot claim this request.'
                        )
                      ) {
                        this.props.claimTaskDispatch({
                          env: process.env.NODE_ENV,
                          postId: this.props.item._id
                        });
                        this.removeDiscover(this.props.item._id);
                        this.props.history.push(`/post/${this.props.item._id}`);
                      }

                    }}>
                      <img className="block h-5 mr-2"
                        src="https://d1ppmvgsdgdlyy.cloudfront.net/help_color.svg"
                        alt="help"
                      />
                      <strong>Help</strong>
                    </button>
              )}
              <button className="flex items-center text-xs">
                <img src="https://d1ppmvgsdgdlyy.cloudfront.net/comment.svg"
                  alt="comment"
                  className="h-5 block mr-2" />
                <strong className="">
                  {this.props.item.comments.length}
                </strong>
              </button>
            </div>
        </div>
        )}
        {this.props.match.url === '/home/ongoing' && (
          <div className="flex justify-between items-center">
            <button className="uppercase text-xs text-red-600" onClick={(e) => {
              e.stopPropagation()
              let cancelReason = window.confirm(
                'Warning: By releasing this request back into the Requests ' + 
                'Feed, you are breaking your commitment and may lose Karma ' +
                'points.'
              );

              if (cancelReason) {
                this.props.unclaimTaskDispatch({
                  env: process.env.NODE_ENV,
                  postId: this.props.item._id,
                  cancelReason
                });

                this.removeOngoing(this.props.item._id);
              }
            }}>
              Release request
            </button>

            <button className="uppercase text-xs ml-auto" onClick={(e) => {
              e.stopPropagation()

              const completed = window.confirm(
                'Are you sure you want to mark this task as completed?'
              );

              if (completed) {
                this.props.completeTaskDispatch({
                  env: process.env.NODE_ENV,
                  postId: this.props.item._id
                });

                this.setState({
                  showConfetti: true
                });

                this.props.history.push('/home/discover');
              }
            }}>
              Mark completed
            </button>
          </div>
        )}
      </article>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  upvoteDispatch: payload => dispatch(upvote(payload)),
  downvoteDispatch: payload => dispatch(downvote(payload)),
  claimTaskDispatch: payload => dispatch(claimTask(payload)),
  unclaimTaskDispatch: payload => dispatch(unclaimTask(payload)),
  completeTaskDispatch: payload => dispatch(completeTask(payload))
});

const mapStateToProps = state => ({});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewsFeedCard)
);
