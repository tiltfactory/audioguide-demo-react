import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryPage.css';
import ItineraryHeader from '../../components/ItineraryHeader';
import FilterableStopList from '../../components/FilterableStopList';
import { CONSUMER_ID, JSON_API_URL } from '../../constants/env';

class ItineraryPage extends React.Component {
  static propTypes = {
    languageId: PropTypes.string.isRequired,
    itineraryId: PropTypes.string.isRequired,
  };

  /**
   * Returns the JSON API endpoint for the current itinerary term.
   *
   * @returns {string}
   */
  static getItineraryTermEndpoint(languageId, itineraryId) {
    return `${JSON_API_URL}/${languageId}/jsonapi/taxonomy_term/audio_itinerary/${itineraryId}?_consumer_id=${CONSUMER_ID}&include=field_image,field_background_image`;
  }

  /**
   * Returns the JSON API endpoint for the child itineraries from the current parent itinerary if any.
   * @todo currently, there is an issue on getting the parent / child relationship
   * so we are getting all available terms.
   *
   * @param languageId
   */
  static getChildItineraryTermsEndpoint(languageId) {
    return `${JSON_API_URL}/${languageId}/jsonapi/taxonomy_term/audio_itinerary?_consumer_id=${CONSUMER_ID}&sort=weight&include=field_image`;
  }

  /**
   * Returns the JSON API endpoint for the translated node stops for the current itinerary.
   *
   * @returns {string}
   */
  static getItineraryStopNodesEndpoint(languageId, itineraryId) {
    return `${JSON_API_URL}/${languageId}/jsonapi/node/audio?_consumer_id=${CONSUMER_ID}&sort=field_weight&filter[field_audio_itinerary.uuid][value]=${
      this.props.itineraryId
    }&include=field_image`;
  }

  /**
   * Returns the JSON API endpoint for the available translated node stops that are not part of the current itinerary.
   *
   * @returns {string}
   */
  static getExternalStopNodesEndpoint(languageId, itineraryId) {
    return `${JSON_API_URL}/${languageId}/jsonapi/node/audio?_consumer_id=${CONSUMER_ID}&sort=field_weight&include=field_image&filter[not-current-itinerary][condition][path]=field_audio_itinerary.uuid&filter[not-current-itinerary][condition][operator]=NOT%20IN&filter[not-current-itinerary][condition][value][]=${
      this.props.itineraryId
    }`;
  }

  /**
   * Attaches the includes Url to the stops data.
   *
   * @returns {Array}
   */
  static stopsWithIncludedUrl(stops) {
    const stopsWithIncluded = [];
    const isEmptyStops =
      Object.keys(stops).length === 0 && stops.constructor === Object;
    if (!isEmptyStops) {
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
    }
    return stopsWithIncluded;
  }

  constructor(props) {
    super(props);
    this.state = {
      itinerary: [],
      itineraryWithIncluded: [],
      itineraryHasError: false,
      itineraryIsLoading: true,
      childItinerary: [],
    };
  }

  componentDidMount() {
    const endpoint = ItineraryPage.getItineraryTermEndpoint(
      this.props.languageId,
      this.props.itineraryId,
    );
    this.fetchItinerary(endpoint);
  }

  getImageFromItineraryIncluded(imageId) {
    let result = null;
    const image = this.state.itinerary.included.filter(
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
  setItineraryWithIncludedUrl() {
    const tmpItinerary = this.state.itinerary.data;
    if (this.state.itinerary.data.relationships.field_image.data !== null) {
      const iconImageId = this.state.itinerary.data.relationships.field_image
        .data.id;
      tmpItinerary.iconImageUrl = this.getImageFromItineraryIncluded(
        iconImageId,
      );
    }
    if (
      this.state.itinerary.data.relationships.field_background_image.data !==
      null
    ) {
      const backgroundImageId = this.state.itinerary.data.relationships
        .field_background_image.data.id;
      tmpItinerary.backgroundImageUrl = this.getImageFromItineraryIncluded(
        backgroundImageId,
      );
    }
    this.setState({ itineraryWithIncluded: tmpItinerary });
  }

  /**
   * Fetches current itinerary data.
   *
   * @param endpoint
   */
  fetchItinerary(endpoint) {
    this.setState({ itineraryIsLoading: true });
    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      // ES6 property value shorthand for { itineraries: itineraries }
      // and use the second parameter as a callback.
      .then(itinerary => {
        this.setState({ itinerary }, this.setItineraryWithIncludedUrl);
        this.setState({ itineraryIsLoading: false });
      })
      .catch(() => this.setState({ itineraryHasError: true }));
  }

  render() {
    /*
    const itineraryStops = ItineraryPage.stopsWithIncludedUrl(
      this.props.itineraryStops,
    );
    const externalStops = ItineraryPage.stopsWithIncludedUrl(
      this.props.externalStops,
    );
    */

    if (this.state.itineraryHasError) {
      return <p>Error while loading itinerary.</p>;
    }

    if (this.state.itineraryIsLoading) {
      return <p>Loading itinerary...</p>;
    }

    return (
      <div className={s.wrapper}>
        <div className={s.container}>
          <ItineraryHeader itinerary={this.state.itineraryWithIncluded} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryPage);
