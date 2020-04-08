import * as React from 'react';
import './StickyFooter.css';

// Custom Components
import Footer from '../../components/Footer';

class StickyFooter extends React.Component {
  constructor(props) {
    super(props);

    if (!props.children) props.children = '';
  }

  render() {
    return (
      <div className="flex flex-col flex-grow">
        <div className="flex-grow flex flex-col">{this.props.children}</div>
        <Footer />
      </div>
    );
  }
}

export default StickyFooter;
