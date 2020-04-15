import * as React from 'react';
import { connect } from 'react-redux';

class Avatar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      src: '',
      color: '',
      initial: '',
      loading: true
    }
  }

  componentDidMount() {
    this.setImage();
  }

  componentDidUpdate(prevProps, prevState) { }

  /**
   * TODO: Add description of what this function does.
   * @param {*} username
   * @param {*} version
   */
  generateHash(username = '', version = 0) {
    const secret = 'givingtree';
    const hash = require('crypto')
      .createHmac('sha256', secret)
      .update(username.toLowerCase())
      .digest('hex');

    const suffix =
      Number(version) === 0 || !version ? '' : `%3Fver%3D${version}`;
    const url =
      `https://d1ppmvgsdgdlyy.cloudfront.net/user/${hash}${suffix}`;

    return url;
  }

  /**
   * Generate a random colour based off the username. Used for the fallback,
   * and background colour of the avatar
   * @param {*} str
   * @param {*} s
   * @param {*} l
   */
  stringToHslColor(str, s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  /**
   * Check to see if the user has uploaded an image. If not, set a fallback.
   *
   * @memberof Avatar
   */
  setImage() {    
    const imgUrl = this.generateHash(this.props.user.username,
      this.props.user.profileVersion);

    this.checkImage(imgUrl).then(res => {
      this.setState({ 
        src: imgUrl,
        loading: false,
        color: this.stringToHslColor(this.props.user.username, 80, 45),
      });
    }).catch(err => {
      this.setFallBack();
    })
  }

  /**
   * Check to see if the image exists at the hashed location
   *
   * @memberof Avatar
   */
  checkImage = path =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => resolve({path, status: 'ok'});
      img.onerror = () => reject({path, status: 'error'});
    });

  /**
   * Set a fallback profile image. Take the first letter of their username,
   * and randomly generate a colour.
   *
   * @memberof Avatar
   */
  setFallBack() {
    const letter = this.props.user.username.charAt(0).toUpperCase();
    this.setState({ 
      initial: letter,
      color: this.stringToHslColor(this.props.user.username, 80, 45),
      loading: false
    })
  }

  render() {
    return (
      <div id={this.props.id} 
      className={`${this.props.className} Avatar inline-flex items-center justify-center w-8 h-8 
      overflow-hidden rounded-full ${this.state.loading ? `bg-gray-200` : ''}`} 
      style={{
        backgroundColor: this.state.color
      }}>
        {this.state.src ? (
          <img src={
            this.state.src} alt={`Avatar for: ${this.props.user.username}`}/>
        ) : (
          <span className="text-white text-xl">{this.state.initial}</span>
        )}
      </div>
    );

  }
}

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Avatar);
