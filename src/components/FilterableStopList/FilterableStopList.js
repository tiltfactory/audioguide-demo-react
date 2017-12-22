import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FilterableStopList.css';
import SearchBar from '../SearchBar';
import StopList from '../StopList';

class FilterableStopList extends React.Component {
  static propTypes = {
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

    itineraryStops: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ).isRequired,

    externalStops: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  static defaultProps = {
    childItineraries: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      isSearching: false,
    };
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleSearchFocus = this.handleSearchFocus.bind(this);
  }

  handleFilterTextChange(text) {
    this.setState({
      filterText: text,
    });
  }

  handleSearchFocus() {
    this.setState({
      isSearching: !this.state.isSearching,
    });
  }

  render() {
    return (
      <div
        className={[
          s.wrapper,
          this.state.isSearching ? 'isSearching' : '',
        ].join(' ')}
      >
        <SearchBar
          filterText={this.state.filterText}
          onFilterTextChange={this.handleFilterTextChange}
          onSearchFocus={this.handleSearchFocus}
        />
        <StopList
          itinerary_id={this.props.itinerary_id}
          childItineraries={this.props.childItineraries}
          stops={this.props.itineraryStops}
          externalStops={this.props.externalStops}
          filterText={this.state.filterText}
        />
      </div>
    );
  }
}

export default withStyles(s)(FilterableStopList);
