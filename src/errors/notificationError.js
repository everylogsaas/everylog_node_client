export class EveryLogNotificationError extends Error {
  constructor(message, statusCode) {
    super(message); // (1)
    this.statusCode = statusCode;
  }
}
export default EveryLogNotificationError;
