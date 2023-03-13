export const checkNotifications = (notification) => {
  if (!notification.title) {
    throw new Error("title required")
  } else if (notification.title.length > 50 || typeof notification.title != "string") {
    throw new Error("invalid title")
  }

  if (!notification.summary) {
    throw new Error("summary required")
  } else if (notification.summary.length > 100 || typeof notification.summary != "string") {
    throw new Error("invalid summary")
  }

  if (!notification.body) {
    throw new Error("body required")
  } else if (typeof notification.body != "string") {
    throw new Error("invalid body")
  }

  if (notification.push != null && notification.push != undefined) {
    if (typeof notification.push != "boolean") {
      throw new Error("invalid push")
    }
  }

  if (notification.link) {
    if (!isValidHttpUrl(notification.link)) {
      throw new Error("link is not a valid url")
    }
  }

  if (notification.tags) {
    if (!Array.isArray(notification.tags)) {
      throw new Error("tags is not an array")
    } else {
      const checkArrayType = notification.tags.find((element) => typeof element != "string")
      if (checkArrayType != undefined) {
        throw new Error("invalid array element")
      }
    }
  }

  if (notification.groups) {
    if (!Array.isArray(notification.groups)) {
      throw new Error("groups is not an array")
    } else {
      const checkArrayType = notification.groups.find((element) => typeof element != "string")
      if (checkArrayType != undefined) {
        throw new Error("invalid array groups")
      }
    }
  }

  if (notification.externalChannels) {
    if (!Array.isArray(notification.externalChannels)) {
      throw new Error("externalChannels is not an array")
    } else {
      const checkArrayType = notification.externalChannels.find((element) => typeof element != "string")
      if (checkArrayType != undefined) {
        throw new Error("invalid array externalChannels")
      }
    }
  }

  if (notification.icon) {
    if (typeof notification.icon != "string") {
      throw new Error("invalid icon")
    }
  }

  if (notification.properties) {
    if (typeof notification.properties != "object") {
      throw new Error("invalid properties type")
    }
  }
}

export const checkSettings = (settings) => {
  if (!settings.apiKey) {
    throw new Error("Api Key required")
  } else if (settings.apiKey.length != 36 || typeof settings.apiKey != "string") {
    throw new Error("invalid api key")
  }

  if (!settings.projectId) {
    throw new Error("projectId required")
  } else if (settings.projectId.length > 20 || typeof settings.projectId != "string") {
    throw new Error("invalid projectId")
  }
}

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export const checkOptions = (options) => {
  if (options.hostname && typeof options.hostname != "string") {
    throw new Error("invalid hostname type")
  }
  if (options.path && typeof options.path != "string") {
    throw new Error("invalid path type")
  }
  if (options.method && typeof options.method != "string") {
    throw new Error("invalid method type")
  }
}