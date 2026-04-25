const readJSON = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const getMemberCollectionKey = (role) =>
  role === "owner" ? "registeredOwners" : "registeredUsers";

const getAdminProfileKey = () => "adminProfile";

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

  return normalizeMemberRecord(
    storedProfile || {
      id: "#admin",
      fullName: "Tanim Hasan",
      name: "Tanim Hasan",
      email: "admin@findhome.com",
      phone: "+880 1712-345678",
      password: "admin123",
      role: "admin",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
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

  return mergedProfile;
};

export {
  getAdminProfile,
  getCurrentMemberProfile,
  normalizeMemberRecord,
  syncAdminProfile,
  syncCurrentMemberProfile,
};
