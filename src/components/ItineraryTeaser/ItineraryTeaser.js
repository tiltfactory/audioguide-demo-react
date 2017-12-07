import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryTeaser.css';
import Link from '../Link';

class ItineraryTeaser extends React.Component {
  static propTypes = {
    destination: PropTypes.string.isRequired,
    itinerary: PropTypes.shape({
      id: PropTypes.string.isRequired,
      iconImageUrl: PropTypes.string.isRequired,
      backgroundImageUrl: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      // relationships: PropTypes.shape({
      //   field_image: PropTypes.shape({
      //     data: PropTypes.shape({
      //       id: PropTypes.string.isRequired,
      //     }).isRequired,
      //   }).isRequired,
      // }).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    itinerary: PropTypes.shape({
      iconImageUrl: null,
      backgroundImageUrl: null,
    }).isRequired,
  };

  render() {
    const itinerary = this.props.itinerary;
    return (
      <Link to={this.props.destination}>
        {itinerary.iconImageUrl !== null
          ? <img
              src={itinerary.iconImageUrl}
              alt={itinerary.attributes.title}
            />
          : <span>Image empty state</span>}

        {itinerary.backgroundImageUrl !== null
          ? <img
              src={itinerary.backgroundImageUrl}
              alt={itinerary.attributes.title}
            />
          : <span>Image empty state</span>}
        {itinerary.attributes.name}
      </Link>
    );
  }
}

export default withStyles(s)(ItineraryTeaser);
