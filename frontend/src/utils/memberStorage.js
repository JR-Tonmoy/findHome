const readJSON = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";
const ADMIN_API_URL = API_BASE_URL ? `${API_BASE_URL}/api/v1/admin` : "";

const getAuthToken = () => {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
};

const requestJson = async (url, options = {}) => {
  if (!ADMIN_API_URL) {
    throw new Error("Admin API URL is not configured.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      payload?.message || `Request failed with status ${response.status}`,
    );
  }

  return payload;
};

const fetchAdminProfileFromBackend = async () => {
  if (!ADMIN_API_URL) return null;

  try {
    const response = await requestJson(`${ADMIN_API_URL}/profile`, {
      method: "GET",
    });
    return normalizeMemberRecord(response?.data || null);
  } catch (err) {
    // Backend not available or request failed - fall back to local
    return null;
  }
};

const updateAdminProfileToBackend = async (profile) => {
  if (!ADMIN_API_URL) return null;

  try {
    const response = await requestJson(`${ADMIN_API_URL}/profile`, {
      method: "PUT",
      body: JSON.stringify(profile),
    });

    return normalizeMemberRecord(response?.data || profile);
  } catch (err) {
    // If backend fails, silently return null so caller can fallback
    return null;
  }
};

const getMemberCollectionKey = (role) =>
  role === "owner" ? "registeredOwners" : "registeredUsers";

const getAdminProfileKey = () => "adminProfile";

const getStoredAuthUser = () => {
  const authUser = readJSON("user", null);

  if (authUser?.role === "admin") {
    return authUser;
  }

  const demoUser = readJSON("demoRegisteredUser", null);

  return demoUser?.role === "admin" ? demoUser : null;
};

const getDisplayName = (member) => member?.fullName || member?.name || "User";

const getUsername = (member) => {
  if (member?.username) return member.username;

  return `@${getDisplayName(member).trim().toLowerCase().replace(/\s+/g, "")}`;
};

const normalizeMemberRecord = (member = {}) => ({
  ...member,
  id: member.id || "",
  fullName: getDisplayName(member),
  name: getDisplayName(member),
  email: member.email || "N/A",
  phone: member.phone || "N/A",
  password: member.password || "",
  role: member.role || "tenant",
  username: getUsername(member),
  date: member.date || member.registeredDate || "N/A",
  avatar: member.avatar || "",
});

const getCurrentMemberProfile = () => {
  const storedUser = readJSON("demoRegisteredUser", {});
  const collectionKey = getMemberCollectionKey(storedUser.role);
  const collection = readJSON(collectionKey, []);
  const matchedRecord = collection.find(
    (member) => member.email === storedUser.email,
  );

  return normalizeMemberRecord({ ...storedUser, ...matchedRecord });
};

const syncCurrentMemberProfile = (updates = {}) => {
  const storedUser = readJSON("demoRegisteredUser", {});

  if (!storedUser.email) {
    return normalizeMemberRecord(updates);
  }

  const collectionKey = getMemberCollectionKey(storedUser.role);
  const collection = readJSON(collectionKey, []);
  const currentDate =
    storedUser.date ||
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const mergedProfile = normalizeMemberRecord({
    ...storedUser,
    ...updates,
    date: updates.date || storedUser.date || currentDate,
  });

  const updatedCollection = collection.some(
    (member) => member.email === storedUser.email,
  )
    ? collection.map((member) =>
        member.email === storedUser.email
          ? { ...member, ...mergedProfile }
          : member,
      )
    : [mergedProfile, ...collection];

  localStorage.setItem(collectionKey, JSON.stringify(updatedCollection));
  localStorage.setItem(
    "demoRegisteredUser",
    JSON.stringify({ ...storedUser, ...updates, date: mergedProfile.date }),
  );

  return mergedProfile;
};

const getAdminProfile = () => {
  const storedProfile = readJSON(getAdminProfileKey(), null);
  const authUser = getStoredAuthUser();

  if (storedProfile) {
    return normalizeMemberRecord(storedProfile);
  }

  return normalizeMemberRecord(
    authUser || {
      id: "",
      fullName: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "admin",
      date: "N/A",
      avatar: "",
    },
  );
};

const syncAdminProfile = (updates = {}) => {
  const currentProfile = getAdminProfile();
  const mergedProfile = normalizeMemberRecord({
    ...currentProfile,
    ...updates,
    role: "admin",
  });

  localStorage.setItem(getAdminProfileKey(), JSON.stringify(mergedProfile));

  const authUser = getStoredAuthUser();
  if (authUser?.role === "admin") {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...authUser,
        ...mergedProfile,
      }),
    );
  }

  // Try to persist to backend asynchronously when configured.
  if (ADMIN_API_URL) {
    (async () => {
      try {
        await updateAdminProfileToBackend(mergedProfile);
      } catch (e) {
        // ignore backend failures; local cache remains source of truth
      }
    })();
  }

  return mergedProfile;
};

export {
  fetchAdminProfileFromBackend,
  getAdminProfile,
  getCurrentMemberProfile,
  normalizeMemberRecord,
  syncAdminProfile,
  syncCurrentMemberProfile,
  updateAdminProfileToBackend,
};
