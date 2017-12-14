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
    onClick: PropTypes.func.isRequired,
  };

  render() {
    // const { title, html } = this.props;
    return (
      <div
        className={[s.modal, this.props.openModal ? s.plzOpenModal : ''].join(
          ' ',
        )}
      >
        <div className={s.container}>
          <button
            className={s.btnClose}
            onClick={e => this.props.onClick(e)}
            tabIndex="0"
          >
            <Ionicon icon="md-close" color="black" fontSize="36px" />
          </button>
          <h1>Title</h1>
          <div
          // eslint-disable-next-line react/no-danger
          // dangerouslySetInnerHTML={{ __html: html }}
          />
          <p>
            Ce paramètre optionnel indique une chaine de caractères pour séparer
            chaque élément du tableau. Le séparateur est converti en une chaine
            de caractères si nécessaire. Si ce paramètre n est pas utilisé, les
            éléments du tableau seront séparés par une virgule. Si ce paramètre
            est la chaîne vide, les éléments seront accolés les uns aux autres
            sans espace entre. La valeur par défaut de ce paramètre est ,.
          </p>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Modal);
