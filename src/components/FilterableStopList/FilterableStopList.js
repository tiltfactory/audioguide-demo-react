import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FilterableStopList.css';
import SearchBar from '../SearchBar';
import StopList from '../StopList';

class FilterableStopList extends React.Component {
  static propTypes = {
    itinerary_id: PropTypes.string.isRequired,
    stops: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
    };
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  }

  handleFilterTextChange(text) {
    this.setState({
      filterText: text,
    });
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          onFilterTextChange={this.handleFilterTextChange}
        />
        <StopList
          itinerary_id={this.props.itinerary_id}
          stops={this.props.stops}
          filterText={this.state.filterText}
        />
      </div>
    );
  }
}

export default withStyles(s)(FilterableStopList);
