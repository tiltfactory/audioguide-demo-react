import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Ionicon from 'react-ionicons';
import s from './SearchBar.css';

const messages = defineMessages({
  search: {
    id: 'search.placeholder',
    defaultMessage: 'Search...',
    description: 'Search placeholder',
  },
});

class SearchBar extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
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
    const { formatMessage } = this.props.intl;

    return (
      <form className={s.form}>
        <label className={s.wrapperIcon}>
          <Ionicon icon="ios-search" color="white" fontSize="18px" />
        </label>
        <input
          className={s.search}
          type="text"
          placeholder={formatMessage(messages.search)}
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
      </form>
    );
  }
}

export default injectIntl(withStyles(s)(SearchBar));
