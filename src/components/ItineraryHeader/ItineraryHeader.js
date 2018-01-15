import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Ionicon from 'react-ionicons';
import s from './ItineraryHeader.css';
import Link from '../Link';

const messages = defineMessages({
  home: {
    id: 'navigation.home',
    defaultMessage: 'Home',
    description: 'Home link in header',
  },
});

class ItineraryHeader extends React.Component {
  static propTypes = {
    itinerary: PropTypes.shape({
      id: PropTypes.string.isRequired,
      iconImageUrl: PropTypes.string,
      backgroundImageUrl: PropTypes.string,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.object,
      }).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    itinerary: PropTypes.shape({
      iconImageUrl: null,
      backgroundImageUrl: null,
      attributes: PropTypes.shape({
        description: null,
      }),
    }).isRequired,
  };

  render() {
    const inlineStyle = {
      backgroundImage: `url(${this.props.itinerary.backgroundImageUrl})`,
    };

    return (
      <header className={s.header} style={inlineStyle}>
        <div className={s.container}>
          <div className={s.contentHeader}>
            <Link to="/" className={s.backUrl}>
              <Ionicon
                icon="md-arrow-round-back"
                fontSize="22px"
                color="#BE9F8A"
              />{' '}
              <FormattedMessage {...messages.home} />
            </Link>
            {this.props.itinerary.iconImageUrl !== null ? (
              <img
                src={this.props.itinerary.iconImageUrl}
                alt={this.props.itinerary.attributes.name}
              />
            ) : (
              <span />
            )}
          </div>
          <h1 className={s.title}>{this.props.itinerary.attributes.name}</h1>
          {this.props.itinerary.attributes.description !== null ? (
            <div
              className={s.subtitle}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: this.props.itinerary.attributes.description.value,
              }}
            />
          ) : (
            <span />
          )}
        </div>
      </header>
    );
  }
}

export default withStyles(s)(ItineraryHeader);
