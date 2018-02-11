/*
const loadData = () => {
  return db.collection('stats')
    .get()
    .then((snapshot) => {
      const data = []
      snapshot.forEach((doc) => {
        data.push({
          date: doc.id,
          value: doc.data().value,
        })
      })
      return data
    })
}

const logData = data => {
  console.log('loaded:', data.map(({ date }) => date))
  return data
}

const fixDate = date => {
  if (date.length === 8) {
    // 01234567
    // DDMMYYYY => YYYYMMDD
    const day = date.slice(0, 2)
    const month = date.slice(2, 4)
    const year = date.slice(4,8)
    return parseInt(`${year}${month}${day}`, 10)
  }
  return date
}

const fixDates = data => {
  return data.map(({ date, value }) => ({ date: fixDate(date), value}))
}

const writeData = data => {
  const promises = data.map(({ date, value }) => upload('days', value, date))
  return Promise.all(promises)
}

const fix = () => {
  loadData()
    .then(logData)
    .then(fixDates)
    .then(logData)
    .then(writeData)
    .then(result => {
      console.log('done', result)
    })
    .catch(error => {
      console.log('error', error)
    })
}*/
