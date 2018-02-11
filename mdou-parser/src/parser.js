import https from 'https'
import cheerio from 'cheerio'
import fetch from 'node-fetch'

export default class Parser {
  /**
   * Default URL address of MDOU web resourse
   * @type {string}
   */
  mdouURL = 'https://mdou.petrozavodsk-mo.ru/site/statistics'

  /**
   * Parse statistics data from a remote web page
   * @param {string} [url]
   */
  parse = url => fetch(url || this.mdouURL, this._parseRequestParams())
      .then(this._handleResponseText)
      .then(this._fixHTMLErrors)
      .then(this._parseBody)
      .then(this._parseTables)
      .then(this._buildData)

  _parseRequestParams = () => {
    return {
      method: 'GET',
      headers: {
        'Accept-Encoding': 'br, gzip, deflate',
        'Accept': 'text/html,application/xhtml+xml,application/xmlq=0.9,*/*q=0.8',
        'Accept-Language': 'ru',
      },
      agent: new https.Agent({ rejectUnauthorized: false }),
    }
  }
  /**
   * @param {*} r
   * @return {string}
   */
  _handleResponseText = r => r.text()
  /**
   * @param {string} body
   * @return {string}
   */
  _fixHTMLErrors = body => body.replace('</tr> </tr>', '</tr>')
  /**
   *
   * @param {string} body
   * @return {Array<[]>}
   */
  _parseBody = body => {
    const $ = cheerio.load(body)
    const nodes = $('table[class=stat] > tbody')
    const t1 = nodes.eq(0).find('td')
    const t2 = nodes.eq(1).find('td')
    const t3 = nodes.eq(2).find('td')
    return [t1, t2, t3]
  }
  /**
   * @param {Array<[]>} tables
   * @return {Array<[]>}
   */
  _parseTables = tables => {
    const rawdata = [[], [], []]
    tables.forEach((table, idx) => {
      table.each((i, td) => {
        if (!rawdata[idx][Math.floor(i / 2)]) rawdata[idx][Math.floor(i / 2)] = []
        rawdata[idx][Math.floor(i / 2)][i % 2] = td.firstChild && td.firstChild.data
      })
    })
    return rawdata
  }
  /**
   * @param {Array<[]>} rawdata
   * @return {Array<[]>}
   */
  _buildData = rawdata => ([
    [...rawdata[0].slice(0,2)],
    [...rawdata[0].slice(3)],
    [...rawdata[1].slice(0,2)],
    [...rawdata[1].slice(3,8)],
    [...rawdata[1].slice(9)],
    [...rawdata[2].slice(0,2)],
    [...rawdata[2].slice(3,13)],
    [...rawdata[2].slice(15)]
  ])
}
