import * as React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { geocodeByAddress, getLatLng, } from 'react-places-autocomplete';
import './LocationBar.css';
import Geocode from 'react-geocode';

class LocationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showChangeLocation: false,
      fetchingLatLng: false,
      feed: 'discover',
      name: 'Earth 🌍',
      latLng: {
        lat: '',
        lng: ''
      }
    };
  }

  componentDidMount() {
    const savedLoc = this.getLocalStorage();
    // If the user HAS NOT saved their location previously, try to use the browser's location.
    if (!savedLoc) {
      navigator.geolocation.getCurrentPosition((data) => {
        console.log("SUCCESS: ", data)
        const latLng = {
          lat: data.coords.latitude,
          lng: data.coords.longitude,
        }
  
        Geocode.fromLatLng(latLng.lat, latLng.lng, 'AIzaSyAekBfwKEqKbpKn6sa2A0CPohUe1aSLyAg').then(res => {
          const addresses = res.results;
          const approx = addresses[0].formatted_address;
          const updatedLoc = {
            name: approx,
            latLng: latLng 
          }

          this.setState(updatedLoc);
          this.setLocalStorage(updatedLoc);
          this.updateFeedResults();
        }).catch(error => {
          console.log('Error fetching location name: ', error);
          this.resetLocation();
        })
      }, (err) => { // If the browser is blocked from loading the location
        console.log("ERROR: ", err)
        this.resetLocation();
      })
    } else {
      // Location gets saved as a string in local storage
      this.setState({
        name: savedLoc.name,
        latLng: savedLoc.latLng
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // If the feed type filter changes, update the state.
    const id = this.getFeedType();
    if (prevState.feed !== id) this.setFeedType();
  }

  /**
   * Get the feed type filter from the URL params (Discover, ongoing etc.)
   */
  getFeedType() {
    return this.props.match.params ? this.props.match.params[0].toLowerCase()
      : '';
  }

  /**
   * Set the state with the feed type filter (Discover, ongoing etc.)
   */
  setFeedType() {
    const id = this.getFeedType()
    this.setState({ feed: id });
  }

  /**
   * Reset the user's location to 'Global/Earth'
   */
  resetLocation() {
    // Set the local storage (Don't need to set the state as we have to refresh)
    this.setLocalStorage({ name: 'Earth 🌍', latLng: { lat: '', lng: '' }});
    // Refresh the page
    this.updateFeedResults();
  }

  /**
   * Toggle the state of the location bar. Show/Hide the input field
   *
   * @param {Boolean} val
   * @memberof LocationBar
   */
  toggleChangeLocation(val) {
    this.setState({ showChangeLocation: val });
  }

  /**
   * Set the user's location in the local storage so it can be retrieved again
   * @param {*} obj 
   */
  setLocalStorage(obj) {
    localStorage.setItem('userLocation', JSON.stringify(obj))
  }

  /**
   * Retrieve the user location
   */
  getLocalStorage() {
    return JSON.parse(localStorage.getItem('userLocation'));
  }
  
  /**
   * Update the location after the user clicks 'Save'
   */
  updateLocation() {
    this.setState({ fetchingLatLng: true })
    // If no location is specified, reset to global, refresh page.
    if (!this.state.name) {
      this.setLocalStorage({ name: 'Earth 🌍', latLng: { lat: '', lng: '' }});
      return this.updateFeedResults();
    }

    // If the location name is set...
    // Build object to send to the local storage
    const jsonStr = {
      name: this.state.name,
      latLng: {
        lat: this.state.latLng.lat,
        lng: this.state.latLng.lng
      }
    }

    // If no lat/lng is set yet
    if (!jsonStr.latLng.lat && !jsonStr.latLng.lng) {
      geocodeByAddress(this.state.name).then(res => getLatLng(res[0]))
      .then(latLng => {
        jsonStr.latLng = latLng;
        // Update the location in the local storage.
        this.setLocalStorage(jsonStr);
        // We have to refresh the page (for now) in order to load results  
        this.updateFeedResults();
      });
    } else { // If the lat/lng is set...
      // Update the location in the local storage.
      this.setLocalStorage(jsonStr);
      // We have to refresh the page (for now) in order to load results  
      this.updateFeedResults();
    }
  }

  /**
   * Refresh the feed
   */
  updateFeedResults() {
    return window.location = `/home/${this.state.feed}`;
  }

  /**
   * Updates the location state with the input from the search field
   *
   * @param {*} val Search field input
   * @memberof LocationBar
   */
  onChange(val) {
    this.setState({ name: val });
  }

  /**
   * Updates the user's location, and gets the latitude & longitude
   *
   * @param {*} address
   * @memberof LocationBar
   */
  onSelect(address) {
    this.setState({ name: address, fetchingLatLng: true });
    geocodeByAddress(address).then(res => getLatLng(res[0])).then(latLng => {
      this.setState({ latLng: latLng, fetchingLatLng: false });
    });
  }

  render() {
    return (
      <React.Fragment>
        {// What to display when the location is set/before the user changes location
        !this.state.showChangeLocation ? (
          <div className={`py-2 ${this.props.className}`}>
            <span className="mr-2">
              Your current location:
            </span>
            <span>
              {this.props.location.name}
            </span>
            <button
              className="ml-4 underline text-indigo-600 text-sm"
              onClick={() => this.toggleChangeLocation(true)}
            >
              (Edit)
            </button>
            {(this.state.latLng.lat && this.state.latLng.lng) && 
              <button className="ml-4 underline text-indigo-600 text-sm"
                onClick={() => this.resetLocation()}>
                (Clear)
              </button>
            }
          </div>
        ) : (
          // What to display when the user clicks to change location
          <div className={`flex items-center w-full ${this.props.className}`}>
            <div className="flex justify-between items-center w-full mr-4 relative">
              <PlacesAutocomplete
                value={this.state.name}
                onChange={address => this.onChange(address)}
                onSelect={address => this.onSelect(address)}
                onBlur={() => console.log("BLUr")}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div style={{ width: '100%' }}>
                    <input
                      {...getInputProps({
                        placeholder: 'Enter an address',
                        className: 'location-search-input'
                      })}
                      value={this.state.name}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
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
            </div>
            <button
              className="rounded-md px-3 py-2 bg-transparent border border-gray-600 mr-2 ml-auto text-sm"
              onClick={() => this.toggleChangeLocation(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-md px-4 py-2 bg-blue-600 text-sm text-white font-semibold"
              disabled={this.state.fetchingLatLng}
              onClick={() => this.updateLocation()}
            >
              {this.state.fetchingLatLng ? (
                <span className="loading-spinner loading-spinner-white"></span>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default LocationBar;
