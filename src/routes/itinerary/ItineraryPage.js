import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryPage.css';
import ItineraryHeader from '../../components/ItineraryHeader';
import FilterableStopList from '../../components/FilterableStopList';
import { JSON_API_URL } from '../../constants/env';

class ItineraryPage extends React.Component {
  static propTypes = {
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
    stops: PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
      included: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  };

  getImageFromItineraryIncluded(imageId) {
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
      tmpItinerary.iconImageUrl = this.getImageFromItineraryIncluded(
        iconImageId,
      );
    }
    if (itinerary.data.relationships.field_background_image.data !== null) {
      const backgroundImageId =
        itinerary.data.relationships.field_background_image.data.id;
      tmpItinerary.backgroundImageUrl = this.getImageFromItineraryIncluded(
        backgroundImageId,
      );
    }
    return tmpItinerary;
  }

  /**
   * Attaches the includes Url to the stops data.
   *
   * @returns {Array}
   */
  stopsWithIncludedUrl() {
    const stops = this.props.stops;
    const stopsWithIncluded = [];
    stops.data.forEach(stop => {
      const tmpStop = stop;
      // @todo refactor getImageFromItineraryIncluded
      if (stop.relationships.field_image.data !== null) {
        const imageId = stop.relationships.field_image.data.id;
        const image = stops.included.filter(obj => obj.id === imageId);
        tmpStop.imageUrl = `${JSON_API_URL}/${image[0].attributes.url}`;
      }
      stopsWithIncluded.push(tmpStop);
    });
    return stopsWithIncluded;
  }

  render() {
    // const stops = this.stopsWithIncludedUrl;
    const stops = this.stopsWithIncludedUrl();
    const itinerary = this.itineraryWithIncludedUrl();

    return (
      <div className={s.root}>
        <div className={s.container}>
          <ItineraryHeader itinerary={itinerary} />
          <FilterableStopList itinerary_id={itinerary.id} stops={stops} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryPage);
