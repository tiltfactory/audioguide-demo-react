import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Page from '../Page';
import Link from '../Link';
import s from './AudioContentList.css';

class AudioContentList extends Page {

  static propTypes = {
      // @todo
  };

  render() {
    const { audioList } = this.props;
    console.log(audioList);

    return (
      <div className={s.root}>
        <div className={s.container}>
          <ul>
            {audioList.data.map(
                                audioItem =>
                                    (<li key={audioItem.attributes.uuid}>
                                      <Link className={s.link} to={`/audio/${audioItem.attributes.uuid}`}>
                                        <span className="id">{audioItem.attributes.field_id}</span>
                                        <span className="title"> {audioItem.attributes.title}</span>
                                      </Link>
                                    </li>),
                            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AudioContentList);
