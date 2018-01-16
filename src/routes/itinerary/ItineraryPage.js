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
    return `${JSON_API_URL}/${languageId}/jsonapi/node/audio?_consumer_id=${CONSUMER_ID}&sort=field_weight&filter[field_audio_itinerary.uuid][value]=${itineraryId}&include=field_image`;
  }

  /**
   * Returns the JSON API endpoint for the available translated node stops that are not part of the current itinerary.
   *
   * @returns {string}
   */
  static getExternalStopNodesEndpoint(languageId, itineraryId) {
    return `${JSON_API_URL}/${languageId}/jsonapi/node/audio?_consumer_id=${CONSUMER_ID}&sort=field_weight&include=field_image&filter[not-current-itinerary][condition][path]=field_audio_itinerary.uuid&filter[not-current-itinerary][condition][operator]=NOT%20IN&filter[not-current-itinerary][condition][value][]=${itineraryId}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      itinerary: [],
      itineraryWithIncluded: [],
      itineraryHasError: false,
      itineraryIsLoading: true,
      childItineraries: [],
      childItinerariesHasError: false,
      childItinerariesIsLoading: true,
      itineraryStops: [],
      itineraryStopsWithIncluded: [],
      itineraryStopsHasError: false,
      itineraryStopsIsLoading: true,
      externalStops: [],
      externalStopsWithIncluded: [],
      externalStopsHasError: false,
      externalStopsIsLoading: true,
    };
  }

  componentDidMount() {
    let endpoint = ItineraryPage.getItineraryTermEndpoint(
      this.props.languageId,
      this.props.itineraryId,
    );
    this.fetchItinerary(endpoint);

    // @todo when JSON API returns parent, pass the itinerary id
    endpoint = ItineraryPage.getChildItineraryTermsEndpoint(
      this.props.languageId,
    );
    this.fetchChildItineraries(endpoint);

    endpoint = ItineraryPage.getItineraryStopNodesEndpoint(
      this.props.languageId,
      this.props.itineraryId,
    );
    this.fetchItineraryStops(endpoint);

    endpoint = ItineraryPage.getExternalStopNodesEndpoint(
      this.props.languageId,
      this.props.itineraryId,
    );
    this.fetchExternalStops(endpoint);
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
   * Attaches the includes Url to the itinerary stops data.
   */
  setItineraryStopsWithIncludedUrl() {
    const stopsWithIncluded = [];
    const isEmptyStops =
      Object.keys(this.state.itineraryStops).length === 0 &&
      this.state.itineraryStops.constructor === Object;
    if (!isEmptyStops) {
      this.state.itineraryStops.data.forEach(stop => {
        const tmpStop = stop;
        // @todo refactor getImageFromItineraryIncluded
        if (stop.relationships.field_image.data !== null) {
          const imageId = stop.relationships.field_image.data.id;
          const image = this.state.itineraryStops.included.filter(
            obj => obj.id === imageId,
          );
          tmpStop.imageUrl = image[0].meta.derivatives.thumbnail;
        }
        stopsWithIncluded.push(tmpStop);
      });
    }
    this.setState({ itineraryStopsWithIncluded: stopsWithIncluded });
  }

  /**
   * Attaches the includes Url to the external stops data.
   */
  setExternalStopsWithIncludedUrl() {
    const stopsWithIncluded = [];
    const isEmptyStops =
      Object.keys(this.state.externalStops).length === 0 &&
      this.state.externalStops.constructor === Object;
    if (!isEmptyStops) {
      this.state.externalStops.data.forEach(stop => {
        const tmpStop = stop;
        // @todo refactor getImageFromItineraryIncluded
        if (stop.relationships.field_image.data !== null) {
          const imageId = stop.relationships.field_image.data.id;
          const image = this.state.externalStops.included.filter(
            obj => obj.id === imageId,
          );
          tmpStop.imageUrl = image[0].meta.derivatives.thumbnail;
        }
        stopsWithIncluded.push(tmpStop);
      });
    }
    this.setState({ externalStopsWithIncluded: stopsWithIncluded });
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

  fetchChildItineraries(endpoint) {
    this.setState({ childItinerariesIsLoading: true });
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
      .then(childItineraries => {
        this.setState({ childItineraries });
        this.setState({ childItinerariesIsLoading: false });
      })
      .catch(() => this.setState({ childItinerariesHasError: true }));
  }

  fetchItineraryStops(endpoint) {
    this.setState({ itineraryStopsIsLoading: true });
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
      .then(itineraryStops => {
        this.setState(
          { itineraryStops },
          this.setItineraryStopsWithIncludedUrl,
        );
        this.setState({ itineraryStopsIsLoading: false });
      })
      .catch(() => this.setState({ itineraryStopsHasError: true }));
  }

  fetchExternalStops(endpoint) {
    this.setState({ externalStopsIsLoading: true });
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
      .then(externalStops => {
        this.setState({ externalStops });
        this.setState(
          { externalStopsIsLoading: false },
          this.setExternalStopsWithIncludedUrl,
        );
      })
      .catch(() => this.setState({ externalStopsHasError: true }));
  }

  render() {
    if (this.state.itineraryHasError) {
      return <p>Error while loading itinerary.</p>;
    }

    if (this.state.itineraryIsLoading) {
      return <p>Loading itinerary...</p>;
    }

    if (this.state.childItinerariesHasError) {
      return <p>Error while loading sub itineraries.</p>;
    }

    if (this.state.childItinerariesIsLoading) {
      return <p>Loading sub itineraries...</p>;
    }

    if (this.state.itineraryStopsHasError) {
      return <p>Error while loading stops for this itinerary.</p>;
    }

    if (this.state.itineraryStopsIsLoading) {
      return <p>Loading stops for this itinerary...</p>;
    }

    if (this.state.externalStopsHasError) {
      return <p>Error while loading stops.</p>;
    }

    if (this.state.externalStopsIsLoading) {
      return <p>Loading stops...</p>;
    }

    return (
      <div className={s.wrapper}>
        <div className={s.container}>
          <ItineraryHeader itinerary={this.state.itineraryWithIncluded} />
          <FilterableStopList
            itinerary_id={this.props.itineraryId}
            childItineraries={this.state.childItineraries}
            itineraryStops={this.state.itineraryStopsWithIncluded}
            externalStops={this.state.externalStopsWithIncluded}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryPage);
