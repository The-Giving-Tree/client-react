/* eslint-disable */
import * as React from 'react';
import { connect } from 'react-redux';

import Navigation from '../../components/Navigation';

import {
  loadStats,
} from '../../store/actions/auth/auth-actions';
import { Link } from 'react-router-dom';

class Stats extends React.Component {
  componentDidMount() {
    this.props.loadStatsDispatch({
      env: process.env.REACT_APP_NODE_ENV
    });
  }

  recentDaysSignUps() {
    return this.props.stats.userSignups ? this.props.stats.userSignups.days : [];
  }
  dayUsers(day) {
    return Object.keys(day.byHour).map((hour) => <li>
      {hour}:00
      <ul>
        {day.byHour[hour].map((user) => <li>
          <Link to={`/user/${user.username}`} className="text-blue-700">{user.name}</Link>
          &nbsp;
          <a href={`mailto:${user.email}`} target="_blank">{user.email}</a>
        </li>)}
      </ul>
    </li>);
  }

  render() {
    return (
      <div>
        <Navigation searchBarPosition="center" />
        <div className="flex-grow py-8 lg:py-20 LandingPage bg-white">
          <div className="max-w-screen-lg w-full mx-auto px-6 xl:px-0">
            <div className="grid grid-cols-1 md:grid-cols-1">
              <div className="col-span-1">
                <h1 className="text-2xl font-light mb-4">Network Statistics</h1>

                {/* Requests */}
                <h2 className="text-xl mb-2">Request Info</h2>
                {
                  this.props.stats.requests && (
                    <div className="flex mb-4 pt-4 bg-gray-100">
                      <div className="w-1/4 text-center">
                        <p>Total</p>
                        <p className="text-4xl p-4">{this.props.stats.requests.total}</p>
                      </div>
                      <div className="w-1/4 text-center">
                        <p>Claimed</p>
                        <p className="text-4xl p-4">{this.props.stats.requests.claimed}</p>
                      </div>
                      <div className="w-1/4 text-center">
                        <p>Completed</p>
                        <p className="text-4xl p-4">{this.props.stats.requests.completed}</p>
                      </div>
                      <div className="w-1/4 text-center">
                        <p>Released</p>
                        <p className="text-4xl p-4">{this.props.stats.requests.released}</p>
                      </div>
                    </div>
                  )
                }

                {/* User Signups */}
                <h2 className="text-xl mb-2">User Sign Ups</h2>
                {
                  this.props.stats.userSignups && (
                    <div>
                      <p>Total users: <span className="text-xl text-hlgreen">{this.props.stats.userSignups.total}</span></p>
                      <div className="mt-3">
                        {this.recentDaysSignUps().map(day => {
                          return <div>
                            <p>
                              {day.date}: &nbsp;
                              <span className="font-mono inline-block text-xl text-hlgreen">{day.total}</span> new users
                            </p>
                            <ul className="mb-4 pl-2">
                              {this.dayUsers(day)}
                            </ul>
                          </div>
                        })}
                      </div>
                    </div>
                  )
                }
                {/* <pre>
                  {JSON.stringify(this.props.stats, null, 2)}
                </pre> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadStatsDispatch: payload => dispatch(loadStats(payload))
});

const mapStateToProps = state => ({
  stats: state.auth.stats,
  statsLoading: state.auth.statsLoading
});

Stats.defaultProps = {};

Stats.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)((Stats));
