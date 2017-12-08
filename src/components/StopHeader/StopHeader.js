import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StopHeader.css';
import Link from '../Link';
import LanguageSwitcher from '../LanguageSwitcher';

class StopHeader extends React.Component {
  static propTypes = {
    stop: PropTypes.shape({
      data: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
      included: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
    itinerary: PropTypes.shape({
      data: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
      included: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  };

  render() {
    const { stop, itinerary } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link to={`/itinerary/${this.props.itinerary.data.id}`}>
            Back to itinerary
          </Link>
          <span className={s.stopLocation}>
            {itinerary.data.attributes.name} | {stop.data.attributes.field_id}
          </span>
          <LanguageSwitcher />
          <h1>
            {stop.data.attributes.title}
          </h1>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(StopHeader);
