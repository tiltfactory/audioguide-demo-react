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
    const { node } = this.props;
    // @todo check value
    const mp3 = node.included.filter(obj => obj.id === node.data.relationships.field_mp3.data.id);
    const mp3URL = `${REST_HOST_NAME}/${mp3[0].attributes.url}`;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link className="button" to="/">List</Link>
          <h1>{ node.data.attributes.field_id }</h1>
          <h2>{ node.data.attributes.title }</h2>
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
