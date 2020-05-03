/* eslint-disable */
import * as React from 'react';
import { Button, SHAPE } from 'baseui/button';
import { useHistory } from 'react-router-dom';
import PlacesAutocomplete from 'react-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import InfiniteScroll from 'react-infinite-scroller';
import { StyledBody } from 'baseui/card';
import { hotjar } from 'react-hotjar';

function NewsfeedTable(props) {
  const {
    address,
    coords,
    hasMoreItems,
    id,
    items,
    selectMenu,
    match,
    newPost,
    setNewPost,
    selectMenuDispatch,
    authenticated,
    latLng,
    newsfeedLoading,
    newsfeedSuccess,
    openCustomAddress,
    setOpenCustomAddress,
    resetItems,
    setAddress,
    setLatLng,
    setUpdateNews
  } = props;

  const history = useHistory();

  React.useEffect(() => {
    hotjar.initialize('1751072', 6);
  }, []);

  return (
    <div>
      {/* {openCustomAddress ? (
        <div className="flex justify-between items-center my-3">
          <PlacesAutocomplete
            value={address}
            onChange={address => setAddress(address)}
            onSelect={address => {
              setAddress(address);
              geocodeByAddress(address)
                .then(results => getLatLng(results[0]))
                .then(latLng => {
                  setLatLng(latLng);
                })
                .catch(error => console.error('Error', error));
            }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div style={{ width: '100%' }}>
                <input
                  {...getInputProps({
                    placeholder: 'Enter an address',
                    className: 'location-search-input'
                  })}
                  value={address}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                  id="address"
                  type="text"
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div className="loading-spinner"></div>}
                  {suggestions.map(suggestion => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item';
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <div className="flex items-center">
            <button
              className={`ml-4 bg-gray-500 hover:bg-gray-700 text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline`}
              type="button"
              onClick={() => {
                let lat = coords && coords.latitude;
                let lng = coords && coords.longitude;

                // only refresh if the user is coming from a different location
                if (address !== 'Earth') {
                  window.location = '/home/discover';
                }

                setLatLng({ lat, lng });
                setOpenCustomAddress(false);
              }}
            >
              Cancel
            </button>
            <button
              className={`ml-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline`}
              type="button"
              onClick={() => {
                if (address) {
                  setOpenCustomAddress(false);
                  resetItems();
                } else {
                  alert('you must enter an address to save!');
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        match.url === '/home/discover' && (
          <div className="mb-4">
            <h2 className="text-lg font-bold">Requests near you</h2>
            <div className={`text-left mt-2`} style={{ fontSize: 12 }}>
              Your current location:{' '}
              {(address === 'Earth' && 'Earth 🌍') ||
                `(${latLng.lat ? latLng.lat : coords && coords.latitude}, ${
                  latLng.lng ? latLng.lng : coords && coords.longitude
                })`}
              &nbsp;
              <span
                onClick={() => setOpenCustomAddress(true)}
                className="text-blue-600 hover:text-blue-800 transition duration-150"
                style={{ cursor: 'pointer' }}
              >
                (edit)
              </span>
            </div>
          </div>
        )
      )} */}
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
