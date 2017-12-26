import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Line } from 'react-chartjs-2'

class LineChart extends Component {
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
        {this.props.data && <Line
          data={this.props.data}
          width={100}
          height={30}
          options={{
            maintainAspectRatio: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }}
        />}
      </div>
    )
  }
}

export default LineChart
