import React from 'react';
import PropTypes from 'prop-types';
import ReactAudioPlayer from 'react-audio-player';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Ionicon from 'react-ionicons';
import s from './StopPage.css';
import StopHeader from '../../components/StopHeader';
import AudioQuiz from '../../components/AudioQuiz';
import { JSON_API_URL } from '../../constants/env';
import Link from '../../components/Link/Link';

class StopPage extends React.Component {
  static propTypes = {
    stop: PropTypes.shape({
      data: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
      included: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
    previousStopId: PropTypes.string,
    nextStopId: PropTypes.string,
    itinerary: PropTypes.shape({
      data: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
      included: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    previousStopId: null,
    nextStopId: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isPlaying: true,
    };
    this.handlePlay = this.handlePlay.bind(this);
  }

  mp3Url() {
    const stop = this.props.stop;
    // Get the (single) mp3 file Url from the stop.
    const mp3Id = stop.data.relationships.field_mp3.data.id;
    const mp3 = stop.included.filter(obj => obj.id === mp3Id);
    return `${JSON_API_URL}/${mp3[0].attributes.url}`;
  }

  imageUrl() {
    const stop = this.props.stop;
    let result = null;
    if (stop.data.relationships.field_image.data !== null) {
      // Get the (single) image file Url from the stop.
      const imageId = stop.data.relationships.field_image.data.id;
      const image = stop.included.filter(obj => obj.id === imageId);
      result = `${JSON_API_URL}/${image[0].attributes.url}`;
    }
    return result;
  }

  answersList() {
    const stop = this.props.stop;
    // Get the answers (field_audio_answer Paragraphs).
    // Prepare the data model to be used by the AudioAnswer component.
    // @todo use typing instead of array
    const answersList = [];
    stop.data.relationships.field_audio_answer.data.forEach(answerReference => {
      const answerParagraphItemId = answerReference.id;
      const answerParagraphItem = stop.included.filter(
        obj => obj.id === answerParagraphItemId,
      );
      if (!(answerParagraphItem[0].relationships.field_mp3.data === null)) {
        // Then, for each answer, get its (single) mp3 file.
        // @todo refactoring needed
        const answerMp3Id =
          answerParagraphItem[0].relationships.field_mp3.data.id;
        const answerMp3 = stop.included.filter(obj => obj.id === answerMp3Id);
        const answerMp3URL = `${JSON_API_URL}/${answerMp3[0].attributes.url}`;
        // Prepare the wrapper and store in the list.
        const answer = {
          title: answerParagraphItem[0].attributes.field_title,
          text: answerParagraphItem[0].attributes.field_text.value,
          mp3URL: answerMp3URL,
          uuid: answerParagraphItem[0].attributes.uuid,
        };
        answersList.push(answer);
      }
    });
    return answersList;
  }

  handlePlay() {
    if (this.state.isPlaying) {
      this.rap.audioEl.pause();
    } else {
      this.rap.audioEl.play();
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  }

  render() {
    const { itinerary, stop, previousStopId, nextStopId } = this.props;
    const answersList = this.answersList();
    const inlineStyle = {
      backgroundImage: `url(${this.imageUrl()})`,
    };

    return (
      <div>
        <StopHeader itinerary={itinerary} stop={stop} />
        <div className={s.playerWrapper}>
          <div className={[s.btn, s.btnPrev].join(' ')}>
            {this.props.previousStopId !== null
              ? <Link to={`/stop/${itinerary.data.id}/${previousStopId}`}>
                  <span>
                    <Ionicon
                      icon="md-arrow-round-back"
                      color="white"
                      fontSize="36px"
                    />
                  </span>
                </Link>
              : <span className={s.trackDisabled}>
                  <Ionicon
                    icon="md-arrow-round-back"
                    color="white"
                    fontSize="36px"
                  />
                </span>}
          </div>
          <div
            className={[s.btn, s.btnPlay].join(' ')}
            style={inlineStyle}
            onClick={this.handlePlay}
            role="button"
            tabIndex="0"
          >
            {this.imageUrl() !== null
              ? <img src={this.imageUrl()} alt={stop.title} />
              : <span>Image empty state</span>}
            <div className={s.progressBtn}>
              <span />
            </div>
            <div />
            <div className={s.innerBtn}>
              {this.state.isPlaying
                ? <img src="/icon-pause.svg" alt="pause" />
                : <img src="/icon-play.svg" alt="play" />}
            </div>
          </div>
          <div className={[s.btn, s.btnNext].join(' ')}>
            {this.props.nextStopId !== null
              ? <Link to={`/stop/${itinerary.data.id}/${nextStopId}`}>
                  <span>
                    <Ionicon
                      icon="md-arrow-round-forward"
                      color="white"
                      fontSize="36px"
                    />
                  </span>
                </Link>
              : <span className={s.trackDisabled}>
                  <Ionicon
                    icon="md-arrow-round-forward"
                    color="white"
                    fontSize="36px"
                  />
                </span>}
          </div>
        </div>
        <ReactAudioPlayer
          autoPlay
          src={this.mp3Url()}
          ref={element => {
            this.rap = element;
          }}
        />
        <div
          className={s.content}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: stop.data.attributes.body.value,
          }}
        />
        {answersList.length > 0
          ? <AudioQuiz answersList={answersList} />
          : <div />}
      </div>
    );
  }
}

export default withStyles(s)(StopPage);
