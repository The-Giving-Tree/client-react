import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { getLeaderboard } from '../../store/actions/auth/auth-actions';

function LeaderboardTable(props) {
  const { user, limit, leaderboard, getLeaderboardDispatch } = props;

  const history = useHistory();

  React.useEffect(() => {
    getLeaderboardDispatch({
      env: process.env.REACT_APP_NODE_ENV,
      location: 'global'
    });
  }, [getLeaderboardDispatch]);

  const getLeaderboardIcon = place => {
    switch (place.toString()) {
      case '1':
        return (
          <img
            src="https://d1ppmvgsdgdlyy.cloudfront.net/1st.svg"
            alt="1st"
            style={{ height: 20 }}
          />
        );
      case '2':
        return (
          <img
            src="https://d1ppmvgsdgdlyy.cloudfront.net/2nd.svg"
            alt="2nd"
            style={{ height: 20 }}
          />
        );
      case '3':
        return (
          <img
            src="https://d1ppmvgsdgdlyy.cloudfront.net/3rd.svg"
            alt="3rd"
            style={{ height: 20 }}
          />
        );
      default:
        return place;
    }
  };

  /**
   * The Leaderboard Table Row JSX
   * @param {*} item
   * @param {*} i
   */
  const getLeaderBoardRow = (item, i) => {
    return (
      <tr key={i}>
        <td
          className={`px-4 py-2 flex justify-center items-center`}
          style={{
            fontSize: '14px',
            lineHeight: '17px',
            fontStyle: 'normal',
            fontWeight: 'normal'
          }}
        >
          {getLeaderboardIcon(item.ranking)}
        </td>
        <td
          onClick={() => history.push(`/user/${item.username}`)}
          className={`px-4 py-2 text-left hover:text-indigo-600 transition duration-150`}
          style={{
            cursor: 'pointer',
            fontSize: '14px',
            lineHeight: '17px',
            fontStyle: 'normal',
            fontWeight: 'normal'
          }}
        >
          <div className="flex items-center">{item.username}</div>
        </td>
        <td
          className={`px-4 py-2`}
          style={{
            fontSize: '14px',
            lineHeight: '17px',
            fontStyle: 'normal',
            fontWeight: 'normal'
          }}
        >
          {item.karma}
        </td>
      </tr>
    );
  };

  /**
   * TODO: Add user ranking to user object.
   * Ranking is not stored in the user objects. Adding it here temporarily.
   */
  const setRanking = rows => {
    rows.forEach((row, i) => {
      row.ranking = i + 1;
    });

    return rows;
  };

  /**
   * Initialise the leaderboard table, based on the properties that have been
   * set
   */
  const initLeaderBoard = () => {
    // User objects in leaderboard array doesn't have ranking set. Will have
    // to set it here...
    setRanking(leaderboard);

    // Check if a specific user has been chosen
    if (user) {
      // If a specific user has been chosen, filter them from the leaderboard
      // for display
      const found = leaderboard.filter(item => {
        return item.username === user.username;
      });

      const rows = found.length ? found : [];

      return getLeaderboardTemplate(rows);
    } else {
      // If a limit has been set, we want to limit the rows
      const board = leaderboard.filter((item, i) => {
        if (limit) {
          return Number(i) < Number(limit);
        } else {
          return Number(i);
        }
      });

      // If not display full leaderboard
      return getLeaderboardTemplate(board);
    }
  };

  /**
   * What to return when the leaderboard is empty.
   */
  const emptyLeadboardJSX = () => {
    return <div className="text-center">no items in leaderboard</div>;
  };

  /**
   * Get the template to display for the leaderboard
   * @param {*} rows The array of user objects
   */
  const getLeaderboardTemplate = rows => {
    return (
      <table className="table-auto border-transparent" style={{ width: '99%' }}>
        <thead>
          <tr>
            <th
              className="px-4 py-2"
              style={{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '12px',
                lineHeight: '15px'
              }}
            >
              Rank
            </th>
            <th
              className="px-4 py-2 text-left"
              style={{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '12px',
                lineHeight: '15px'
              }}
            >
              Helper
            </th>
            <th
              className="px-4 py-2"
              style={{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '12px',
                lineHeight: '15px'
              }}
            >
              Karma
            </th>
          </tr>
        </thead>
        <tbody>{rows.map((item, i) => getLeaderBoardRow(item, i))}</tbody>
      </table>
    );
  };

  return leaderboard.length === 0 ? emptyLeadboardJSX() : initLeaderBoard();
}

const mapDispatchToProps = dispatch => ({
  getLeaderboardDispatch: payload => dispatch(getLeaderboard(payload))
});

const mapStateToProps = state => ({
  leaderboard: state.auth.leaderboard
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardTable);
