import fs from 'fs'

const TMP_PATH = '/tmp/mdou'

const readFile = path => new Promise((resolve, reject) => {
  fs.readFile(path,
    { encoding: 'utf8'},
    (err, data) => {
      if (err) { reject(err) }
      resolve(data)
    })
})

const deleteFile = path => new Promise((resolve, reject) => {
  fs.unlink(path,
    (err) => {
      if (err) { reject(err) }
      resolve(path)
    })
})

const writeFile = (path, data) => new Promise((resolve, reject) => {
  fs.writeFile(path,
    data,
    { encoding: 'utf8'},
    (err) => {
      if (err) { reject(err) }
      resolve(path)
    })
})

export default {
  readFile,
  deleteFile,
  writeFile,
  TMP_PATH,
}
