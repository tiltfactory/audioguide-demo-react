import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryListPage.css';
import ItineraryTeaser from '../../components/ItineraryTeaser';
import ItineraryListHeader from '../../components/ItineraryListHeader';
import { JSON_API_URL } from '../../constants/env';

class ItineraryListPage extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
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

  /**
   * Attaches the includes Url to the itineraries data.
   *
   * @returns {Array}
   */
  itinerariesWithIncludesUrl() {
    const itineraries = this.props.itineraries;
    const itinerariesWithIncludes = [];
    itineraries.data.forEach(itinerary => {
      const tmpItinerary = itinerary;
      const imageId = itinerary.relationships.field_image.data.id;
      const image = itineraries.included.filter(obj => obj.id === imageId);
      if (image[0]) {
        tmpItinerary.imageUrl = `${JSON_API_URL}/${image[0].attributes.url}`;
      } else {
        // Images must be available in this case.
        throw new Error('No image were found');
      }
      itinerariesWithIncludes.push(tmpItinerary);
    });
    return itinerariesWithIncludes;
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <ItineraryListHeader />
          <ul>
            {this.itinerariesWithIncludesUrl().map(itinerary =>
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
