import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryListPage.css';
import ItineraryTeaser from '../../components/ItineraryTeaser';
import ItineraryListHeader from '../../components/ItineraryListHeader';
import { JSON_API_URL } from '../../constants/env';

class ItineraryListPage extends React.Component {
  static propTypes = {
    itineraries: PropTypes.shape({
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

  constructor(props) {
    super(props);
    this.state = {
      isAboutOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  getImageFromIncluded(imageId) {
    let result = null;
    const image = this.props.itineraries.included.filter(
      obj => obj.id === imageId,
    );
    if (image[0]) {
      result = `${JSON_API_URL}/${image[0].attributes.url}`;
    }
    return result;
  }

  toggle(e) {
    e.preventDefault();
    this.setState({
      isAboutOpen: true,
    });
  }

  /**
   * Attaches the includes Url to the itineraries data.
   *
   * @returns {Array}
   */
  itinerariesWithIncludedUrl() {
    const itineraries = this.props.itineraries;
    const itinerariesWithIncluded = [];
    itineraries.data.forEach(itinerary => {
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
    return itinerariesWithIncluded;
  }

  render() {
    return (
      <div>
        <div className={s.container}>
          <ItineraryListHeader onClick={this.toggle} />
          <ul className={s.gridPage}>
            {this.itinerariesWithIncludedUrl().map(itinerary =>
              <li key={itinerary.id}>
                <ItineraryTeaser
                  destination={`/itinerary/${itinerary.id}`}
                  itinerary={itinerary}
                />
              </li>,
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryListPage);
