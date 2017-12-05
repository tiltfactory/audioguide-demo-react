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
      attributes: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  render() {
    return (
      <li>
        <Link to={this.props.destination}>
          {this.props.stop.attributes.title}
        </Link>
      </li>
    );
  }
}

export default withStyles(s)(StopTeaser);
