import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import ReactAudioPlayer from 'react-audio-player';
import { Player } from 'video-react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Ionicon from 'react-ionicons';
import Collapsible from 'react-collapsible';
import s from './StopPage.css';
import StopHeader from '../../components/StopHeader';
import AudioQuiz from '../../components/AudioQuiz';
import { JSON_API_URL } from '../../constants/env';
import Link from '../../components/Link/Link';
// eslint-disable-next-line css-modules/no-unused-class
import vs from '../../../node_modules/video-react/dist/video-react.css';

const messages = defineMessages({
  collapsible_read_text: {
    id: 'collapsible.read_text',
    defaultMessage: 'Read the text',
    description: 'Collapsible header call to action.',
  },
});

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
      // @todo should be defined from to the player state
      isPlaying: false,
      currentProgress: 0,
      displayText: false,
    };
    this.handlePlay = this.handlePlay.bind(this);
  }

  componentDidMount() {
    // subscribe state change
    if (this.isMp4()) {
      this.rap.subscribeToStateChange(state => {
        if (state.paused && this.state.isPlaying) {
          this.setState({
            isPlaying: !this.state.isPlaying,
          });
          if (state.isFullscreen) {
            this.rap.toggleFullscreen();
          }
        }
        if (!state.paused && !this.state.isPlaying) {
          this.setState({
            isPlaying: !this.state.isPlaying,
          });
        }
        if (
          !state.isFullscreen &&
          state.isActive &&
          !state.paused &&
          this.state.isPlaying
        ) {
          this.handlePlay(); // will stop the video
        }
      });
    }
  }

  componentWillReceiveProps() {
    this.reset();
  }

  componentWillUnmount() {
    this.reset();
  }

  tick() {
    this.setState({
      currentProgress: this.rap.audioEl.currentTime / this.rap.audioEl.duration,
    });
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({
      displayText: !this.state.displayText,
    });
  }

  reset() {
    clearInterval(this.interval);
    this.setState({
      isPlaying: false,
      currentProgress: 0,
    });
  }

  handlePlay() {
    if (this.state.isPlaying) {
      if (this.rap.audioEl) {
        this.rap.audioEl.pause();
        clearInterval(this.interval);
      } else {
        this.rap.pause();
      }
    } else if (this.rap.audioEl) {
      this.rap.audioEl.play();
      this.interval = setInterval(() => this.tick(), 100);
    } else {
      this.rap.toggleFullscreen();

      this.rap.play();
      // setTimeout(() => {
      //   this.rap.play();
      // }, 500);
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  }

  isMp4() {
    const name = this.mp3Url();
    return name.endsWith('.mp4');
  }

  mp3Url() {
    // eslint-disable-next-line prefer-destructuring
    const stop = this.props.stop;
    // Get the (single) mp3 file Url from the stop.
    const mp3Id = stop.data.relationships.field_mp3.data.id;
    const mp3 = stop.included.filter(obj => obj.id === mp3Id);
    return `${JSON_API_URL}/${mp3[0].attributes.url}`;
  }

  imageUrl() {
    // eslint-disable-next-line prefer-destructuring
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
    // eslint-disable-next-line prefer-destructuring
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
        const answerMp3Url = `${JSON_API_URL}/${answerMp3[0].attributes.url}`;
        // Prepare the wrapper and store in the list.
        const answer = {
          title: answerParagraphItem[0].attributes.field_title,
          text: answerParagraphItem[0].attributes.field_text.value,
          mp3Url: answerMp3Url,
          uuid: answerParagraphItem[0].attributes.uuid,
        };
        answersList.push(answer);
      }
    });
    return answersList;
  }

  render() {
    const { itinerary, stop, previousStopId, nextStopId } = this.props;
    const answersList = this.answersList();
    const inlineStyle = {
      backgroundImage: `url(${this.imageUrl()})`,
    };

    return (
      <div>
        <StopHeader itinerary={itinerary} stop={stop} bg={inlineStyle} />
        {!this.isMp4() ? (
          <ReactAudioPlayer
            autoPlay={this.state.isPlaying}
            src={this.mp3Url()}
            ref={element => {
              this.rap = element;
            }}
            onEnded={() => this.reset()}
          />
        ) : (
          <div
            style={
              this.state.isPlaying
                ? { display: 'inherit' }
                : { display: 'none' }
            }
          >
            <Player
              playsInline
              src={this.mp3Url()}
              ref={element => {
                this.rap = element;
              }}
            />
          </div>
        )}

        <div className={s.playerWrapper}>
          <div className={[s.btn, s.btnPrev].join(' ')}>
            {this.props.previousStopId !== null ? (
              <Link to={`/stop/${itinerary.data.id}/${previousStopId}`}>
                <span>
                  <Ionicon
                    icon="md-arrow-round-back"
                    color="white"
                    fontSize="36px"
                  />
                </span>
              </Link>
            ) : (
              <span className={s.trackDisabled}>
                <Ionicon
                  icon="md-arrow-round-back"
                  color="white"
                  fontSize="36px"
                />
              </span>
            )}
          </div>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div
            className={[s.btn, s.btnPlay].join(' ')}
            style={inlineStyle}
            onClick={this.handlePlay}
            role="button"
            tabIndex="0"
          >
            {this.imageUrl() !== null ? (
              <img src={this.imageUrl()} alt={stop.title} />
            ) : (
              <span />
            )}
            <div
              className={s.progressBtn}
              style={{
                transform: `rotate(${this.state.currentProgress * 360}deg)`,
              }}
            >
              <span />
            </div>
            <div className={s.progressBar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 210 210"
              >
                <circle
                  fill="none"
                  cx="105"
                  cy="105"
                  r="100.5"
                  stroke="#1D1D1D"
                  strokeWidth="7"
                  strokeDashoffset={-this.state.currentProgress * 630}
                />
              </svg>
            </div>
            <div className={s.innerBtn}>
              {this.state.isPlaying ? (
                <img src="/icon-pause.svg" alt="pause" />
              ) : (
                <img src="/icon-play.svg" alt="play" />
              )}
            </div>
          </div>
          <div className={[s.btn, s.btnNext].join(' ')}>
            {this.props.nextStopId !== null ? (
              <Link to={`/stop/${itinerary.data.id}/${nextStopId}`}>
                <span>
                  <Ionicon
                    icon="md-arrow-round-forward"
                    color="white"
                    fontSize="36px"
                  />
                </span>
              </Link>
            ) : (
              <span className={s.trackDisabled}>
                <Ionicon
                  icon="md-arrow-round-forward"
                  color="white"
                  fontSize="36px"
                />
              </span>
            )}
          </div>
        </div>
        {stop.data.attributes.body !== null ? (
          <div className={s.toggleText}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              href="#"
              onClick={e => this.handleClick(e)}
              className={s.toggleTextBtn}
            >
              <FormattedMessage {...messages.collapsible_read_text} />
            </a>
            <Collapsible open={this.state.displayText}>
              <div
                className={s.content}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: stop.data.attributes.body.value,
                }}
              />
            </Collapsible>
          </div>
        ) : (
          <div className={s.toggleText} />
        )}
        {answersList.length > 0 ? <AudioQuiz answersList={answersList} /> : ''}
      </div>
    );
  }
}

export default withStyles(vs, s)(StopPage);
