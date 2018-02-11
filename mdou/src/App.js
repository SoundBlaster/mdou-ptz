import React, { Component } from 'react'
import './App.css'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import * as firebase from 'firebase'
import * as firestore from 'firebase/firestore'
import LoadingIndicator from 'react-loading-indicator'
import LineChart from './charts/LineChart'
import RadarChart from './charts/RadarChart'
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

const DAYS = 'days'
const QUERY = 'query'

// 1, 4, 7
const regionData = {
  labels: [
    'Голиковка',
    'Древлянка',
    'Другие',
    'Железнодорожный (5 поселок)',
    'Зарека',
    'Ключевая',
    'Кукковка',
    'Октябрьский',
    'Первомайский',
    'Перевалка',
    'Пески',
    'Птицефабрика',
    'Рыбка',
    'Сайнаволок',
    'Соломенное',
    'Сулажгора',
    'Сулажгорский кирпичный завод',
    'Университетский городок',
    'Усадьбы',
    'Центр',
  ],
  datasets: [
    {
      label: 'Принятых за год',
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
      data: [],
    },
    {
      label: 'На учете на дату',
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
      data: [],
    },
    {
      label: 'Выданных за год',
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
      data: [],
    },
  ],
}

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Принятых за год',
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
      label: 'На учете на дату',
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
      label: 'Выданных за год',
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

const queryData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Номер записи 145732705',
      id: '145732705',
      type: 'line',
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
      label: 'Изменение с прошлой даты 145732705',
      id: 'd145732705',
      yAxisID: 'LITTLE',
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
  ],
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
  'Принято за год по району проживания',
  'На учёте на дату',
  'На учете по году рождения',
  'На учете по району проживания',
  'Выдано за год',
  'Выдано за год по году рождения',
  'Выдано за год по району проживания',
]

class App extends Component {
  constructor(props) {
    super(props)
    this.url = 'https://mdou.petrozavodsk-mo.ru/site/statistics'
    this.state = {
      loaded: false,
      loading: false,
      content: undefined,
      query: undefined,
      selected: [],
    }
    this._onChangeSelection = this._onChangeSelection.bind(this)
    this._renderDates = this._renderDates.bind(this)
    this._renderDate = this._renderDate.bind(this)
  }

  componentDidMount() {
    this._load()
  }

  _setState(newState) {
    return this.setState(newState, () => {
      console.log('State updated:', this.state)
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
          Прислать свои данные вы можете на почту <a target="_blank" href="mailto:egor.merkushev@yandex.ru">egor.merkushev@yandex.ru</a>
        </p>
        <div className='App-content'>
          {this._renderQuery()}
          {this._renderContent()}
        </div>
      </div>
    )
  }

  _renderContent() {
    if (this.state.content) {

      require('moment/locale/ru')
      // get labels for X axis
      const content = [...this.state.content]
      data.labels = content
        .reverse()
        .map(record => moment(this._fixDate(record.date), 'YYYYMMDDHHmm').format('HH:mm DD MMMM'))

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

      // filters
      if (this.state.selected.length) {
        const idxs = this._getFilterIndexes()
        dates = dates.map(date => date.filter((_, idx) => {
          return idxs.includes(idx)
        }))
      }

      // regions data for radar
      // get values from 1, 4, 7
      const mapRegions = value => value.map(item => ({
        region: item[0],
        data: parseInt(item[1], 10),
      })).reduce((obj, item) => {
        obj[item.region] = item.data;
        return obj;
      }, {});
      const regionValues = content
        .map(record => [
            mapRegions(record.value[1]),
            mapRegions(record.value[4]),
            mapRegions(record.value[7]),
          ]
        )

      const concreteDay = regionValues[0]
      concreteDay.forEach((item, idx) => {
        Object.keys(item).forEach(function (key){
          const index = regionData.labels.indexOf(key)
          regionData.datasets[idx].data[index] = item[key]
        })
      })

      return (
        <div>
          <LineChart
            title={'Общие тренды'}
            className={'App-totalChart'}
            data={data}
          />
          <RadarChart
            title={'По районам'}
            className={'App-totalChart'}
            data={regionData}
          />
          {this._renderFilters()}
          {dates.map(this._renderDates)}
        </div>
      )
    }
    return (
      <div className='App-loading'>
        {this.state.loading ? <LoadingIndicator /> : null}
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
    const idxs = this._getFilterIndexes()
    const idx = idxs.length ? idxs[i] : i
    const title = `${tableTitles[idx]}`
    return (
      <div className='App-table' key={`table${i}`}>
        <h2>{title}</h2>
        {date.map((row, idx) => (<p key={`row${idx}`}>{row[0]} : {row[1]}</p>))}
      </div>
    )
  }

  _renderQuery() {
    if (this.state.query) {
      // get labels for X axis
      require('moment/locale/ru')
      const content = [...this.state.query]
      queryData.labels = content
        .reverse()
        .map(record => moment(this._fixDate(record.date), 'YYYYMMDDHHmm').format('HH:mm DD MMMM'))
      const id = 145732705
      const idString = id.toString()
      const deltaIDString = 'd' + idString
      queryData.datasets.filter(dataset => dataset.id === idString)[0]
        .data = content.map(item => item.value[id])
      queryData.datasets.filter(dataset => dataset.id === deltaIDString)[0]
        .data = content.map((item, idx, array) => {
          if (idx-1 > 0)
            return array[idx-1].value[id] - item.value[id]
          else
            return 0
        })
      debugger
      return (
        <div>
          <LineChart
            title={'Изменения в очереди'}
            className={'App-totalChart'}
            data={queryData}
          />
        </div>
      )
    }
    return null
  }

  _getFilterIndexes = () => this.state.selected.map(filter => filter.value)

  _load() {
    this._setState({
      loading: true,
    })
    this._loadStore()
    return this
  }

  _onDidLoad() {
    this._setState({
      loading: false,
      loaded: true,
    })
    return this
  }

  _loadStore() {

    const actions = [
      this._loadQuery(),
      this._loadDays(),
    ]
    return Promise.all(actions)
      .then(() => this._onDidLoad())
  }

  _handleLoadingError(error) {
    alert('Произошла ошибка:' + error.message)
    this._onDidLoad()
  }

  _setReversedDataForKey = key => data => this._setData(data.reverse(), key)

  _setData(data, key) {
    this._setState({ [key]: data })
    return data
  }

  _mapDocs = (handler = doc => doc.data()) =>
    snapshot => snapshot.docs.map(doc => ({ date: doc.id, value: handler(doc) }))

  _loadQuery() {
    if (!db) return
    return db.collection(QUERY)
      .get()
      .then(this._mapDocs())
      .then(
        this._setReversedDataForKey("query"),
        this._handleLoadingError
      )
  }

  _loadDays() {
    if (!db) return
    return db.collection(DAYS)
      .get()
      .then(this._mapDocs(doc => JSON.parse(doc.data().value)))
      .then(
        this._setReversedDataForKey("content"),
        this._handleLoadingError
      )
  }

  _onChangeSelection(selectedOptions) {
    this._setState({
      selected: selectedOptions,
    })
  }

  _fixDate = date => {
    let number = parseInt(date, 10)
    // fix month by +1 to MM
    number = number + (date.length > 8 ? 1000000 : 100)
    if (date.length <= 8) number *= 10000 // fix old YYYYMMDD format
    return number.toLocaleString('en-US', { minimumIntegerDigits: 12, useGrouping:false })
  }

}

export default App
