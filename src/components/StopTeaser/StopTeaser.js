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
        field_id: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { imageUrl: null };
  }

  componentWillMount() {
    // @todo check best practices
    this.getImageUrl();
  }

  async getImageUrl() {
    // @todo make image helpers reusable
    const REST_HOST_NAME = 'http://belvue.dev'; // @todo set in .env
    // waiting for images
    const url = `${REST_HOST_NAME}/themes/custom/belvue/logo.svg`;
    this.setState({ imageUrl: url });
  }

  render() {
    const stop = this.props.stop;
    return (
      <Link to={this.props.destination}>
        <img src={this.state.imageUrl} alt={stop.attributes.title} />
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
