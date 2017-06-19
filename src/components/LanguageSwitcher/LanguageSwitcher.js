/* eslint-disable no-shadow */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setLocale } from '../../actions/intl';
import s from './LanguageSwitcher.css';

function LanguageSwitcher({ currentLocale, availableLocales, setLocale }) {
  const isSelected = locale => locale === currentLocale;
  const localeDict = {
    'fr-BE': 'FR',
    'nl-BE': 'NL',
    'de-BE': 'DE',
    'en-US': 'EN',
  };
  const localeName = locale => localeDict[locale] || locale;
  return (
    <div className={s.root}>
      {availableLocales.map(locale => (
        <span key={locale}>
          {isSelected(locale) ? (
            <span>{localeName(locale)}</span>
          ) : (
            // github.com/yannickcr/eslint-plugin-react/issues/945
            // eslint-disable-next-line react/jsx-indent
            <a
              className={s.link}
              href={`?lang=${locale}`}
              onClick={(e) => {
                setLocale({ locale });
                e.preventDefault();
              }}
            >{localeName(locale)}</a>
          )}
          {' '}
        </span>
      ))}
    </div>
  );
}

LanguageSwitcher.propTypes = {
  currentLocale: PropTypes.string.isRequired,
  availableLocales: PropTypes.arrayOf(PropTypes.string).isRequired,
  setLocale: PropTypes.func.isRequired,
};

const mapState = state => ({
  availableLocales: state.runtime.availableLocales,
  currentLocale: state.intl.locale,
});

const mapDispatch = {
  setLocale,
};

export default connect(mapState, mapDispatch)(LanguageSwitcher);
