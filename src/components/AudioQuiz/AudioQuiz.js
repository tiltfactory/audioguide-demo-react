import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import AudioAnswer from '../AudioAnswer';
import s from './AudioQuiz.css';

const messages = defineMessages({
  title: {
    id: 'audio_quiz.title',
    defaultMessage: 'Waiting for your choice',
    description: 'Audio quiz title',
  },
});

class AudioQuiz extends React.Component {
  static propTypes = {
    answersList: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  render() {
    const { answersList } = this.props;
    // @todo listen to audio answer then
    return (
      <div className={s.quizz}>
        <h3 className={s.quizTitle}>
          <FormattedMessage {...messages.title} />
        </h3>
        <ul className={s.listAnswers}>
          {answersList.map(audioAnswerItem => (
            <li
              key={`list-item-${audioAnswerItem.uuid}`}
              className={s.itemAnswer}
            >
              <AudioAnswer
                key={`answer-${audioAnswerItem.uuid}`}
                answer={audioAnswerItem}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(AudioQuiz);
