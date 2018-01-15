import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryPage.css';
import ItineraryHeader from '../../components/ItineraryHeader';
import FilterableStopList from '../../components/FilterableStopList';

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

    childItineraries: PropTypes.shape({
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
    }),

    itineraryStops: PropTypes.shape({
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

    externalStops: PropTypes.shape({
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

  static defaultProps = {
    childItineraries: null,
  };

  /**
   * Attaches the includes Url to the stops data.
   *
   * @returns {Array}
   */
  static stopsWithIncludedUrl(stops) {
    const stopsWithIncluded = [];
    stops.data.forEach(stop => {
      const tmpStop = stop;
      // @todo refactor getImageFromItineraryIncluded
      if (stop.relationships.field_image.data !== null) {
        const imageId = stop.relationships.field_image.data.id;
        const image = stops.included.filter(obj => obj.id === imageId);
        tmpStop.imageUrl = image[0].meta.derivatives.thumbnail;
      }
      stopsWithIncluded.push(tmpStop);
    });
    return stopsWithIncluded;
  }

  getImageFromItineraryIncluded(imageId) {
    let result = null;
    const image = this.props.itinerary.included.filter(
      obj => obj.id === imageId,
    );
    if (image[0]) {
      result = image[0].meta.derivatives.thumbnail;
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

  render() {
    const itineraryStops = ItineraryPage.stopsWithIncludedUrl(
      this.props.itineraryStops,
    );
    const externalStops = ItineraryPage.stopsWithIncludedUrl(
      this.props.externalStops,
    );
    const itinerary = this.itineraryWithIncludedUrl();

    return (
      <div className={s.wrapper}>
        <div className={s.container}>
          <ItineraryHeader itinerary={itinerary} />
          <FilterableStopList
            itinerary_id={itinerary.id}
            childItineraries={this.props.childItineraries}
            itineraryStops={itineraryStops}
            externalStops={externalStops}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryPage);
