"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateNotificationOptions = exports.checkApiKeyAndProjectId = void 0;
const isValidHttpUrl = string => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};
const validateNotificationOptions = notificationOptions => {
  if (!notificationOptions.title) {
    throw new Error('title required');
  } else if (notificationOptions.title.length > 50 || typeof notificationOptions.title !== 'string') {
    throw new Error('invalid title');
  }
  if (!notificationOptions.summary) {
    throw new Error('summary required');
  } else if (notificationOptions.summary.length > 100 || typeof notificationOptions.summary !== 'string') {
    throw new Error('invalid summary');
  }
  if (!notificationOptions.body) {
    throw new Error('body required');
  } else if (typeof notificationOptions.body !== 'string') {
    throw new Error('invalid body');
  }
  if (notificationOptions.push !== null && notificationOptions.push !== undefined) {
    if (typeof notificationOptions.push !== 'boolean') {
      throw new Error('invalid push');
    }
  }
  if (notificationOptions.link) {
    if (!isValidHttpUrl(notificationOptions.link)) {
      throw new Error('link is not a valid url');
    }
  }
  if (notificationOptions.tags) {
    if (!Array.isArray(notificationOptions.tags)) {
      throw new Error('tags is not an array');
    } else {
      const checkArrayType = notificationOptions.tags.find(element => typeof element !== 'string');
      if (checkArrayType !== undefined) {
        throw new Error('invalid array element');
      }
    }
  }
  if (notificationOptions.groups) {
    if (!Array.isArray(notificationOptions.groups)) {
      throw new Error('groups is not an array');
    } else {
      const checkArrayType = notificationOptions.groups.find(element => typeof element !== 'string');
      if (checkArrayType !== undefined) {
        throw new Error('invalid array groups');
      }
    }
  }
};
exports.validateNotificationOptions = validateNotificationOptions;
const checkApiKeyAndProjectId = settings => {
  if (!settings.apiKey) {
    throw new Error('Api Key required');
  } else if (settings.apiKey.length !== 36 || typeof settings.apiKey !== 'string') {
    throw new Error('invalid api key');
  }
  if (!settings.projectId) {
    throw new Error('projectId required');
  } else if (settings.projectId.length > 20 || typeof settings.projectId !== 'string') {
    throw new Error('invalid projectId');
  }
};
exports.checkApiKeyAndProjectId = checkApiKeyAndProjectId;