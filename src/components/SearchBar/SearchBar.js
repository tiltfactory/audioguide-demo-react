import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Sticky from 'react-stickynode';
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
    // @todo check correct propType
    onFilterTextChange: PropTypes.func.isRequired,
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
  };

  onBlur = () => {
    this.setState({
      openSearch: false,
    });
  };

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <Sticky innerZ={100}>
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
          </form>
        </Sticky>
        <div
          className={s.closeSearch}
          role="button"
          tabIndex="0"
          style={
            this.state.openSearch ? { display: 'flex' } : { display: 'none' }
          }
          onClick={() => this.handleClick()}
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
