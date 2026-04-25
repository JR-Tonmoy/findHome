import {
  CalendarDays,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Save,
  Upload,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getCurrentMemberProfile,
  syncCurrentMemberProfile,
} from "../../utils/memberStorage";

const inputBaseClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 disabled:text-gray-500";

const MemberProfilePage = ({
  roleLabel,
  fallbackName,
  backFrom,
  badgeClass,
}) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const initialProfile = useMemo(() => {
    const stored = getCurrentMemberProfile();

    return {
      fullName: stored.fullName || fallbackName,
      email: stored.email || "N/A",
      phone: stored.phone || "N/A",
      location: stored.location || "Dhaka, Bangladesh",
      bio: stored.bio || "Tell people a little about yourself.",
      joined: stored.date || "N/A",
      role: roleLabel,
      avatar: stored.avatar || "",
      password: stored.password || "",
    };
  }, [fallbackName, roleLabel]);

  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [photoPreview, setPhotoPreview] = useState(initialProfile.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: initialProfile.fullName,
    email: initialProfile.email,
    phone: initialProfile.phone,
    location: initialProfile.location,
    bio: initialProfile.bio,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: backFrom }} />;
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPhotoPreview(result);
        setSavedProfile((current) => ({
          ...current,
          avatar: result,
        }));
        syncCurrentMemberProfile({ avatar: result });
        const currentEmail =
          profileForm.email || savedProfile.email || initialProfile.email;
        localStorage.setItem(`profilePhoto:${currentEmail}`, result);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetDraft = () => {
    setProfileForm({
      fullName: savedProfile.fullName,
      email: savedProfile.email,
      phone: savedProfile.phone,
      location: savedProfile.location,
      bio: savedProfile.bio,
    });
    setPhotoPreview(savedProfile.avatar);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleCancel = () => {
    resetDraft();
    setIsEditing(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    const storedProfile = JSON.parse(
      localStorage.getItem("demoRegisteredUser") || "{}",
    );

    if (
      passwordForm.currentPassword ||
      passwordForm.newPassword ||
      passwordForm.confirmPassword
    ) {
      if (
        storedProfile.password &&
        passwordForm.currentPassword !== storedProfile.password
      ) {
        alert("Current password is incorrect.");
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert("New passwords do not match.");
        return;
      }
    }

    const updatedProfile = syncCurrentMemberProfile({
      ...profileForm,
      avatar: photoPreview,
      ...(passwordForm.newPassword
        ? { password: passwordForm.newPassword }
        : {}),
    });

    const nextProfile = {
      fullName: updatedProfile.fullName,
      email: updatedProfile.email,
      phone: updatedProfile.phone,
      location: profileForm.location,
      bio: profileForm.bio,
      joined: updatedProfile.date,
      role: roleLabel,
      avatar: updatedProfile.avatar,
      password: updatedProfile.password || storedProfile.password || "",
    };

    setSavedProfile(nextProfile);
    setProfileForm({
      fullName: nextProfile.fullName,
      email: nextProfile.email,
      phone: nextProfile.phone,
      location: nextProfile.location,
      bio: nextProfile.bio,
    });
    setPhotoPreview(nextProfile.avatar);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    localStorage.setItem(
      `profilePhoto:${nextProfile.email}`,
      nextProfile.avatar,
    );
    setIsEditing(false);
    alert("Profile updated successfully.");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:px-0 md:py-8 min-h-[calc(100vh-80px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account information
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="h-2 bg-indigo-600" />
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="relative w-fit">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#5b5ce2] text-white shadow-[0_16px_32px_rgba(91,92,226,0.28)]">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={48} />
                    )}
                  </div>
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity hover:opacity-100">
                    <Upload size={18} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                      {savedProfile.fullName}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                    >
                      {savedProfile.role}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                    <div className="flex items-center gap-2.5">
                      <Mail size={16} className="text-gray-400" />
                      <span className="truncate">{savedProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={16} className="text-gray-400" />
                      <span>{savedProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{savedProfile.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CalendarDays size={16} className="text-gray-400" />
                      <span>Joined {savedProfile.joined}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-gray-100 bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Account Information
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Update the details visible across user, owner and admin views.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <span
                className={`h-2.5 w-2.5 rounded-full ${isEditing ? "bg-emerald-500" : "bg-gray-300"}`}
              />
              {isEditing ? "Editing enabled" : "Read only"}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="fullName"
                value={profileForm.fullName}
                onChange={handleFieldChange}
                disabled={!isEditing}
                className={inputBaseClass}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={profileForm.email}
                onChange={handleFieldChange}
                disabled={!isEditing}
                className={inputBaseClass}
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                name="phone"
                value={profileForm.phone}
                onChange={handleFieldChange}
                disabled={!isEditing}
                className={inputBaseClass}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                name="location"
                value={profileForm.location}
                onChange={handleFieldChange}
                disabled={!isEditing}
                className={inputBaseClass}
                placeholder="Enter your location"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                rows={5}
                value={profileForm.bio}
                onChange={handleFieldChange}
                disabled={!isEditing}
                className={`${inputBaseClass} resize-none`}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-gray-100 bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h3 className="text-xl font-semibold text-gray-900">
            Change Password
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Use your current password to set a new one.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                disabled={!isEditing}
                className={inputBaseClass}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                disabled={!isEditing}
                className={inputBaseClass}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                disabled={!isEditing}
                className={inputBaseClass}
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!isEditing}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Save size={16} />
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default MemberProfilePage;
