/* eslint-disable no-shadow */

import React from 'react';
import PropTypes from 'prop-types';
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
      /* @intl-code-template '${lang}-${COUNTRY}': '${Name}', */
      'fr-BE': 'Français',
      'nl-BE': 'Nederlands',
      'de-BE': 'Deutsch',
      'en-US': 'English',
      /* @intl-code-template-end */
    };
    const localeName = locale => localeDict[locale] || locale;

    return (
      <div className={s.root}>
        <div className={s.container}>
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

export default connect(mapState, mapDispatch)(LanguageSwitcher);
