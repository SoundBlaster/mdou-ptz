import React, { Component } from 'react'
import './App.css'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import * as firebase from 'firebase'
import * as firestore from 'firebase/firestore'
import LoadingIndicator from 'react-loading-indicator'
import LineChart from './charts/LineChart'
import * as moment from 'moment'

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBHseZFrp9TIx5h3CUn93sxx2TfDlwZbac',
  authDomain: 'mdou-ptz.firebaseapp.com',
  databaseURL: 'https://mdou-ptz.firebaseio.com',
  projectId: 'mdou-ptz',
  storageBucket: 'mdou-ptz.appspot.com',
  messagingSenderId: '385856270254'
}
firebase.initializeApp(config)
const db = firebase.firestore()

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Принятых',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(192,72,192,0.4)',
      borderColor: 'rgba(192,72,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(192,72,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(192,72,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      label: 'На учете',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [76, 45, 34, 65, 88, 44, 65],
    },
    {
      label: 'Выданных',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(192,192,71,0.4)',
      borderColor: 'rgba(192,192,72,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(192,192,72,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(192,192,72,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [33, 11, 54, 34, 78, 44, 34],
    }
  ]
}

const tableTitles = [
  'Количество принятых заявлений за прошедшие 12 месяцев',
  'Количество принятых заявлений за прошедшие 12 месяцев по району проживания',
  'Количество состоящих на учете',
  'Количество состоящих на учете по году рождения',
  'Количество состоящих на учете по району проживания',
  'Количество выданных направлений за прошедшие 12 месяцев',
  'Количество выданных направлений за прошедшие 12 месяцев по году рождения',
  'Количество выданных направлений за прошедшие 12 месяцев по району проживания',
]

const tableTitlesShort = [
  'Принято за год',
  'Количество принятых заявлений за прошедшие 12 месяцев по району проживания',
  'На учёте',
  'Количество состоящих на учете по году рождения',
  'Количество состоящих на учете по району проживания',
  'Выдано за год',
  'Количество выданных направлений за прошедшие 12 месяцев по году рождения',
  'Количество выданных направлений за прошедшие 12 месяцев по району проживания',
]

class App extends Component {
  constructor(props) {
    super(props)
    this.url = 'https://mdou.petrozavodsk-mo.ru/site/statistics'
    this.state = {
      loaded: false,
      loading: false,
      content: undefined,
      selected: [],
    }
    this._onChangeSelection = this._onChangeSelection.bind(this)
    this._renderDates = this._renderDates.bind(this)
    this._renderDate = this._renderDate.bind(this)
  }

  componentDidMount() {
    this.setState({
      loading: true,
    })
    this._loadStore()
  }

  _loadStore() {
    if (!db) return

    db.collection('days').get()
      .then((snapshot) => {
        const data = []
        snapshot.forEach((doc) => {
          data.push({ date: doc.id, value: JSON.parse(doc.data().value) })
        })
        return data
      })
      .then(data => {
        this.setState({
          content: data.reverse(),
          loading: false,
          loaded: true,
        })
        return data
      })
      .catch(e => {
        console.log('error', e)
        this.setState({
          loading: false,
          loaded: true,
        })
      })
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>История статистики системы «Дошкольник» города Петрозаводска</h1>
        </header>
        <p className='App-intro'>
          Здесь вы можете просмотреть историю изменений данных, представленных на странице <a target='_blank' rel='noopener noreferrer' href='https://mdou.petrozavodsk-mo.ru/site/statistics'>«Статистика»</a>.
        </p>
        <div className='App-content'>
          {this._renderContent()}
        </div>
      </div>
    )
  }

  _renderContent() {
    if (this.state.content) {
      const fixDate = date => (parseInt(date, 10) + 100)
        .toLocaleString('en-US', { minimumIntegerDigits: 8, useGrouping:false })
      require('moment/locale/ru')
      // get labels for X axis
      const content = [...this.state.content]
      data.labels = content
        .reverse()
        .map(record => moment(fixDate(record.date), 'YYYYMMDD')
          .format('DD MMMM')
        )

      // get values from 0, 2, 5
      const vals = content
        .map(record => [
          parseInt(record.value[0][0][1], 10),
          parseInt(record.value[2][0][1], 10),
          parseInt(record.value[5][0][1], 10),
          ]
        )
      const vals0 = vals.reduce((a,b) => a.concat(b[0]), [])
      const vals1 = vals.reduce((a,b) => a.concat(b[1]), [])
      const vals2 = vals.reduce((a,b) => a.concat(b[2]), [])
      data.datasets[0].data = vals0
      data.datasets[1].data = vals1
      data.datasets[2].data = vals2

      let dates = this.state.content
        .map(record => record.value)
      if (this.state.selected.length) {
        const idxs = this.state.selected.map(filter => filter.value)
        dates = dates.map(date => date.filter((_, idx) => idxs.includes(idx)))
      }

      return (
        <div>
          <LineChart
            title={'Общие тренды за год'}
            className={'App-totalChart'}
            data={data}
          />
          {this._renderFilters()}
          {dates.map(this._renderDates)}
        </div>
      )
    }
    return (
      <div className='App-loading'>
        <LoadingIndicator />
      </div>
    )
  }

  _renderFilters() {
    return (
      <div className='App-select'>
        <Select
          multi
          placeholder={'Фильтры...'}
          name='tablesSelect'
          value={this.state.selected}
          onChange={this._onChangeSelection}
          options={tableTitles.map((title, i) => ({ value: i, label: title }))}
        />
      </div>
    )
  }

  _renderDates(dates, idx) {
    return (
      <div key={`date${idx}`}>
        <div className='App-table-date'>
          <h3>{this.state.content[idx].date}</h3>
        </div>
        {dates.map(this._renderDate)}
      </div>
    )
  }

  _renderDate(date, i) {
    return (
      <div className='App-table' key={`table${i}`}>
        <h2>{`${tableTitles[i]}`}</h2>
        {date.map((row, idx) => (<p key={`row${idx}`}>{row[0]} : {row[1]}</p>))}
      </div>
    )
  }

  _onChangeSelection(selectedOptions) {
    console.log('select:', selectedOptions)
    this.setState({
      selected: selectedOptions,
    })
  }
}

export default App
