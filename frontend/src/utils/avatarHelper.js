const DEFAULT_AVATAR_PATH =
  (import.meta.env.BASE_URL
    ? import.meta.env.BASE_URL.replace(/\/$/, "")
    : "") + "/default-profile.png";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";

const resolveAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== "string" || avatar.trim() === "") {
    return DEFAULT_AVATAR_PATH;
  }

  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }

  if (avatar.startsWith("/storage/")) {
    return `${API_BASE_URL}${avatar}`;
  }

  if (avatar.startsWith("storage/")) {
    return `${API_BASE_URL}/${avatar}`;
  }

  if (avatar.startsWith("/")) {
    return `${API_BASE_URL}${avatar}`;
  }

  return `${API_BASE_URL}/storage/${avatar.replace(/^\/+/, "")}`;
};

const getAvatarUrl = (source) => {
  if (!source) return DEFAULT_AVATAR_PATH;
  const avatar = source.avatar || source.profile_image || null;
  return resolveAvatarUrl(avatar);
};

export { DEFAULT_AVATAR_PATH, getAvatarUrl, resolveAvatarUrl };
