import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryTeaser.css';
import Link from '../Link';

class ItineraryTeaser extends React.Component {
  static propTypes = {
    destination: PropTypes.string.isRequired,
    itinerary: PropTypes.shape({
      id: PropTypes.string.isRequired,
      iconImageUrl: PropTypes.string,
      backgroundImageUrl: PropTypes.string,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    itinerary: PropTypes.shape({
      iconImageUrl: null,
      backgroundImageUrl: null,
    }).isRequired,
  };

  render() {
    let inlineStyle = {};
    if (this.props.itinerary.iconImageUrl !== null) {
      inlineStyle = {
        backgroundImage: `url(${this.props.itinerary.backgroundImageUrl})`,
      };
    }

    return (
      <div className={s.wrapperLink} style={inlineStyle}>
        <Link to={this.props.destination}>
          <div className={s.pos}>
            {this.props.itinerary.iconImageUrl !== null ? (
              <img
                src={this.props.itinerary.iconImageUrl}
                alt={this.props.itinerary.attributes.name}
              />
            ) : (
              <span />
            )}

            <span className={s.name}>
              {this.props.itinerary.attributes.name}
            </span>
          </div>
        </Link>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryTeaser);
