"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EveryLogClient = void 0;
var _https = _interopRequireDefault(require("https"));
var _utils = require("./utils");
var _notificationError = require("./errors/notificationError");
var _genericError = require("./errors/genericError");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class EveryLogClient {
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
   *
   */
  constructor(apiKey, projectId, {
    protocol = 'https:',
    port = 443,
    hostname = 'api.everylog.io',
    path = '/api/v1/log-entries',
    method = 'POST'
  } = {}) {
    (0, _utils.checkApiKeyAndProjectId)({
      apiKey,
      projectId
    });
    this.apiKey = apiKey;
    this.projectId = projectId;
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
  * @namespace  notification
  * @property {object} notification
  * @property {string} notification.title - the title of the entry, length 50
  * @property {string} notification.summary - a quick summary, length 100
  * @property {object} notification.body -  the full body to log
  * @property {array[string]} [notification.tags] - useful to better filter entries
  * @property {string} [notification.links] - string as url, an external url to point
  * @property {boolean} [notification.push] - boolean, true to receive a push notification
  *
  */
  async notify({
    title,
    summary,
    body,
    link = null,
    push = false,
    tags = [],
    groups = []
  }) {
    (0, _utils.validateNotificationOptions)({
      title,
      summary,
      body,
      link,
      push,
      tags,
      groups
    });
    const data = JSON.stringify(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
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
      const req = _https.default.request(option, res => {
        let resData = '';
        const {
          statusCode
        } = res;
        res.on('data', chunk => {
          resData += chunk;
        });
        res.on('end', () => {
          const parsedData = JSON.parse(resData);
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve({
              response: parsedData,
              statusCode
            });
          } else {
            reject(new _notificationError.EveryLogNotificationError(parsedData.message, statusCode));
          }
        });
      }).on('error', err => {
        reject(new _genericError.EveryLogGenericError(err.message));
      });
      req.write(data);
      req.end();
    });
  }
}
exports.EveryLogClient = EveryLogClient;
var _default = EveryLogClient;
exports.default = _default;