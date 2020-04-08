import * as React from 'react';
// import Constants from './Constants';
// import { NavLink } from 'react-router-dom';

class Sidebar extends React.Component {
  render() {
    const authenticated = localStorage.getItem('giving_tree_jwt');
    return (
      <aside className="sidebar-nav">
        {/* Mobile Nav HERE */}

        {/* Table & Desktop Nav */}
        <nav className="lg:block mb-4">
          <ul className="list-none p-0 m-0 flex items-center justify-center xl:block xl:px-6">
            <li className="text-black transition duration-150 xl:my-2 mx-4 xl:mx-0">
              <button
                onClick={() => {
                  window.location = '/home/discover';
                }}
                className="flex flex-col xl:flex-row items-center justify-center xl:justify-start"
              >
                <span className="xl:inline-block border h-10 w-10 rounded-full border-gray-300 border flex items-center justify-center xl:mr-3 xl:border-none xl:h-5 xl:w-5 bg-white">
                  <img
                    alt="search"
                    className="block w-5 h-5 xl:w-full xl:h-full"
                    src="https://d1ppmvgsdgdlyy.cloudfront.net/search.svg"
                  />
                </span>
                <span>Find Requests</span>
              </button>
            </li>

            <li className="text-black transition duration-150 xl:my-2 mx-4 xl:mx-0">
              <button
                onClick={() => {
                  window.location = '/home/ongoing';
                }}
                className="flex flex-col xl:flex-row items-center justify-center xl:justify-start"
              >
                <span className="xl:inline-block border h-10 w-10 rounded-full border-gray-300 border flex items-center justify-center xl:mr-3 xl:border-none xl:h-5 xl:w-5 bg-white">
                  <img
                    alt="search"
                    className="block w-5 h-5 xl:w-full xl:h-full"
                    src="https://d1ppmvgsdgdlyy.cloudfront.net/care.svg"
                  />
                </span>
                Your requests
              </button>
            </li>

            <li className="text-black transition duration-150 xl:my-2 mx-4 xl:mx-0 hidden xl:block">
              <button
                onClick={() => {
                  window.location = '/home/completed';
                }}
                className="flex flex-col xl:flex-row items-center justify-center xl:justify-start"
              >
                <span className="xl:inline-block border h-10 w-10 rounded-full border-gray-300 border flex items-center justify-center xl:mr-3 xl:border-none xl:h-5 xl:w-5 bg-white">
                  <img
                    alt="Gift"
                    className="block w-5 h-5 xl:w-full xl:h-full"
                    src="https://d1ppmvgsdgdlyy.cloudfront.net/gift.svg"
                  />
                </span>
                Completed requests
              </button>
            </li>

            <li className="text-black transition duration-150 xl:my-2 mx-4 xl:mx-0">
              <button
                onClick={() => {
                  window.location = '/home/global';
                }}
                className="flex flex-col xl:flex-row items-center justify-center xl:justify-start"
              >
                <span className="xl:inline-block border h-10 w-10 rounded-full border-gray-300 border flex items-center justify-center xl:mr-3 xl:border-none xl:h-5 xl:w-5 bg-white">
                  <img
                    alt="Global"
                    className="block w-5 h-5 xl:w-full xl:h-full"
                    src="https://d1ppmvgsdgdlyy.cloudfront.net/global.svg"
                    style={{ height: 20 }}
                  />
                </span>
                Global requests
              </button>
            </li>

            <li className="text-black transition duration-150 xl:my-2 mx-4 xl:mx-0">
              <button
                onClick={() => {
                  const loc = authenticated ? '/home/submit' : '/home/signup';
                  window.location = loc;
                }}
                className="flex flex-col xl:flex-row items-center justify-center xl:justify-start"
              >
                <span className="xl:inline-block border h-10 w-10 rounded-full border-gray-300 border flex items-center justify-center xl:mr-3 xl:border-none xl:h-5 xl:w-5 bg-white">
                  <span
                    role="img"
                    aria-label="Heart emoji"
                    className="block w-5 h-5 xl:w-full xl:h-full"
                  >
                    ❤️
                  </span>
                </span>
                Make a Request
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }
}

export default Sidebar;
