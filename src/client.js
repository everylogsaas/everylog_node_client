import https from "https"
import http from "http"
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
   * @property {string} hostname   - default: "api.everylog.io"
   * @property {string} path       - default: "/api/v1/log-entries"
   * @property {string} method     - default: "POST"
   * @property {object} headers    - default: { 'Content-Type': 'application/json', 'Authorization': `Bearer {apiKey}`}
   * @property {number} port       - default: 443  
   * 
   */
  constructor(apiKey, projectId, { hostname = "api.everylog.io", path = "/api/v1/log-entries", method = "POST", port = 443 } = {}) {

    checkSettings({ apiKey, projectId })
    checkOptions({ hostname, path, method })
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.protocol = "https:";
    this.hostname = hostname;
    this.path = path;
    this.method = method;
    this.port = port
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
  * @property {array[string]} notification.groups - array of strngs, optional, useful to better send notifications
  * @property {array[string]} notification.externalChannels - array of strings, optional, send notification to externalChannel
  * @property {string} notification.icon -string as icon, optional, icon fot notification
  * @property {object} notification.properties -object {key: "value"}, optional, useful to filter notifications by properties
  * 
  */
  async notify({ title, summary, body, link = null, push = false, tags = [], groups = [], externalChannels = [], icon = null, properties = null }) {

    checkNotifications({ title, summary, body, link, push, tags, groups, externalChannels, icon, properties })

    const data = JSON.stringify({
      projectId: this.projectId,
      title: title,
      summary: summary,
      body: body,
      ...(link != null && { link: link }),
      ...(push != null && { push: push }),
      ...(tags != null && { tags: tags }),
      ...(groups != null && { groups: groups }),
      ...(externalChannels != null && { externalChannels: externalChannels }),
      ...(icon != null && { icon: icon }),
      ...(properties != null && { properties: properties }),
    })

    console.log(data);

    let option = {
      //protocol: this.protocol,
      hostname: this.hostname,
      path: this.path,
      method: this.method,
      headers: {
        // 'Authorization': this.headers.Authorization + this.apiKey,
        // 'Content-Type': this.headers["Content-Type"],
        ...this.headers,
        // 'Content-Length': data.length,
      },
    }

    if (this.port === 443) {
      option.protocol = "https:"

    } else {
      option.port = this.port
    }


    return new Promise((resolve, reject) => {
      const req = (this.port === 443 ? https : http).request(option, res => {
        let resData = ''
        let statusCode = res.statusCode

        res.on("data", chunk => {
          resData += chunk
        });

        res.on("end", () => {
          const parsedData = JSON.parse(resData)
          if (res.statusCode >= 200 && res.statusCode <= 299 || res.statusCode == 401) {
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
