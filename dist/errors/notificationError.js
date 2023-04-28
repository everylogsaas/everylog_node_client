"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EveryLogNotificationError = void 0;
class EveryLogNotificationError extends Error {
  constructor(message, statusCode) {
    super(message); // (1)
    this.statusCode = statusCode;
  }
}
exports.EveryLogNotificationError = EveryLogNotificationError;
var _default = EveryLogNotificationError;
exports.default = _default;