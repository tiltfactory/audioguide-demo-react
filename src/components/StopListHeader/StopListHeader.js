import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StopListHeader.css';
import Link from '../Link';
import LanguageSwitcher from '../LanguageSwitcher';

class StopListHeader extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link to="/">Back to itineraries</Link>
          <LanguageSwitcher />
          <p>Itinerary title</p>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(StopListHeader);
