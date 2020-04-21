import * as React from 'react';

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
    if (this.props.user.username) { // Set the image if the user is defined
      this.setImage();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user !== prevProps.user) {
      this.setImage();
    }
  }

  componentWillUnmount() {
  }

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
  checkImage(path) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = (e) => {
        resolve({path, status: 'ok'})
      };
      img.onerror = (e) => {
        reject({path, status: 'error'})
      };
      img.src = path;
      img = null;
    });
  }

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
          <img 
            loading="lazy"
            src={
            this.state.src} alt={`Avatar for: ${this.props.user.username}`}/>
        ) : (
          <span className="text-white text-xl">{this.state.initial}</span>
        )}
      </div>
    );

  }
}

export default Avatar;
