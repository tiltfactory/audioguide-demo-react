import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryListPage.css';
import ItineraryTeaser from '../../components/ItineraryTeaser';
import ItineraryListHeader from '../../components/ItineraryListHeader';
import Modal from '../../components/Modal';
import { JSON_API_URL } from '../../constants/env';

const messages = defineMessages({
  about_title: {
    id: 'about.title',
    defaultMessage: 'About',
    description: 'About title',
  },
  about_description: {
    id: 'about.description',
    defaultMessage: 'Description',
    description: 'About description',
  },
});

class ItineraryListPage extends React.Component {
  static propTypes = {
    languageId: PropTypes.string.isRequired,
  };

  /**
   * Returns the JSON API endpoint for the terms.
   *
   * @returns {string}
   */
  static getItinerariesEndpoint(languageId) {
    return `${JSON_API_URL}/${languageId}/jsonapi/taxonomy_term/audio_itinerary?filter[field_is_parent][value]=1&filter[langcode][value]=${languageId}&sort=weight&include=field_image,field_background_image`;
  }

  constructor(props) {
    super(props);
    this.state = {
      itineraries: [],
      itinerariesWithIncluded: [],
      hasError: false,
      isLoading: true,
      isModalOpen: false,
    };
    this.modalToggle = this.modalToggle.bind(this);
  }

  componentDidMount() {
    const endpoint = ItineraryListPage.getItinerariesEndpoint(
      this.props.languageId,
    );
    this.fetchItineraries(endpoint);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.languageId !== this.props.languageId) {
      const endpoint = ItineraryListPage.getItinerariesEndpoint(
        nextProps.languageId,
      );
      this.fetchItineraries(endpoint);
    }
  }

  /**
   * Modal toggle.
   *
   * @param e
   */
  modalToggle(e) {
    e.preventDefault();
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  /**
   * Helper that gets the first image from an included field.
   *
   * @param imageId
   * @returns {*}
   */
  getImageFromIncluded(imageId) {
    let result = null;
    const image = this.state.itineraries.included.filter(
      obj => obj.id === imageId,
    );
    if (image[0]) {
      result = `${JSON_API_URL}/${image[0].attributes.url}`;
    }
    return result;
  }

  /**
   * Attaches the includes Url to the itineraries data.
   *
   * @returns {Array}
   */
  setItinerariesWithIncludedUrl() {
    const itinerariesWithIncluded = [];
    this.state.itineraries.data.forEach(itinerary => {
      const tmpItinerary = itinerary;
      if (itinerary.relationships.field_image.data !== null) {
        const iconImageId = itinerary.relationships.field_image.data.id;
        tmpItinerary.iconImageUrl = this.getImageFromIncluded(iconImageId);
      }
      if (itinerary.relationships.field_background_image.data !== null) {
        const backgroundImageId =
          itinerary.relationships.field_background_image.data.id;
        tmpItinerary.backgroundImageUrl = this.getImageFromIncluded(
          backgroundImageId,
        );
      }
      itinerariesWithIncluded.push(tmpItinerary);
    });
    this.setState({ itinerariesWithIncluded });
  }

  /**
   * Fetches itineraries data.
   *
   * @param endpoint
   */
  fetchItineraries(endpoint) {
    this.setState({ isLoading: true });
    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      // ES6 property value shorthand for { itineraries: itineraries }
      // and use the second parameter as a callback
      .then(itineraries => {
        this.setState({ itineraries }, this.setItinerariesWithIncludedUrl);
        this.setState({ isLoading: false });
      })
      .catch(() => this.setState({ hasError: true }));
  }

  render() {
    if (this.state.hasError) {
      return <p>Error while loading itineraries.</p>;
    }

    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <Modal
          onClick={e => this.modalToggle(e)}
          openModal={this.state.isModalOpen}
          fullscreen
        >
          <div>
            <h1>
              <FormattedMessage {...messages.about_title} />
            </h1>
            <div>
              <FormattedMessage {...messages.about_description} />
            </div>
          </div>
        </Modal>
        <div className={s.container}>
          <ItineraryListHeader onClick={e => this.modalToggle(e)} />
          <ul className={s.gridPage}>
            {this.state.itinerariesWithIncluded.map(itinerary => (
              <li key={`${itinerary.id}-${this.props.languageId}`}>
                <ItineraryTeaser
                  destination={`/itinerary/${itinerary.id}`}
                  itinerary={itinerary}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryListPage);
