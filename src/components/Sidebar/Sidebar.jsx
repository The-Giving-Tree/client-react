import * as React from 'react';
import './Sidebar.css';

// Icons
import {
  ReactComponent as IconActivity
} from '../../assets/icons/your_activity.svg';
import {
  ReactComponent as IconLeaderboard
} from '../../assets/icons/view_leaderboard.svg';
import {
  ReactComponent as IconCreate
} from '../../assets/icons/create_request.svg';
import {
  ReactComponent as IconHome
} from '../../assets/icons/requests_feed.svg';


class Sidebar extends React.Component {

  constructor(props) {
    super(props);

    this.state = { }
  }

  componentDidMount() {
  }

  componentDidUpdate(oProps, oState) {
  }

  /**
   * Check if current URL matches value provided
   *
   * @param {*} val
   * @returns
   * @memberof Sidebar
   */
  isLocation(val) {
    return this.props.match.url === val;
  }

  render() {
    const authenticated = localStorage.getItem('giving_tree_jwt');
    return (
      <aside className={`${this.props.className ? this.props.className : ''}`}>
        {/* Mobile Nav HERE */}
        <nav className="sidebar-nav-xs fixed w-full flex">
          <a href="/home/discover" className={`flex flex-col justify-end p-2 ${(this.isLocation('/home/discover')) ? 'nav-item-active' : ''} border border-right border-gray-200 flex-grow-1 flex-shrink-1 flex-basis-0 border-r border-gray-200 w-full text-center`}>
            <IconHome className="mb-1 mx-auto" />
            <span className="label-wrap">
              Requests<br/>Feed
            </span>
          </a>

          <a href={(authenticated) ? '/submit' : '/signup'} 
            className={`p-2 flex flex-col justify-end border-r border-gray-200 mx-auto ${(this.isLocation('/submit')) ? 'nav-item-active' : ''} w-full text-center`}>
              <IconCreate className="icon-create mb-1 mx-auto" />
              <span className="label-wrap">
                Create<br/>Request
              </span>
          </a>

          
          <a href="/home/ongoing" className={`flex flex-col justify-end border-r border-gray-200 mx-auto p-2 ${(this.isLocation('/home/ongoing')) ? 'nav-item-active' : ''} w-full text-center`}>
            <IconActivity className="mb-1 mx-auto" />
            <span className="label-wrap">
              Your<br/>Activity
            </span>
          </a>
          

          <a href="/leaderboard"
            className={`p-2 ${(this.isLocation('/leaderboard')) ? 'nav-item-active' : ''} border-r border-gray-200 w-full text-center flex flex-col justify-end`}>
              <IconLeaderboard className="icon-leaderboard mb-1 mx-auto" />
              <span className="label-wrap">
                View<br/>Leaderboard
              </span>
          </a>
        </nav>

        {/* Table & Desktop Nav */}
        <nav className="mb-10 sidebar-nav-sm">
          <ul className="list-none p-0 m-0 flex items-center justify-center xl:block">
            <li className={`text-black transition duration-150 xl:my-2 mx-2 md:mx-4 xl:mx-0 relative ${(this.isLocation('/home/discover')) ? 'nav-item-active' : ''}`}>
              <button onClick={() => {
                window.location = '/home/discover';
              }}
                className="flex flex-col xl:flex-row items-center justify-center 
                xl:justify-start">
                  <span className="xl:inline-block border h-12 w-12 rounded-full 
                  border-gray-300 border flex items-center justify-center 
                  xl:mr-3 xl:border-none xl:h-5 xl:w-5 bg-white mb-1 xl:mb-0 xl:shadow-none xl:bg-transparent">
                    <IconHome className="w-6 h-6 xl:h-5 xl:w-5" />
                  </span>
                  <span className="label-wrap">Requests Feed</span>
              </button>
            </li>
            
            <li className={`text-black transition duration-150 xl:my-2 mx-2 md:mx-4 xl:mx-0 relative ${(this.isLocation('/submit')) ? 'nav-item-active' : ''}`}>
              <button onClick={() => {
                const loc = (authenticated) ? '/submit' : '/signup';
                window.location = loc;
              }}
                className="flex flex-col xl:flex-row items-center justify-center 
                xl:justify-start">
                  <span className="xl:inline-block border h-12 w-12 rounded-full 
                  border-gray-300 border flex items-center justify-center xl:mr-3 
                  xl:border-none xl:h-5 xl:w-5 bg-white mb-1 xl:mb-0 xl:shadow-none xl:bg-transparent">
                    <IconCreate className="icon-heart w-6 h-6 xl:h-5 xl:w-5" />
                  </span>
                <span className="label-wrap">Create Request</span>
              </button>
            </li>

            <li className={`text-black transition duration-150 xl:my-2 mx-2 md:mx-4 xl:mx-0 relative ${(this.isLocation('/home/ongoing')) ? 'nav-item-active' : ''}`}>
              <button onClick={() => {
                window.location = '/home/ongoing';
              }}
                className="flex flex-col xl:flex-row items-center justify-center 
                xl:justify-start">
                  <span className="xl:inline-block border h-12 w-12 rounded-full 
                  border-gray-300 border flex items-center justify-center 
                  xl:mr-3 xl:border-none xl:h-5 xl:w-5 bg-white mb-1 xl:mb-0 xl:shadow-none xl:bg-transparent">
                    <IconActivity className="w-6 h-6 xl:h-5 xl:w-5" />
                  </span>
                  <span className="label-wrap">Your Activity</span>
              </button>
            </li>

            <li className={`text-black transition duration-150 xl:my-2 mx-2 md:mx-4 xl:hidden xl:mx-0 relative ${(this.isLocation('/leaderboard')) ? 'nav-item-active' : ''}`}>
              <button onClick={() => {
                window.location = '/leaderboard';
              }}
                className="flex flex-col xl:flex-row items-center justify-center 
                xl:justify-start">
                  <span className="xl:inline-block border h-12 w-12 rounded-full 
                  border-gray-300 border flex items-center justify-center 
                  xl:mr-3 xl:border-none xl:h-5 xl:w-5 bg-white mb-1 xl:mb-0 xl:shadow-none xl:bg-transparent">
                    <IconLeaderboard className="icon-badge" />
                  </span>
                  <span className="label-wrap">View Leaderboard</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }
}

export default Sidebar;
