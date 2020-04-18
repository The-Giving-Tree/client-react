import * as React from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { loadNewsfeed } from '../../store/actions/auth/auth-actions';

class NewsFeedTable2 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hasMoreItems: true,
      newsfeed: []
    }
  }

  componentDidMount() {
    // Get the newsfeed items
    this.getNewsFeed({
      lat: this.props.location.lat,
      lng: this.props.location.lng
    }, Number(this.props.currentPage), this.props.feedMode)
  }

  componentDidUpdate(prevProps, prevState) {
    // if the route changes...
    if (this.props.feedMode !== prevProps.feedMode) {
      console.log("ROUTE CHANGE: ", this.props);
      this.getNewsFeed({
        lat: this.props.location.lat,
        lng: this.props.location.lng
      }, 1, this.props.feedMode);
    }
  }

  /**
   * Change the state of the newsfeed
   *
   * @param {*} feed
   * @memberof NewsFeedTable2
   */
  setNewsFeed(feed) {
    this.setState({newsfeed: feed})
  }

  /**
   * Get the data from the back end
   *
   * @param {*} loc
   * @param {*} currentPage
   * @param {*} feedMode
   * @memberof NewsFeedTable2
   */
  getNewsFeed(loc, currentPage, feedMode) {      
    this.props.loadNewsfeedDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      page: Number(currentPage),
      feed: feedMode,
      location: loc
    });
  }

  /**
   * Update the news feed with a list of items
   *
   * @memberof NewsFeedTable2
   */
  loadMoreItems(nextPage) {
    const currentPage = Number(this.props.currentPage);
    if (currentPage < this.props.pages) {
      this.getNewsFeed({
        lat: this.props.location.lat,
        lng: this.props.location.lng
      }, nextPage, this.props.feedMode);
    } else {
      this.setHasMoreItems(false);
    }
  }

  /**
   * Returns the template for each individual row/item in the news feed
   *
   * @param {*} item
   * @param {*} i
   * @returns
   * @memberof NewsFeedTable2
   */
  setRowTemplate(item, i) {
    return (<div key={i} className="p-3" style={{
      height: '500px'
    }}>{item.title}</div>);   
  }

  /**
   * Update the state when there are no more items to display
   *
   * @param {*} val
   * @memberof NewsFeedTable2
   */
  setHasMoreItems(val) {
    this.setState({ hasMoreItems: val })
  }

  render() {
    return (
      <div>
        {!this.props.newsfeedLoading ? (
          <InfiniteScroll
          pageStart={1}
          loadMore={(page) => {
            console.log("LOAD MORE", page)
            return this.loadMoreItems(page)
          }}
          hasMore={this.state.hasMoreItems}
          loader={
            <div key={0} className="loading-spinner"></div>
          }>
            {this.props.newsfeed.map((item, i) => {
              return(
                this.setRowTemplate(item, i)
              );
            })}
          </InfiniteScroll>
        ) : (
          <div key={0} className="loading-spinner"></div>
        )}
      </div>   
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadNewsfeedDispatch: (payload) => dispatch(loadNewsfeed(payload))
});

const mapStateToProps = state => ({
  newsfeed: state.auth.newsfeed,
  currentPage: state.auth.currentPage,
  pages: state.auth.pages,
  numOfResults: state.auth.numOfResults,
  newsfeedSuccess: state.auth.newsfeedSuccess,
  newsfeedUpdated: state.auth.newsfeedUpdated,
  newsfeedLoading: state.auth.newsfeedLoading,
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeedTable2);
