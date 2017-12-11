/* eslint-disable no-shadow */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { setLocale } from '../../actions/intl';
import s from './LanguageSwitcher.css';

class LanguageSwitcher extends React.Component {
  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    availableLocales: PropTypes.arrayOf(PropTypes.string).isRequired,
    setLocale: PropTypes.func.isRequired,
  };

  render() {
    const { currentLocale, availableLocales, setLocale } = this.props;
    const isSelected = locale => locale === currentLocale;
    const localeDict = {
      // @todo check if this should be moved outside of the component
      /* @intl-code-template '${lang}-${COUNTRY}': '${Name}', */
      'fr-BE': 'FR',
      'nl-BE': 'NL',
      'de-BE': 'DE',
      'en-US': 'EN',
      /* @intl-code-template-end */
    };
    const localeName = locale => localeDict[locale] || locale;

    return (
      <div>
        <ul className={s.languageSelector}>
          {availableLocales.map(locale =>
            <li key={locale}>
              {isSelected(locale)
                ? <span>
                    {localeName(locale)}
                  </span>
                : // github.com/yannickcr/eslint-plugin-react/issues/945
                  // eslint-disable-next-line react/jsx-indent
                  <a
                    href={`?lang=${locale}`}
                    onClick={e => {
                      setLocale({ locale });
                      e.preventDefault();
                    }}
                  >
                    {localeName(locale)}
                  </a>}{' '}
            </li>,
          )}
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
