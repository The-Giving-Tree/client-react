import * as React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import './LocationBar.css';

class LocationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showChangeLocation: false,
      locationName: '',
      latLng: {
        lat: '',
        lng: ''
      }
    };
  }

  componentDidMount() {
  }

  /**
   * Updates the location state with the input from the search field
   *
   * @param {*} val Search field input
   * @memberof LocationBar
   */
  onChange(val) {
    this.setState({ locationName: val });
  }

  /**
   * Updates the user's location, and gets the latitude & longitude
   *
   * @param {*} address
   * @memberof LocationBar
   */
  onSelect(address) {
    this.setState({ locationName: address });
    geocodeByAddress(address)
      .then(res => getLatLng(res[0]))
      .then(latLng => {
        this.setState({ latLng: latLng });
      });
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

  setLocalStorage(obj) {
    localStorage.setItem('user_location', obj)
  }

  updateLocation() {
    // If no location is specified, clear storage, refresh page.
    if (!this.state.locationName) {
      this.setLocalStorage('');
      return window.location = '/home/discover';
    }

    // Stringify the user's defined location values
    const jsonStr = JSON.stringify({
      name: this.state.locationName,
      latLng: {
        lat: this.state.latLng.lat,
        lng: this.state.latLng.lng
      }
    })
    // Update the location in the local storage.
    this.setLocalStorage(jsonStr)
    console.log("NEW STATE: ", this.state);
    const latLng = this.state.latLng;
    if (latLng.lat && latLng.lng) {
      window.location = `/home/discover?lat=${latLng.lat}&lng=${latLng.lng}`;
    }
    // Hide the edit location input field
    this.toggleChangeLocation(false);
  }

  getLocationName() {
    if (!this.props.location || !this.props.location.name) return 'Earth 🌍';
    return this.props.location.name;
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
              {this.getLocationName()}
            </span>
            <button
              className="ml-2 underline text-indigo-600"
              onClick={() => this.toggleChangeLocation(true)}
            >
              (Edit)
            </button>
          </div>
        ) : (
          // What to display when the user clicks to change location
          <div className={`flex items-center w-full ${this.props.className}`}>
            <div className="flex justify-between items-center w-full mr-4 relative">
              <PlacesAutocomplete
                value={this.state.locationName}
                onChange={address => this.onChange(address)}
                onSelect={address => this.onSelect(address)}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div style={{ width: '100%' }}>
                    <input
                      {...getInputProps({
                        placeholder: 'Enter an address',
                        className: 'location-search-input'
                      })}
                      value={this.state.locationName}
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
            </div>
            <button
              className="rounded-md px-3 py-2 bg-transparent border border-gray-600 mr-2 ml-auto text-sm"
              onClick={() => this.toggleChangeLocation(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-md px-4 py-2 bg-blue-600 text-sm text-white font-semibold"
              onClick={() => this.updateLocation()}
            >
              Save
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default LocationBar;
