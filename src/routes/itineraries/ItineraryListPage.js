import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryListPage.css';
import Link from '../../components/Link';
import ItineraryListHeader from '../../components/ItineraryListHeader';

class ItineraryListPage extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    itineraries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  render() {
    const { itineraries } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <ItineraryListHeader />
          <ul>
            {itineraries.map(itinerary =>
              <li key={itinerary.id}>
                <Link to={`/itinerary/${itinerary.id}`}>
                  {itinerary.attributes.name}
                </Link>
              </li>,
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryListPage);
