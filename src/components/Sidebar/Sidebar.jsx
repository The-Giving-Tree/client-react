import * as React from 'react';
import './Sidebar.css';

// Icons
import { ReactComponent as IconCare } from '../../assets/icons/care.svg';
import { ReactComponent as IconSearch } from '../../assets/icons/search.svg';
import { ReactComponent as IconBadge } from '../../assets/icons/badge.svg';
import {
  ReactComponent as IconHeart
} from '../../assets/icons/Heart_Inctive.svg';
import {
  ReactComponent as IconHeartActive
} from '../../assets/icons/Heart_Active.svg';


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
      <aside className="">
        {/* Mobile Nav HERE */}
        <nav className="sidebar-nav-xs fixed w-full">
          <ul className="list-none py-1 flex items-end justify-between">
            <li className={`px-2 ${(this.isLocation('/home/discover')) ? 'nav-item-active' : ''}`}>
              <button onClick={() => {
                window.location = '/home/discover';
              }}
                className="flex flex-col items-center justify-center">
                  <IconSearch className="mb-1" />
                  <strong>Requests feed</strong>
              </button>
            </li>

            <li className={`px-2 ${(this.isLocation('/submit')) ? 'nav-item-active' : ''}`}>
              <button onClick={() => {
                const loc = (authenticated) ? '/submit' : '/signup';
                window.location = loc;
              }}
                className="flex flex-col items-center justify-center">
                {this.isLocation('/submit') ? (
                  <IconHeartActive className="icon-heart-active mb-1" />
                ) : (
                  <IconHeart className="icon-heart mb-1" />
                )}
                
                <strong>Create request</strong>
              </button>
            </li>

            <li className={`px-2 ${(this.isLocation('/home/ongoing')) ? 'nav-item-active' : ''}`}>
              <button onClick={() => {
                window.location = '/home/ongoing';
              }}
                className="flex flex-col items-center justify-center">
                  <IconCare className="mb-1" />
                  <strong>Your activity</strong>
              </button>
            </li>

            <li className={`px-2 ${(this.isLocation('/leaderboard')) ? 'nav-item-active' : ''}`}>
              <button onClick={() => {
                window.location = '/leaderboard';
              }}
                className="flex flex-col items-center justify-center">
                  <IconBadge className="icon-badge mb-1" />
                  <strong>View Leaderboard</strong>
              </button>
            </li>
          </ul>
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
                    <IconSearch className="w-6 h-6 xl:h-5 xl:w-5" />
                  </span>
                  <strong>Requests feed</strong>
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
                  {this.isLocation('/submit') ? (
                    <IconHeartActive className="icon-heart-active w-6 h-6 xl:h-5 xl:w-5" />
                  ) : (
                    <IconHeart className="icon-heart w-6 h-6 xl:h-5 xl:w-5" />
                  )}
                </span>
                <strong>Create request</strong>
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
                    <IconCare className="w-6 h-6 xl:h-5 xl:w-5" />
                  </span>
                  <strong>Your activity</strong>
              </button>
            </li>

            <li className={`text-black transition duration-150 xl:my-2 mx-2 md:mx-4 xl:hidden xl:mx-0 relative ${(this.isLocation('/home/ongoing')) ? 'nav-item-active' : ''}`}>
              <button onClick={() => {
                window.location = '/home/ongoing';
              }}
                className="flex flex-col xl:flex-row items-center justify-center 
                xl:justify-start">
                  <span className="xl:inline-block border h-12 w-12 rounded-full 
                  border-gray-300 border flex items-center justify-center 
                  xl:mr-3 xl:border-none xl:h-5 xl:w-5 bg-white mb-1 xl:mb-0 xl:shadow-none xl:bg-transparent">
                    <IconBadge className="icon-badge" />
                  </span>
                  <strong>View Leaderboard</strong>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }
}

export default Sidebar;
