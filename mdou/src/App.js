import React, { Component } from 'react'
import './App.css'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import * as firebase from 'firebase'
import * as firestore from 'firebase/firestore'

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

    db.collection('stats').get()
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
          {this._renderFilters()}
          {this._renderContent()}
        </div>
      </div>
    )
  }

  _renderContent() {
    if (this.state.content) {
      let dates = this.state.content
        .map(record => record.value)
      if (this.state.selected.length) {
        const idxs = this.state.selected.map(filter => filter.value)
        dates = dates.map(date => date.filter((_, idx) => idxs.includes(idx)))
      }
      return dates.map(this._renderDates)
    }
    return null
  }

  _renderFilters() {
    return (
      <div className='App-select'>
        <Select
          multi
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
