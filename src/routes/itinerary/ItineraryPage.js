import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryPage.css';
import ItineraryHeader from '../../components/ItineraryHeader';
import FilterableStopList from '../../components/FilterableStopList';
import { JSON_API_URL } from '../../constants/env';

class ItineraryPage extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
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

  /**
   * Attaches the includes Url to the itinerary data.
   *
   * @returns {Array}
   */
  itineraryWithIncludesUrl() {
    const itinerary = this.props.itinerary;
    const tmpItinerary = itinerary.data;
    const imageId = itinerary.data.relationships.field_image.data.id;
    const image = itinerary.included.filter(obj => obj.id === imageId);
    if (image[0]) {
      tmpItinerary.imageUrl = `${JSON_API_URL}/${image[0].attributes.url}`;
    } else {
      // Images must be available in this case.
      throw new Error('No image were found');
    }
    return tmpItinerary;
  }

  /**
   * Attaches the includes Url to the stops data.
   * @todo content needed or optional image.
   *
   * @returns {Array}
   */
  stopsWithIncludesUrl() {
    const stops = this.props.stops;
    const stopsWithIncludes = [];
    stops.data.forEach(stop => {
      const tmpStop = stop;
      if (stop.relationships.field_image) {
        const imageId = stop.relationships.field_image.data.id;
        const image = stops.included.filter(obj => obj.id === imageId);
        tmpStop.imageUrl = `${JSON_API_URL}/${image[0].attributes.url}`;
      } else {
        tmpStop.imageUrl = '';
      }
      stopsWithIncludes.push(tmpStop);
    });
    return stopsWithIncludes;
  }

  render() {
    // const stops = this.stopsWithIncludesUrl;
    this.stopsWithIncludesUrl();
    const stops = this.props.stops.data;
    const itinerary = this.itineraryWithIncludesUrl();

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <ItineraryHeader itinerary={itinerary} />
          <FilterableStopList itinerary_id={itinerary.id} stops={stops} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryPage);
