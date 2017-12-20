import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Sticky from 'react-stickynode';
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
    const filteredStops = [];

    // Filter by title or id.
    this.props.stops.forEach(stop => {
      if (
        !(
          stop.attributes.title
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
        ) &&
        !(stop.attributes.field_id.indexOf(filterText) !== -1)
      ) {
        return;
      }
      filteredStops.push(stop);
    });

    return (
      <div>
        <div className={s.list} id="test1">
          <div className={s.listContent}>
            <Sticky innerZ={99} bottomBoundary="#test1">
              <h2 className={s.title}>
                <img src="/tile.png" alt="test" />Objets
              </h2>
            </Sticky>
            <ul>
              {filteredStops.map(stop =>
                <li key={stop.id}>
                  <StopTeaser
                    destination={`/stop/${this.props.itinerary_id}/${stop.id}`}
                    stop={stop}
                  />
                </li>,
              )}
            </ul>
          </div>
        </div>

        <div className={s.list} id="test2">
          <div className={s.listContent}>
            <Sticky innerZ={99} bottomBoundary="#test2">
              <h2 className={s.title}>
                <img src="/tile.png" alt="test" />Objets
              </h2>
            </Sticky>
            <ul>
              {filteredStops.map(stop =>
                <li key={stop.id}>
                  <StopTeaser
                    destination={`/stop/${this.props.itinerary_id}/${stop.id}`}
                    stop={stop}
                  />
                </li>,
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(StopList);
