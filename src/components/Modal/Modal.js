/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Ionicon from 'react-ionicons';
import s from './Modal.css';

class Modal extends React.Component {
  static propTypes = {
    //   title: PropTypes.string.isRequired,
    //   html: PropTypes.string.isRequired,
    openModal: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    children: PropTypes.element.isRequired,
    fullScreen: PropTypes.bool,
  };

  static defaultProps = {
    onClick: null,
    fullScreen: false,
  };

  render() {
    const { children } = this.props;
    return (
      <div
        className={[
          s.modal,
          this.props.openModal ? s.plzOpenModal : '',
          this.props.fullScreen ? s.fs : '',
        ].join(' ')}
      >
        <div className={s.container}>
          <button
            className={s.btnClose}
            onClick={e => this.props.onClick(e)}
            tabIndex="0"
          >
            <Ionicon icon="md-close" color="black" fontSize="36px" />
          </button>
          {children}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Modal);
