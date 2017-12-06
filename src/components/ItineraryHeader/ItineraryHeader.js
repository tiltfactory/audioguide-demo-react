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
      imageUrl: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      // relationships: PropTypes.shape({
      //   field_image: PropTypes.shape({
      //     data: PropTypes.shape({
      //       id: PropTypes.string.isRequired,
      //     }).isRequired,
      //   }).isRequired,
      // }).isRequired,
    }).isRequired,
  };

  render() {
    const itinerary = this.props.itinerary;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link to="/">Back to itineraries</Link>
          <img src={itinerary.imageUrl} alt={itinerary.attributes.name} />
          <LanguageSwitcher />
          <h1>
            {itinerary.attributes.name}
          </h1>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryHeader);
