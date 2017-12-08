import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Ionicon from 'react-ionicons';
import s from './SearchBar.css';

class SearchBar extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    // @todo set correct proptype
    onFilterTextChange: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  }

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  render() {
    return (
      <form className={s.form}>
        <label className={s.wrapperIcon}>
          <Ionicon icon="ios-search" color="white" fontSize="18px" />
        </label>
        <input
          className={s.search}
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
      </form>
    );
  }
}

export default withStyles(s)(SearchBar);
