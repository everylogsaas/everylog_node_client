export class EverylogNotificationError extends Error {
  constructor(message, statusCode) {
    super(message); // (1)
    this.statusCode = statusCode;
  }
}
export default EverylogNotificationError;
