import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryHeader.css';
import Link from '../Link';
import LanguageSwitcher from '../LanguageSwitcher';

class ItineraryHeader extends React.Component {
  static propTypes = {
    itinerary: PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link to="/">Back to itineraries</Link>
          <LanguageSwitcher />
          <p>
            {this.props.itinerary.attributes.name}
          </p>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryHeader);
