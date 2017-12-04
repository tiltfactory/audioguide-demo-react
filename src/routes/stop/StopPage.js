import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StopPage.css';
import Link from '../../components/Link/Link';

class StopPage extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    itinerary_id: PropTypes.string.isRequired,
    stop: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { stop } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title} - {stop.attributes.title}
          </h1>
          <Link to={`/itinerary/${this.props.itinerary_id}`}>
            Back to itinerary
          </Link>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(StopPage);
