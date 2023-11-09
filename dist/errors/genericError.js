"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EverylogGenericError = void 0;
class EverylogGenericError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}
exports.EverylogGenericError = EverylogGenericError;
var _default = EverylogGenericError;
exports.default = _default;