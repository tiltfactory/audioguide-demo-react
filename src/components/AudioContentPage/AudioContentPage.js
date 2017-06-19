import React from 'react';
import PropTypes from 'prop-types';
import ReactAudioPlayer from 'react-audio-player';
import Collapsible from 'react-collapsible';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { REST_HOST_NAME } from '../../constants';
import Page from '../Page';
import Link from '../Link';
import AudioQuiz from '../AudioQuiz';
import s from './AudioContentPage.css';

class AudioContentPage extends Page {

  static propTypes = {
    // @todo
  };

  render() {
    const { node, previousId, nextId } = this.props;
    // @todo check values
    // Get the (single) mp3 file URL from the main audio item.
    const mp3Id = node.data.relationships.field_mp3.data.id;
    const mp3 = node.included.filter(obj => obj.id === mp3Id);
    const mp3URL = `${REST_HOST_NAME}/${mp3[0].attributes.url}`;

    // Get the answers (field_audio_answer Paragraphs).
    // Prepare the data model to be used by the AudioAnswer component.
    // @todo use typing instead of array
    const answersList = [];
    // @todo review array iterator for performance
    for (const answerReference of node.data.relationships.field_audio_answer.data) {
      const answerParagraphItemId = answerReference.id;
      const answerParagraphItem = node.included.filter(obj => obj.id === answerParagraphItemId);
      if (!(answerParagraphItem === undefined)) {
        // Then, for each answer, get its (single) mp3 file.
        // @todo refactoring needed
        const answerMp3Id = answerParagraphItem[0].relationships.field_mp3.data.id;
        const answerMp3 = node.included.filter(obj => obj.id === answerMp3Id);
        const answerMp3URL = `${REST_HOST_NAME}/${answerMp3[0].attributes.url}`;
        // Prepare the wrapper and store in the list.
        const answer = {
          title: answerParagraphItem[0].attributes.field_title,
          text: answerParagraphItem[0].attributes.field_text.value,
          mp3URL: answerMp3URL,
          uuid: answerParagraphItem[0].attributes.uuid,
        };
        answersList.push(answer);
      }
    }

    return (
      <div className={s.root}>
        <div className={s.navigation}>
          <Link className={s.link} to="/audio_list/2320e7ce-f5c4-445c-963e-c907709a59bb">&lt; &lt; Audioguide jeunes</Link>
          <span className={s.spacer}> | </span>
          <Link className={s.link} to="/audio/0cb1cdd2-4bee-4fd8-82a8-7a2d08d7ea7e">&lt;</Link>
          <span className={s.spacer}> | </span>
          <Link className={s.link} to="/audio/0cb1cdd2-4bee-4fd8-82a8-7a2d08d7ea7e">&gt;</Link>
        </div>
        <div className={s.container}>
          <h1>
            <span className={s.audioId}>{ node.data.attributes.field_id }</span>
            <span className={s.audioTitle}>{ node.data.attributes.title }</span>
          </h1>
          <ReactAudioPlayer
            src={mp3URL}
            autoPlay
            controls
          />
          <Collapsible trigger="Texte">
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: node.data.attributes.body.value }}
            />
          </Collapsible>
          <AudioQuiz answersList={answersList} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AudioContentPage);
