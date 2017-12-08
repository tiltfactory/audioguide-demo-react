import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryListHeader.css';
import Link from '../Link';
import LanguageSwitcher from '../LanguageSwitcher';
import logoUrl from './belvue_logo.svg';

class ItineraryListHeader extends React.Component {
  render() {
    return (
      <header className={s.headerBlock}>
        <div className={s.container}>
          <Link to="/about" className={s.linkAbout}>
            About
          </Link>
          <img src={logoUrl} alt="BELvue museum" className={s.logo} />
          <LanguageSwitcher />
        </div>
      </header>
    );
  }
}

export default withStyles(s)(ItineraryListHeader);
