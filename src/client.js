import https from "https"
import { checkNotifications, checkSettings } from "./utils.js";

export default class EverylogClient {
  /**
   * 
   * @namespace settings
   * @property {Object} settings 
   * @property {string} settings.apiKey    - length: 36, mandatory, everylog account unique indentifier
   * @property {string} settings.projectId - length: 20, mandatory, the project unique identifier
   * 
   */
  constructor(settings) {
    checkSettings(settings)
    this.apiKey = settings.apiKey;
    this.projectId = settings.projectId;
  }

  /**
  * 
  * @namespace  notification
  * @property {object}  notification         
  * @property {string}  notification.title - length: 50, mandatory, the title of the entry
  * @property {string}  notification.summary - length: 100, mandatory, a quick summary
  * @property {object}  notification.body - string, mandatory, the full body to log
  * @property {array[string]}   notification.push - array of strings, optional, useful to better filter entries
  * @property {string}  notification.links - string as url, optional, an external url to point
  * @property {boolean} notification.tags - boolean, optional, true to receive a push notification
  * 
  */
  async notify(notification) {

    checkNotifications(notification)

    const data = JSON.stringify({
      projectId: this.projectId,
      title: notification.title,
      summary: notification.summary,
      body: notification.body,
      ...(notification.link != null && notification.link != undefined && { link: notification.link }),
      ...(notification.push != null && notification.push != undefined && { push: notification.push }),
      ...(notification.tags != null && notification.tags != undefined && { tags: notification.tags }),
    })

    const options = {
      protocol: "https:",
      hostname: "api.everylog.io",
      path: '/api/v1/log-entries',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Length': data.length,
      }
    }

    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
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
      console.log('end request')
    })
  }
};
