"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EverylogNodeClient = void 0;
var _https = _interopRequireDefault(require("https"));
var _http = _interopRequireDefault(require("http"));
var _utils = require("./utils");
var _notificationError = require("./errors/notificationError");
var _genericError = require("./errors/genericError");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class EverylogNodeClient {
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
    protocol = 'https:',
    port = 443,
    hostname = 'api.everylog.io',
    path = '/api/v1/log-entries',
    method = 'POST',
    localTesting = false
  } = {}) {
    (0, _utils.checkApiKeyAndProjectId)({
      apiKey,
      projectId
    });
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
      Authorization: `Bearer ${this.apiKey}`
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
    (0, _utils.validateNotificationOptions)({
      title,
      summary,
      body,
      link,
      push,
      tags,
      groups,
      externalChannels,
      icon,
      properties
    });
    const data = JSON.stringify(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
      projectId: this.projectId,
      title,
      summary,
      body
    }, link !== null && {
      link
    }), push !== null && {
      push
    }), tags !== null && {
      tags
    }), groups !== null && {
      groups
    }), externalChannels != null && {
      externalChannels
    }), icon != null && {
      icon
    }), properties != null && {
      properties
    }));
    const option = {
      protocol: this.protocol,
      port: this.port,
      hostname: this.hostname,
      path: this.path,
      method: this.method,
      headers: _objectSpread(_objectSpread({}, this.headers), {}, {
        'Content-Length': Buffer.byteLength(data)
      })
    };
    return new Promise((resolve, reject) => {
      console.log('localTesting', this.localTesting);
      const req = (this.localTesting ? _http.default : _https.default).request(option, res => {
        let resData = '';
        const {
          statusCode
        } = res;
        res.on('data', chunk => {
          resData += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve({
              response: 'Successfully createdLog entry',
              statusCode
            });
          } else {
            const parsedData = JSON.parse(resData);
            reject(new _notificationError.EverylogNotificationError(parsedData.message, statusCode));
          }
        });
      }).on('error', err => {
        reject(new _genericError.EverylogGenericError(err.message));
      });
      req.write(data);
      req.end();
    });
  }
}
exports.EverylogNodeClient = EverylogNodeClient;
var _default = EverylogNodeClient;
exports.default = _default;