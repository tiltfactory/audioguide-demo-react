import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Ionicon from 'react-ionicons';
import s from './StopHeader.css';
import Link from '../Link';
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
    bg: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
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
    const backgroundImage = this.props.bg;

    return (
      <header className={s.header}>
        <div className={s.container}>
          <div className={s.contentHeader}>
            <Link
              to={`/itinerary/${this.props.itinerary.data.id}`}
              className={s.backUrl}
            >
              <Ionicon
                icon="md-arrow-round-back"
                fontSize="22px"
                color="#BE9F8A"
              />
              {itinerary.iconImageUrl !== null ? (
                <img src={itinerary.iconImageUrl} alt={itinerary.title} />
              ) : (
                <span />
              )}
            </Link>
            <div className={s.stopLocation}>
              {itinerary.attributes.name}{' '}
              <span>{stop.data.attributes.field_id}</span>
            </div>
          </div>
          <h1 className={s.title}>{stop.data.attributes.title}</h1>
        </div>
        <div className={s.background} style={backgroundImage} />
      </header>
    );
  }
}

export default withStyles(s)(StopHeader);
