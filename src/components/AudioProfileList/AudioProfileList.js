import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Page from '../Page';
import Link from '../Link';
import s from './AudioProfileList.css';

class AudioProfileList extends Page {

  static propTypes = {
      // @todo
  };

  render() {
    const { staticContent, audioProfileList } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{staticContent.title}</h1>
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: staticContent.html }}
          />
          <ul>
            {audioProfileList.data.map(
                            audioProfileItem =>
                                (<li key={audioProfileItem.attributes.uuid}>
                                  <Link className={s.link} to={`/?audio_profile=${audioProfileItem.attributes.uuid}`}>
                                    {audioProfileItem.attributes.name}
                                  </Link>
                                  <div
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{ __html: audioProfileItem.attributes.description.value }}
                                  />
                                </li>),
                            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AudioProfileList);
