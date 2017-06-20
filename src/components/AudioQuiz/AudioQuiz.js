import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import AudioAnswer from '../AudioAnswer';
import s from './AudioQuiz.css';

class AudioQuiz extends React.Component {

  static propTypes = {
    // @todo
    // answersList: PropTypes.array.isRequired,
  };

  render() {
    const { answersList } = this.props;
    // @todo listen to audio answer then
    return (
      <div>
        <h3 className={s.quizTitle}>Choisir une réponse</h3>
        <ul>
          {answersList.map(
                  audioAnswerItem =>
                      (<li key={audioAnswerItem.uuid}>
                        <AudioAnswer answer={audioAnswerItem} />
                      </li>),
              )}
        </ul>
        <button className="btn btn-default">Confirmer</button>
      </div>
    );
  }
}

export default withStyles(s)(AudioQuiz);
