import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StopListPage.css';
import StopListHeader from '../../components/StopListHeader';
import FilterableStopList from '../../components/FilterableStopList';

class StopListPage extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    itinerary_id: PropTypes.string.isRequired,
    stops: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  render() {
    const { stops } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <StopListHeader />
          <FilterableStopList
            itinerary_id={this.props.itinerary_id}
            stops={stops}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(StopListPage);
