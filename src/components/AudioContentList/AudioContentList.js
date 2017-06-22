import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setList, setItem } from '../../actions/audio';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Page from '../Page';
import Link from '../Link';
import s from './AudioContentList.css';

class AudioContentList extends Page {

  static propTypes = {
      // @todo
  };

  // @todo check scope
  constructor({ audioProfileItem, setList, setItem }) {
    super();
    this.state = {
      input: '',
      audioProfileItem,
      setList,
      setItem,
    };
  }

  onChangeHandler(e) {
    this.setState({
      input: e.target.value,
    });
  }

  render() {
    const { audioList } = this.props;
    // @todo refactor to avoid side effect
    this.state.setList({ audioList });
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
                                      <Link
                                        className={s.link}
                                        to={`/audio/${audioItem.attributes.uuid}`}
                                        onClick={() => {
                                          this.state.setItem({ audioItem });
                                        }}
                                      >
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

const mapDispatch = {
  setList,
  setItem,
};

export default connect(mapState, mapDispatch)(withStyles(s)(AudioContentList));
