"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EverylogNotificationError = void 0;
class EverylogNotificationError extends Error {
  constructor(message, statusCode) {
    super(message); // (1)
    this.statusCode = statusCode;
  }
}
exports.EverylogNotificationError = EverylogNotificationError;
var _default = EverylogNotificationError;
exports.default = _default;