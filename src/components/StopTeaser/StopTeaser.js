import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StopTeaser.css';
import Link from '../Link';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class StopTeaser extends React.Component {
  static propTypes = {
    destination: PropTypes.string.isRequired,
    stop: PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      attributes: PropTypes.shape({
        title: PropTypes.string.isRequired,
        field_id: PropTypes.string.isRequired,
      }),
    }).isRequired,
    onClick: PropTypes.func,
    to: PropTypes.string,
  };

  static defaultProps = {
    stop: PropTypes.shape({
      imageUrl: null,
    }).isRequired,
    onClick: null,
    to: null,
  };

  handleClick = event => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }
    history.push(this.props.to);
    event.preventDefault();
  };

  render() {
    const inlineStyle = {
      backgroundImage: `url(${this.props.stop.imageUrl})`,
    };

    return (
      <Link
        to={this.props.destination}
        className={s.listItem}
        onClick={this.handleClick}
      >
        <div className={s.container}>
          <figure style={inlineStyle}>
            {this.props.stop.imageUrl !== null ? (
              <img
                src={this.props.stop.imageUrl}
                alt={this.props.stop.attributes.title}
              />
            ) : (
              <span />
            )}
            <span className={s.itemId}>
              {this.props.stop.attributes.field_id}
            </span>
          </figure>
          <div className={s.infos}>
            <h2>{this.props.stop.attributes.title}</h2>
          </div>
        </div>
      </Link>
    );
  }
}

export default withStyles(s)(StopTeaser);
