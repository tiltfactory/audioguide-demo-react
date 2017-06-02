import React from 'react';
import PropTypes from 'prop-types';
import ReactAudioPlayer from 'react-audio-player';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { REST_HOST_NAME } from '../../constants';
import Page from '../Page';
import Link from '../Link';
import s from './AudioContentPage.css';

class AudioContentPage extends Page {

  static propTypes = {
    // @todo
  };

  render() {
    const { node, mp3File, imageFile } = this.props;
    const mp3URL = `${REST_HOST_NAME}/${mp3File.data.attributes.url}`;
    const imageURL = `${REST_HOST_NAME}/${imageFile.data.attributes.url}`;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link className="button" to="/">List</Link>
          <h1>{ node.data.attributes.field_id }</h1>
          <h2>{ node.data.attributes.title }</h2>
          <img src={imageURL} />
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: node.data.attributes.body.value }}
          />
          <ReactAudioPlayer
            src={mp3URL}
            autoPlay
            controls
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AudioContentPage);
