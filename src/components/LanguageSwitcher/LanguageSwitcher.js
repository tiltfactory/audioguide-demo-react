/* eslint-disable no-shadow */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { setLocale } from '../../actions/intl';
import s from './LanguageSwitcher.css';

const localeDict = {
  /* @intl-code-template '${lang}-${COUNTRY}': '${Name}', */
  'nl-BE': 'NL',
  'fr-BE': 'FR',
  'de-BE': 'DE',
  'en-US': 'EN',
  /* @intl-code-template-end */
};

class LanguageSwitcher extends React.Component {
  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    availableLocales: PropTypes.arrayOf(PropTypes.string).isRequired,
    setLocale: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      openMenu: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      openMenu: true,
    });
    document.addEventListener('click', this.closeMenu);
  }

  closeMenu = () => {
    this.setState({
      openMenu: false,
    });
    document.removeEventListener('click', this.closeMenu);
  };

  render() {
    const { currentLocale, availableLocales, setLocale } = this.props;
    const isSelected = locale => locale === currentLocale;
    const localeName = locale => localeDict[locale] || locale;

    return (
      <div className={this.state.openMenu ? s.plzOpenMenu : ''}>
        <button
          className={s.switchButton}
          onClick={this.handleClick}
          tabIndex="0"
        >
          {localeDict[currentLocale]}
        </button>
        <ul className={s.languageSelector}>
          {availableLocales.map(locale => (
            <li key={locale}>
              {isSelected(locale) ? (
                <span>{localeName(locale)}</span>
              ) : (
                // github.com/yannickcr/eslint-plugin-react/issues/945
                // eslint-disable-next-line react/jsx-indent
                <a
                  href={`?lang=${locale}`}
                  onClick={e => {
                    setLocale({ locale });
                    this.handleClick();
                    e.preventDefault();
                  }}
                >
                  {localeName(locale)}
                </a>
              )}{' '}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapState = state => ({
  availableLocales: state.runtime.availableLocales,
  currentLocale: state.intl.locale,
});

const mapDispatch = {
  setLocale,
};

export default connect(mapState, mapDispatch)(withStyles(s)(LanguageSwitcher));
