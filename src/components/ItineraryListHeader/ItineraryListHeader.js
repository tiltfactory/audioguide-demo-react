import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Ionicon from 'react-ionicons';
import s from './ItineraryListHeader.css';
import Link from '../Link';
import LanguageSwitcher from '../LanguageSwitcher';
import logoUrl from './belvue_logo.svg';

class ItineraryListHeader extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  render() {
    return (
      <header className={s.headerBlock}>
        <div className={s.container}>
          <Link
            to="/about"
            className={s.linkAbout}
            onClick={e => this.props.onClick(e)}
          >
            <Ionicon
              icon="ios-information-circle"
              fontSize="22px"
              color="#BE9F8A"
            />
          </Link>
          <img src={logoUrl} alt="BELvue museum" className={s.logo} />
          <LanguageSwitcher />
        </div>
      </header>
    );
  }
}

export default withStyles(s)(ItineraryListHeader);
