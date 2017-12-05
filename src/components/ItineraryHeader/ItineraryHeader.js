import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ItineraryHeader.css';
import Link from '../Link';
import LanguageSwitcher from '../LanguageSwitcher';

class ItineraryHeader extends React.Component {
  static propTypes = {
    itinerary: PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      relationships: PropTypes.shape({
        field_image: PropTypes.shape({
          data: PropTypes.shape({
            id: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
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
    const imageUUID = this.props.itinerary.relationships.field_image.data.id;
    const fileEndpoint = `${REST_HOST_NAME}/jsonapi/file/file/${imageUUID}`;
    const imageResponse = await fetch(fileEndpoint).then(response =>
      response.json(),
    );
    if (imageResponse) {
      const url = `${REST_HOST_NAME}/${imageResponse.data.attributes.url}`;
      this.setState({ imageUrl: url });
    }
  }

  render() {
    const itinerary = this.props.itinerary;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link to="/">Back to itineraries</Link>
          <img src={this.state.imageUrl} alt={itinerary.attributes.name} />
          <LanguageSwitcher />
          <h1>
            {itinerary.attributes.name}
          </h1>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ItineraryHeader);
