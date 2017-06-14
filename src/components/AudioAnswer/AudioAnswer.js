import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ReactAudioPlayer from 'react-audio-player';
import s from './AudioAnswer.css';

class AudioAnswer extends React.Component {

  static propTypes = {
    // @todo
  };

  render() {
    const { answer } = this.props;
    // @todo collapsed by default and expand on click

    return (
      <div>
        <h2>{answer.title}</h2>
        <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: answer.text }}
        />
        <ReactAudioPlayer
            src={answer.mp3URL}
            controls
        />
      </div>
    );
  }
}

export default withStyles(s)(AudioAnswer);
