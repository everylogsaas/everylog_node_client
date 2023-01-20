import https from "https"
import { checkNotifications, checkOptions, checkSettings } from "./utils.js";

export default class EverylogClient {
  /**
   * 
   * @namespace settings
   * @property {Object} settings 
   * @property {string} settings.apiKey    - length: 36, mandatory, everylog account unique indentifier
   * @property {string} settings.projectId - length: 20, mandatory, the project unique identifier
   * 
   * @namespace options
   * @property {string} protocol   - default: "https:" 
   * @property {string} hostname   - default: "api.everylog.io"
   * @property {string} path       - default: "/api/v1/log-entries"
   * @property {string} method     - default: "POST"
   * @property {object} headers    - default: { 'Content-Type': 'application/json', 'Authorization': `Bearer {apiKey}`}
   * 
   */
  constructor(apiKey, projectId, { protocol = "https:", hostname = "api.everylog.io", path = "/api/v1/log-entries", method = "POST", headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer`, } } = {}) {

    checkSettings({ apiKey, projectId })
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.protocol = protocol;
    this.hostname = hostname;
    this.path = path;
    this.method = method;
    // this.headers = headers;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    }
  }

  /**
  * 
  * @namespace  notification
  * @property {object} notification         
  * @property {string} notification.title - length: 50, mandatory, the title of the entry
  * @property {string} notification.summary - length: 100, mandatory, a quick summary
  * @property {object} notification.body - string, mandatory, the full body to log
  * @property {array[string]} notification.tags - array of strings, optional, useful to better filter entries
  * @property {string} notification.links - string as url, optional, an external url to point
  * @property {boolean} notification.push - boolean, optional, true to receive a push notification
  * 
  */
  async notify({ title, summary, body, link = null, push = false, tags = [], groups = [] }) {

    checkNotifications({ title, summary, body, link, push, tags, groups })

    const data = JSON.stringify({
      projectId: this.projectId,
      title: title,
      summary: summary,
      body: body,
      ...(link != null && { link: link }),
      ...(push != null && { push: push }),
      ...(tags != null && { tags: tags }),
      ...(groups != null && { groups: groups })
    })

    const option = {
      protocol: this.protocol,
      hostname: this.hostname,
      path: this.path,
      method: this.method,
      headers: {
        // 'Authorization': this.headers.Authorization + this.apiKey,
        // 'Content-Type': this.headers["Content-Type"],
        ...this.headers,
        'Content-Length': data.length,
      }
    }

    return new Promise((resolve, reject) => {
      const req = https.request(option, res => {
        let resData = ''
        let statusCode = res.statusCode

        res.on("data", chunk => {
          resData += chunk
        });

        res.on("end", () => {
          const parsedData = JSON.parse(resData)
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve({ response: parsedData, statusCode })
          } else {
            reject({ error: parsedData.message, statusCode })
          }
        })
      })
        .on("error", err => {
          reject({ error: err })
        })
      req.write(data)
      req.end()
    })
  }
};
