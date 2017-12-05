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
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  render() {
    return (
      <li>
        <Link to={this.props.destination}>
          {this.props.itinerary.attributes.name}
        </Link>
      </li>
    );
  }
}

export default withStyles(s)(ItineraryTeaser);
