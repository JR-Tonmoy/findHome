const NOTIFICATION_STORAGE_KEY = "adminNotifications";

const readJSON = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const dispatchNotificationsUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("admin-notifications-updated"));
  }
};

const createNotificationId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `notification-${crypto.randomUUID()}`;
  }

  return `notification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const normalizeNotification = (notification = {}) => ({
  id: notification.id || createNotificationId(),
  type: notification.type || "general",
  title: notification.title || "Notification",
  message: notification.message || "",
  meta: notification.meta || {},
  createdAt: notification.createdAt || new Date().toISOString(),
});

const getAdminNotifications = () =>
  readJSON(NOTIFICATION_STORAGE_KEY, [])
    .map((notification) => normalizeNotification(notification))
    .sort(
      (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
    );

const setAdminNotifications = (notifications) => {
  writeJSON(NOTIFICATION_STORAGE_KEY, notifications);
  dispatchNotificationsUpdated();
};

const addAdminNotification = (notification) => {
  const nextNotification = normalizeNotification(notification);
  const currentNotifications = getAdminNotifications();
  const duplicateIndex = currentNotifications.findIndex(
    (item) => item.id === nextNotification.id,
  );

  const updatedNotifications =
    duplicateIndex >= 0
      ? currentNotifications.map((item, index) =>
          index === duplicateIndex ? nextNotification : item,
        )
      : [nextNotification, ...currentNotifications];

  setAdminNotifications(updatedNotifications.slice(0, 100));

  return nextNotification;
};

const seedAdminNotifications = (notifications = []) => {
  const seededNotifications = notifications
    .map((notification) => normalizeNotification(notification))
    .filter(Boolean);

  const currentNotifications = getAdminNotifications();
  const mergedNotifications = [...seededNotifications, ...currentNotifications];
  const uniqueNotifications = mergedNotifications.filter(
    (notification, index, self) =>
      index === self.findIndex((item) => item.id === notification.id),
  );

  setAdminNotifications(uniqueNotifications.slice(0, 100));

  return getAdminNotifications();
};

export { addAdminNotification, getAdminNotifications, seedAdminNotifications };
