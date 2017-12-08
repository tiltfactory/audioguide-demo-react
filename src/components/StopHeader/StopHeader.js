import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StopHeader.css';
import Link from '../Link';
import LanguageSwitcher from '../LanguageSwitcher';
import { JSON_API_URL } from '../../constants/env';

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

  getImageFromIncluded(imageId) {
    let result = null;
    const image = this.props.itinerary.included.filter(
      obj => obj.id === imageId,
    );
    if (image[0]) {
      result = `${JSON_API_URL}/${image[0].attributes.url}`;
    }
    return result;
  }

  /**
   * Attaches the includes Url to the itinerary data.
   *
   * @returns {Array}
   */
  itineraryWithIncludedUrl() {
    const itinerary = this.props.itinerary;
    const tmpItinerary = itinerary.data;
    if (itinerary.data.relationships.field_image.data !== null) {
      const iconImageId = itinerary.data.relationships.field_image.data.id;
      tmpItinerary.iconImageUrl = this.getImageFromIncluded(iconImageId);
    }
    return tmpItinerary;
  }

  render() {
    const stop = this.props.stop;
    const itinerary = this.itineraryWithIncludedUrl();

    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link to={`/itinerary/${this.props.itinerary.data.id}`}>
            Back to itinerary
            {itinerary.iconImageUrl !== null
              ? <img src={itinerary.iconImageUrl} alt={itinerary.title} />
              : <span>Image empty state</span>}
          </Link>
          <span className={s.stopLocation}>
            {itinerary.attributes.name} | {stop.data.attributes.field_id}
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
