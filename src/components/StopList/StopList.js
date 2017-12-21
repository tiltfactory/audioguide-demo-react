import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Sticky from 'react-stickynode';
import Ionicon from 'react-ionicons';
import s from './StopList.css';
import StopTeaser from '../StopTeaser';
import Modal from '../../components/Modal';
import Link from '../Link';

class StopList extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    itinerary_id: PropTypes.string.isRequired,
    stops: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        attributes: PropTypes.shape({
          title: PropTypes.string.isRequired,
        }),
      }),
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  render() {
    const filterText = this.props.filterText;
    const filteredStops = [];

    // Filter by title or id.
    this.props.stops.forEach(stop => {
      if (
        !(
          stop.attributes.title
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
        ) &&
        !(stop.attributes.field_id.indexOf(filterText) !== -1)
      ) {
        return;
      }
      filteredStops.push(stop);
    });

    return (
      <div>
        <div className={s.list} id="test1">
          <div className={s.listContent}>
            <Sticky innerZ={99} bottomBoundary="#test1">
              <h2 className={s.title}>
                <img src="/tile.png" alt="test" />Objets
              </h2>
            </Sticky>
            <ul>
              {filteredStops.map(stop =>
                <li key={stop.id}>
                  <StopTeaser
                    destination={`/stop/${this.props.itinerary_id}/${stop.id}`}
                    stop={stop}
                  />
                </li>,
              )}
            </ul>
          </div>
        </div>

        <div className={s.list} id="test2">
          <div className={s.listContent}>
            <Sticky innerZ={99} bottomBoundary="#test2">
              <h2 className={s.title}>
                <img src="/tile.png" alt="test" />Objets
              </h2>
            </Sticky>
            <ul>
              {filteredStops.map(stop =>
                <li key={stop.id}>
                  <StopTeaser
                    destination={`/stop/${this.props.itinerary_id}/${stop.id}`}
                    stop={stop}
                  />
                </li>,
              )}
            </ul>
          </div>
        </div>

        <div className={[s.list, s.listInOtherItinaries].join(' ')}>
          <div className={s.listContent}>
            <h2 className={s.title}>Disponibles dans d’autres parcours</h2>
            <ul>
              <li key={filteredStops[0].id}>
                <StopTeaser
                  destination={`/stop/${this.props
                    .itinerary_id}/${filteredStops[0].id}`}
                  stop={filteredStops[0]}
                  onClick={e => this.toggle(e)}
                />
              </li>
            </ul>
          </div>
        </div>

        <div className={s.didntFoundAnything}>
          <Ionicon icon="md-sad" color="#BAA188" fontSize="250px" />
          <p>Stop non trouvé…</p>
          <button className={s.btn}>
            <Ionicon
              icon="md-refresh"
              color="#ffffff"
              fontSize="24px"
            />Réinitialiser la recherche
          </button>
        </div>

        <Modal onClick={e => this.toggle(e)} openModal={this.state.isModalOpen}>
          <div className={s.switchIt}>
            <h1 className={s.modalTitle}>Attention, dis !</h1>
            <p>Tu t’apprètes à changer de parcours, en es-tu bien sûr?</p>
            <Link className={s.btn} to={'#'} id="switchItinary">
              <Ionicon
                icon="md-arrow-round-forward"
                color="#ffffff"
                fontSize="24px"
              />Je change de parcours
            </Link>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(StopList);
