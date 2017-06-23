import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactAudioPlayer from 'react-audio-player';
import Collapsible from 'react-collapsible';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { setItem } from '../../actions/audio';
import { REST_HOST_NAME } from '../../constants';
import Page from '../Page';
import Link from '../Link';
import AudioQuiz from '../AudioQuiz';
import s from './AudioContentPage.css';

class AudioContentPage extends Page {

  static propTypes = {
    // @todo
  };

  // @todo check scope for setItem
  // @todo review usage from url and from Redux, use Redux as caching system
  // @fixme refresh audioItem state while using prev next navigation
  constructor({ audioProfileItem, audioList, audioItem, setItem }) {
    super();

    // Define indexes for audio list navigation
    let previousIndex = null;
    let nextIndex = null;
    let currentIndex = 0;
    let found = false;
    // console.log('Current',audioItem);
    while (!found && (currentIndex < audioList.data.length)) {
      if (audioList.data[currentIndex].id === audioItem.id) {
        found = true;
        if (currentIndex > 0) {
          previousIndex = currentIndex - 1;
        }
        if (currentIndex < audioList.data.length - 1) {
          nextIndex = currentIndex + 1;
        }
      } else {
        currentIndex += 1;
      }
    }

    this.state = {
      audioProfileItem,
      audioList,
      audioItem,
      setItem,
      previousIndex,
      nextIndex,
    };
  }

  render() {
    const { node } = this.props;
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
      if (!(answerParagraphItem[0].relationships.field_mp3.data === null)) {
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
          <Link className={s.link} to={`/audio_list/${this.state.audioProfileItem.attributes.uuid}`}>&lt; &lt; Audioguide { this.state.audioProfileItem.attributes.name }</Link>
          <span className={s.spacer}> | </span>

          {this.state.previousIndex !== null ? (
            <Link
              className={s.link}
              to={`/audio/${this.state.audioList.data[this.state.previousIndex].id}`}
              onClick={() => {
                const audioItem = this.state.audioList.data[this.state.previousIndex];
                // console.log('Previous', audioItem);
                this.state.setItem({ audioItem });
              }}
            >&lt;</Link>
          ) : (<div />)}

          {this.state.nextIndex !== null ? (
            <Link
              className={s.link}
              to={`/audio/${this.state.audioList.data[this.state.nextIndex].id}`}
              onClick={() => {
                const audioItem = this.state.audioList.data[this.state.nextIndex];
                // console.log('Next', audioItem);
                this.state.setItem({ audioItem });
              }}
            >&gt;</Link>
          ) : (<div />)}

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
          {answersList.length > 0 ? (
            <AudioQuiz answersList={answersList} />
              ) : (<div />)}
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  audioProfileItem: state.profile.audioProfileItem,
  audioList: state.audio.audioList,
  audioItem: state.audio.audioItem,
});

const mapDispatch = {
  setItem,
};

export default connect(mapState, mapDispatch)(withStyles(s)(AudioContentPage));
