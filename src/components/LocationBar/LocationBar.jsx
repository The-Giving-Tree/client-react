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

  render() {
    return (
      <div>
        {// What to display when the location is set
        !this.state.showChangeLocation ? (
          <div className="py-2">
            <span className="mr-2">
              Your current location:
            </span>
            <span>
              {!this.props.location.name ? 'Earth 🌍' : this.props.location.name}
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
          <div className="flex items-center w-full">
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
              className="rounded-full px-4 py-2 bg-transparent border border-gray-600 mr-3 ml-auto"
              onClick={() => this.toggleChangeLocation(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-full px-4 py-2 bg-blue-600 text-white font-semibold"
              onClick={() => {
                this.props.setLocation({
                  name: this.state.locationName,
                  lat: this.state.latLng.lat,
                  lng: this.state.latLng.lng
                });
                this.toggleChangeLocation(false);
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default LocationBar;
