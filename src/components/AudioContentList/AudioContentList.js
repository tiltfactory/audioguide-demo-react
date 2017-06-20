import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Page from '../Page';
import Link from '../Link';
import s from './AudioContentList.css';

class AudioContentList extends Page {

  static propTypes = {
      // @todo
  };

  constructor({ audioProfileItem }) {
    super();
    this.state = {
      input: '',
      audioProfileItem,
    };
  }

  onChangeHandler(e) {
    this.setState({
      input: e.target.value,
    });
  }

  render() {
    const { audioList } = this.props;
    // const list = this.state.audioList
    //              .filter(d => this.state.input === '' || d.includes(this.state.input))
    //              .map((d, index) => <li key={index}>{d}</li>);

    return (
      <div className={s.root}>
        <div className={s.navigation}>
          <Link className={s.link} to="/">&lt; Profils</Link>
          <input value={this.state.input} placeholder="Chercher..." type="text" onChange={this.onChangeHandler.bind(this)} />
        </div>
        <div className={s.container}>
          <h1>Audioguide { this.state.audioProfileItem.attributes.name }</h1>
          <ul>
            {audioList.data.map(
                                audioItem =>
                                    (<li key={audioItem.attributes.uuid}>
                                      <Link className={s.link} to={`/audio/${audioItem.attributes.uuid}`}>
                                        <span className={s.audioId}>
                                          {audioItem.attributes.field_id}
                                        </span>
                                        <span className={s.audioTitle}>
                                          {audioItem.attributes.title}
                                        </span>
                                      </Link>
                                    </li>),
                            )}
          </ul>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  audioProfileItem: state.profile.audioProfileItem,
});

export default connect(mapState)(withStyles(s)(AudioContentList));
