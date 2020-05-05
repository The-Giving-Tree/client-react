import * as React from 'react';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { StyledBody } from 'baseui/card';
import { hotjar } from 'react-hotjar';

function NewsfeedTable(props) {
  const {
    hasMoreItems,
    id,
    items,
    selectMenuDispatch,
    newsfeedLoading,
    newsfeedSuccess,
    setUpdateNews
  } = props;

  const history = useHistory();

  React.useEffect(() => {
    hotjar.initialize('1751072', 6);
  }, []);

  return (
    <div>
      <InfiniteScroll
        pageStart={1}
        loadMore={() => setUpdateNews(true)}
        hasMore={hasMoreItems}
        loader={
          <StyledBody
            className="loader"
            style={{ textAlign: 'center', padding: 10, marginTop: 20 }}
            key={0}
          >
            <div className="loading-spinner"></div>
          </StyledBody>
        }
      >
        {items}
      </InfiniteScroll>
      <div style={{ paddingTop: 30 }} />
      {items.length === 0 && newsfeedSuccess && !newsfeedLoading && (
        <StyledBody style={{ margin: '0 auto', textAlign: 'center', marginTop: 20 }}>
          {id === 'discover' && (
            <div className="mb-2">
              No requests yet -{' '}
              <span
                className={`text-blue-600 hover:text-blue-800 transition duration-150`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  selectMenuDispatch({ selectMenu: '' }); // to show base page
                  history.push('/submit');
                }}
              >
                create a new request if you need help
              </span>
            </div>
          )}
          {id === 'ongoing' && <div className="mb-2">You don't have any ongoing requests yet</div>}
          {id === 'completed' && <div className="mb-2">You haven't completed any requests yet</div>}
          {id === 'global' && (
            <div className="mb-2">
              No requests globally completed yet! Invite your friends and start spreading the love
            </div>
          )}
          {id !== 'discover' && (
            <div
              onClick={() => {
                window.location = '/home/discover';
              }}
              style={{ cursor: 'pointer', color: 'rgb(25, 103, 210)' }}
            >
              Click here to discover topics and people to follow.
            </div>
          )}
        </StyledBody>
      )}
    </div>
  );
}

export default NewsfeedTable;
