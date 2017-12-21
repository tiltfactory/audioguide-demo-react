import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Sticky from 'react-stickynode';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Ionicon from 'react-ionicons';
import s from './SearchBar.css'; // eslint-disable-line no-use-before-define

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
    // @todo check correct propType
    onFilterTextChange: PropTypes.func.isRequired,
    onSearchFocus: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);

    this.state = {
      openSearch: false,
    };
  }

  onFocus = () => {
    this.setState({
      openSearch: true,
    });
    this.props.onSearchFocus(true);
  };

  onBlur = () => {
    this.setState({
      openSearch: false,
    });
    this.props.onSearchFocus(false);
  };

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <Sticky innerZ={100} top={-48} activeClass="SearchBar-active-20Pac">
          <span className={s.active} />
          <form className={s.form}>
            <input
              id="searchfield"
              name="searchfield"
              className={s.search}
              type="text"
              placeholder={formatMessage(messages.search)}
              value={this.props.filterText}
              onChange={this.handleFilterTextChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            />
            <Ionicon
              icon="ios-search"
              className={s.searchIcon}
              color="#ffffff"
              fontSize="24px"
            />
          </form>
        </Sticky>
        <div
          className={s.closeSearch}
          role="button"
          tabIndex="0"
          style={
            this.state.openSearch ? { display: 'flex' } : { display: 'none' }
          }
        >
          <Ionicon icon="md-close" color="#949494" fontSize="24px" />
        </div>
        <label className={s.wrapperIcon} htmlFor="searchfield">
          <Ionicon icon="ios-search" color="#2567D9" fontSize="24px" />
        </label>
      </div>
    );
  }
}

export default injectIntl(withStyles(s)(SearchBar));
