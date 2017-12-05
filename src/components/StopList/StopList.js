import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StopList.css';
import StopTeaser from '../StopTeaser';

class StopList extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    itinerary_id: PropTypes.string.isRequired,
    stops: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        attributes: PropTypes.shape({
          title: PropTypes.string.isRequired,
        }),
      }),
    ).isRequired,
  };

  render() {
    const filterText = this.props.filterText;
    const rows = [];

    this.props.stops.forEach(stop => {
      if (stop.attributes.title.indexOf(filterText) === -1) {
        return;
      }
      rows.push(
        <StopTeaser
          key={stop.id}
          destination={`/stop/${this.props.itinerary_id}/${stop.id}`}
          stop={stop}
        />,
      );
    });

    return (
      <ul>
        {rows}
      </ul>
    );
  }
}

export default withStyles(s)(StopList);
