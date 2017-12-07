import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StopTeaser.css';
import Link from '../Link';

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
  };

  static defaultProps = {
    stop: PropTypes.shape({
      imageUrl: null,
    }).isRequired,
  };

  render() {
    const stop = this.props.stop;
    return (
      <Link to={this.props.destination}>
        {stop.imageUrl !== null
          ? <img src={stop.imageUrl} alt={stop.attributes.title} />
          : <span>Image empty state</span>}
        <p>
          {stop.attributes.field_id}
        </p>
        <h2>
          {stop.attributes.title}
        </h2>
      </Link>
    );
  }
}

export default withStyles(s)(StopTeaser);
