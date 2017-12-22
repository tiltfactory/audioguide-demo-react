import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Sticky from 'react-stickynode';
import Ionicon from 'react-ionicons';
import s from './StopList.css';
import StopTeaser from '../StopTeaser';
import Modal from '../../components/Modal';
import Link from '../Link';

class StopList extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    itinerary_id: PropTypes.string.isRequired,

    // childItineraries: PropTypes.shape({
    //   data: PropTypes.arrayOf(
    //     PropTypes.shape({
    //       id: PropTypes.string.isRequired,
    //     }).isRequired,
    //   ).isRequired,
    // }),

    stops: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        attributes: PropTypes.shape({
          title: PropTypes.string.isRequired,
        }),
      }),
    ).isRequired,

    externalStops: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        attributes: PropTypes.shape({
          title: PropTypes.string.isRequired,
        }),
      }),
    ).isRequired,
  };

  static defaultProps = {
    childItineraries: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  /**
   * Filters a list of stops based on a text.
   * The search scope is the stop title and id.
   *
   * @param stops
   * @returns {Array}
   */
  filterByText(stops) {
    // The text passed by the SearchBar component.
    const filterText = this.props.filterText;
    const filteredStops = [];
    stops.forEach(stop => {
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
    return filteredStops;
  }

  /**
   * Filters several lists of stops:
   * Current itinerary: grouped and ungrouped.
   * External itinerary (ungrouped).
   *
   * @returns {{ungroupedFilteredStops, groupedFilteredStops: Array, externalFilteredStops: Array}}
   */
  filterStops() {
    // Stops that does not belong to any group.
    // By definition, the ones that does not have any other (child) itinerary
    // than the current one.
    const ungroupedStops = [];
    // Stops by group.
    const groupedStops = [];

    // Split grouped and ungrouped stops.
    this.props.stops.forEach(stop => {
      // Here we assume that if the length of itineraries is greater than 1
      // it has child itineraries. Otherwise, because the stops list is filtered
      // by itinerary at this stage, we can safely consider that it is
      // the parent itinerary with no child itinerary assigned to this stop.
      // In this case, that means that the stop is ungrouped (by child itinerary).
      if (stop.relationships.field_audio_itinerary.data.length > 1) {
        ungroupedStops.push(stop);
      } else {
        groupedStops.push(stop);
      }
    });

    // Grouped and ungrouped stops from the current itinerary, filtered.
    const ungroupedFilteredStops = this.filterByText(ungroupedStops);
    const groupedFilteredStops = [];
    // External stops, not from this itinerary.
    // They will always appear ungrouped.
    // @todo pass the external itinerary id that will be used in the route.
    const externalFilteredStops = this.filterByText(this.props.externalStops);

    // The itinerary can have child itineraries, but that does not mean that
    // stops are assigned to these children.
    // If the list of ungroupedStops is similar to the original one,
    // there are no groups.
    const hasGroups = this.props.stops.length === ungroupedStops.length;

    if (hasGroups) {
      // Child itineraries.
      // They will be used to define the groups.
      // @todo see issue with parent / child relationship on itinerary/index.js route
      // const childItineraries = this.props.childItineraries;
      // Filter by title or id.
      this.filterByText(ungroupedStops);
    }

    return {
      ungroupedFilteredStops,
      groupedFilteredStops,
      externalFilteredStops,
    };
  }

  render() {
    const filteredStops = this.filterStops();

    return (
      <div>
        {filteredStops.ungroupedFilteredStops.length !== 0
          ? <div className={s.listContent}>
              <ul>
                {filteredStops.ungroupedFilteredStops.map(stop =>
                  <li key={stop.id}>
                    <StopTeaser
                      destination={`/stop/${this.props
                        .itinerary_id}/${stop.id}`}
                      stop={stop}
                    />
                  </li>,
                )}
              </ul>
            </div>
          : <span />}

        {filteredStops.groupedFilteredStops.length !== 0
          ? // @todo iterate on each group
            <div className={s.list} id="test1">
              <div className={s.listContent}>
                <Sticky innerZ={99} bottomBoundary="#test1">
                  <h2 className={s.title}>
                    <img src="/tile.png" alt="test" />Objets
                  </h2>
                </Sticky>
                <ul>
                  {filteredStops.groupedFilteredStops.map(stop =>
                    <li key={stop.id}>
                      <StopTeaser
                        destination={`/stop/${this.props
                          .itinerary_id}/${stop.id}`}
                        stop={stop}
                      />
                    </li>,
                  )}
                </ul>
              </div>
            </div>
          : <span />}

        {filteredStops.ungroupedFilteredStops.length === 0 &&
        filteredStops.groupedFilteredStops.length === 0 &&
        filteredStops.externalFilteredStops.length === 0
          ? <div className={s.didntFoundAnything}>
              <Ionicon icon="md-sad" color="#BAA188" fontSize="250px" />
              <p>Stop non trouvé…</p>
              <button className={s.btn}>
                <Ionicon
                  icon="md-refresh"
                  color="#ffffff"
                  fontSize="24px"
                />Réinitialiser la recherche
              </button>
            </div>
          : <span />}

        {filteredStops.ungroupedFilteredStops.length === 0 &&
        filteredStops.groupedFilteredStops.length === 0 &&
        filteredStops.externalFilteredStops.length !== 0
          ? <div className={[s.list, s.listInOtherItinaries].join(' ')}>
              <div className={s.listContent}>
                <h2 className={s.title}>Disponible dans d’autres parcours</h2>
                <ul>
                  {filteredStops.externalFilteredStops.map(stop =>
                    <li key={stop.id}>
                      <StopTeaser
                        destination={`/stop/${this.props
                          .itinerary_id}/${stop.id}`}
                        stop={stop}
                      />
                    </li>,
                  )}
                </ul>
              </div>
            </div>
          : <span />}

        <Modal onClick={e => this.toggle(e)} openModal={this.state.isModalOpen}>
          <div className={s.switchIt}>
            <h1 className={s.modalTitle}>Attention, dis !</h1>
            <p>Tu t’apprêtes à changer de parcours, en es-tu bien sûr ?</p>
            <Link className={s.btn} to={'#'} id="switchItinary">
              <Ionicon
                icon="md-arrow-round-forward"
                color="#ffffff"
                fontSize="24px"
              />Je change de parcours
            </Link>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(StopList);
