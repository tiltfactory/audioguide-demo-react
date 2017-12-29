import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Sticky from 'react-stickynode';
import Ionicon from 'react-ionicons';
import s from './StopList.css';
import StopTeaser from '../StopTeaser';
import Modal from '../../components/Modal';
import Link from '../Link';

const messages = defineMessages({
  in_other_itinerary: {
    id: 'search.in_other_itinerary',
    defaultMessage: 'Available in other itineraries',
    description: 'Stops available in another itinerary.',
  },
  itinerary_change_warning_title: {
    id: 'search.itinerary_change_warning_title',
    defaultMessage: 'Itinerary change',
    description: 'Warns user of itinerary change.',
  },
  itinerary_change_warning_description: {
    id: 'search.itinerary_change_warning_description',
    defaultMessage: 'You are about to change your itinerary, are you sure?',
    description: 'Warns user of itinerary change.',
  },
  itinerary_change_confirmation: {
    id: 'search.itinerary_change_confirmation',
    defaultMessage: 'Change itinerary?',
    description: 'Label for the itinerary change button.',
  },
  stop_not_found: {
    id: 'search.stop_not_found',
    defaultMessage: 'Stop not found',
    description: 'Empty state for not found stops.',
  },
  reset_search: {
    id: 'search.reset_search',
    defaultMessage: 'Reset search',
    description: 'Label for the reset search button.',
  },
});

class StopList extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    itinerary_id: PropTypes.string.isRequired,

    childItineraries: PropTypes.shape({
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
    }),

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
    // @todo empty array, should be more developer friendly
    childItineraries: null,
  };

  /**
   * Returns a string that can be safely used as an id.
   * @todo
   *
   * @param text
   * @returns {*}
   */
  static slugify(text) {
    return text;
  }

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
      if (stop.relationships.field_audio_itinerary.data.length === 1) {
        ungroupedStops.push(stop);
      } else {
        groupedStops.push(stop);
      }
    });

    // Grouped and ungrouped stops from the current itinerary, filtered.
    const ungroupedFilteredStops = this.filterByText(ungroupedStops);
    const groupedFilteredStops = this.filterByText(groupedStops);
    // External stops, not from this itinerary.
    // They will always appear ungrouped.
    // @todo get main itinerary id for this stop to pass it as itinerary id to the stop teaser.
    const externalFilteredStops = this.filterByText(this.props.externalStops);

    // The itinerary can have child itineraries, but that does not mean that
    // stops are assigned to these children.
    // If it has groups, then iterate through each filtered
    // stop and assign it to a group.
    const childItinerariesStops = [];
    const childItinerariesFilteredStops = [];
    if (groupedFilteredStops.length > 0) {
      // Prepare groups to store results, exclude parent itinerary.
      // @todo see issue related to json api getting parent / child relationship
      this.props.childItineraries.data.forEach(childItinerary => {
        if (childItinerary.id !== this.props.itinerary_id) {
          childItinerariesStops.push({
            itinerary: childItinerary,
            stops: [],
          });
        }
      });
      groupedFilteredStops.forEach(stop => {
        const stopItineraries = stop.relationships.field_audio_itinerary.data;
        // Store the stop into the child itinerary stops list if it matches.
        // @todo improve performances
        childItinerariesStops.forEach(childItinerary => {
          stopItineraries.forEach(stopItinerary => {
            if (stopItinerary.id === childItinerary.itinerary.id) {
              childItinerary.stops.push(stop);
            }
          });
        });
      });
      // Keep only childItineraries that contains at least one stop.
      childItinerariesStops.forEach(childItinerary => {
        if (childItinerary.stops.length > 0) {
          childItinerariesFilteredStops.push(childItinerary);
        }
      });
    }

    return {
      ungroupedFilteredStops,
      groupedFilteredStops, // @todo more obvious naming
      childItinerariesFilteredStops,
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

        {filteredStops.childItinerariesFilteredStops.map(itineraryStops =>
          <div
            className={s.list}
            id={StopList.slugify(itineraryStops.itinerary.attributes.name)}
            key={itineraryStops.itinerary.id}
          >
            <div className={s.listContent}>
              <Sticky
                innerZ={99}
                bottomBoundary={`#${StopList.slugify(
                  itineraryStops.itinerary.attributes.name,
                )}`}
              >
                <h2 className={s.title}>
                  <span>
                    {itineraryStops.itinerary.attributes.name}
                  </span>
                </h2>
              </Sticky>
              <ul>
                {itineraryStops.stops.map(stop =>
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
          </div>,
        )}

        {filteredStops.ungroupedFilteredStops.length === 0 &&
        filteredStops.groupedFilteredStops.length === 0 &&
        filteredStops.externalFilteredStops.length === 0
          ? <div className={s.didntFoundAnything}>
              <Ionicon icon="md-sad" color="#BAA188" fontSize="250px" />
              <p>
                <FormattedMessage {...messages.stop_not_found} />
              </p>
            </div>
          : <span />}

        {filteredStops.ungroupedFilteredStops.length === 0 &&
        filteredStops.groupedFilteredStops.length === 0 &&
        filteredStops.externalFilteredStops.length !== 0
          ? <div className={[s.list, s.listInOtherItinaries].join(' ')}>
              <div className={s.listContent}>
                <h2 className={s.title}>
                  <FormattedMessage {...messages.in_other_itinerary} />
                </h2>
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
            <h1 className={s.modalTitle}>
              <FormattedMessage {...messages.itinerary_change_warning_title} />
            </h1>
            <p>
              <FormattedMessage
                {...messages.itinerary_change_warning_description}
              />
            </p>
            <Link className={s.btn} to={'#'} id="switchItinary">
              <Ionicon
                icon="md-arrow-round-forward"
                color="#ffffff"
                fontSize="24px"
              />
              <FormattedMessage {...messages.itinerary_change_confirmation} />
            </Link>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(StopList);
