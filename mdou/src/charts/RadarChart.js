import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Radar } from 'react-chartjs-2'

class RadarChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string),
      datasets: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          data: PropTypes.arrayOf(PropTypes.number),
        })
      ),
    })
  }

  render() {
    return (
      <div className={this.props.className}>
        <h2>{this.props.title}</h2>
        {this.props.data && <Radar data={this.props.data} />}
      </div>
    )
  }
}

export default RadarChart
