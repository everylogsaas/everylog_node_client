"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EveryLogGenericError = void 0;
class EveryLogGenericError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}
exports.EveryLogGenericError = EveryLogGenericError;
var _default = EveryLogGenericError;
exports.default = _default;