import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryListPage.css';
import ItineraryTeaser from '../../components/ItineraryTeaser';
import ItineraryListHeader from '../../components/ItineraryListHeader';

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

  attachIncludes() {
    const { itineraries } = this.props;
    const REST_HOST_NAME = 'http://belvue.dev'; // @todo set in .env
    const itinerariesWithIncludes = [];
    itineraries.data.forEach(itinerary => {
      const tmpItinerary = itinerary;
      const imageId = itinerary.relationships.field_image.data.id;
      const image = itineraries.included.filter(obj => obj.id === imageId);
      if (image[0]) {
        tmpItinerary.imageUrl = `${REST_HOST_NAME}/${image[0].attributes.url}`;
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
            {this.attachIncludes().map(itinerary =>
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
