/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StopListPage.css';
import Link from '../../components/Link';

class StopListPage extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    itinerary_id: PropTypes.string.isRequired,
    stops: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  render() {
    const { stops } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <Link to="/">Back to itineraries</Link>
          <ul>
            {stops.map(stop =>
              <li key={stop.id}>
                <Link to={`/stop/${this.props.itinerary_id}/${stop.id}`}>
                  {stop.attributes.title}
                </Link>
              </li>,
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(StopListPage);
