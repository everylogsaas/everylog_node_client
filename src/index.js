import https from 'https';
import http from 'http';
import {
  validateNotificationOptions,
  checkApiKeyAndProjectId,
} from './utils';
import { EverylogNotificationError } from './errors/notificationError';
import { EverylogGenericError } from './errors/genericError';

export class EverylogNodeClient {
  /**
   *
   * @namespace settings
   * @property {Object} settings
   * @property {string} settings.apiKey
   * @property {string} settings.projectId - String, mandatory, the project unique identifier
   *
   * @namespace options
   * @property {string} protocol   - default: "https:"
   * @property {string} port       - default: "443"
   * @property {string} hostname   - default: "api.everylog.io"
   * @property {string} path       - default: "/api/v1/log-entries"
   * @property {string} method     - default: "POST"
   * @property {boolean} localTesting - default: false
   *
   */
  constructor(apiKey, projectId, {
    protocol = 'https:', port = 443, hostname = 'api.everylog.io', path = '/api/v1/log-entries', method = 'POST', localTesting = false
  } = {}) {
    checkApiKeyAndProjectId({ apiKey, projectId });
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.localTesting = localTesting;
    this.protocol = protocol;
    this.port = port;
    this.hostname = hostname;
    this.path = path;
    this.method = method;
    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  /**
  *
  * @namespace  logEntry
  * @property {object} logEntry
  * @property {string} logEntry.title - the title of the entry, length 50
  * @property {string} logEntry.summary - a quick summary, length 100
  * @property {object} logEntry.body -  the full body to log
  * @property {array[string]} [logEntry.tags] - useful to better filter entries
  * @property {string} [logEntry.links] - string as url, an external url to point
  * @property {boolean} [logEntry.push] - boolean, true to receive a push logEntry
  * @property {array[string]} [logEntry.groups] - useful to better send logEntries
  * @property {array[string]} [logEntry.externalChannels] - send logEntry to externalChannel
  * @property {string} [logEntry.icon] - emoji icon fot logEntry
  * @property {array[object]} [logEntry.properties] - useful to filter logEntries by properties
  *
  *
  */
  async createLogEntry({
    title,
    summary,
    body,
    link = null,
    push = false,
    tags = [],
    groups = [],
    externalChannels = [],
    icon = null,
    properties = null
  }) {
    validateNotificationOptions({
      title, summary, body, link, push, tags, groups, externalChannels, icon, properties
    });

    const data = JSON.stringify({
      projectId: this.projectId,
      title,
      summary,
      body,
      ...(link !== null && { link }),
      ...(push !== null && { push }),
      ...(tags !== null && { tags }),
      ...(groups !== null && { groups }),
      ...(externalChannels != null && { externalChannels }),
      ...(icon != null && { icon }),
      ...(properties != null && { properties }),
    });

    const option = {
      protocol: this.protocol,
      port: this.port,
      hostname: this.hostname,
      path: this.path,
      method: this.method,
      headers: {
        ...this.headers,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    return new Promise((resolve, reject) => {
      console.log('localTesting', this.localTesting);
      const req = (this.localTesting ? http : https).request(option, (res) => {
        let resData = '';
        const { statusCode } = res;

        res.on('data', (chunk) => {
          resData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve({ response: 'Successfully createdLog entry', statusCode });
          } else {
            const parsedData = JSON.parse(resData);
            reject(new EverylogNotificationError(parsedData.message, statusCode));
          }
        });
      })
        .on('error', (err) => {
          reject(new EverylogGenericError(err.message));
        });
      req.write(data);
      req.end();
    });
  }
}

export default EverylogNodeClient;
