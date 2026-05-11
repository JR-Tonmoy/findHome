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
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { updateUserProfileSuccess } from "../../features/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import {
  getCurrentMemberProfile,
  syncCurrentMemberProfile,
} from "../../utils/memberStorage";
import {
  fetchUserProfile,
  updateUserPassword,
  updateUserProfile,
  uploadProfileImage,
} from "../../utils/userProfileService";

const inputBaseClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 disabled:text-gray-500";

const MemberProfilePage = ({
  roleLabel,
  fallbackName,
  backFrom,
  badgeClass,
}) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const dispatch = useDispatch();
  const { user } = useAuth();

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
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const backendProfile = await fetchUserProfile();
        if (!active || !backendProfile) return;

        const mergedProfile = {
          fullName:
            backendProfile.fullName || backendProfile.name || fallbackName,
          email: backendProfile.email || "N/A",
          phone: backendProfile.phone || "N/A",
          location: savedProfile.location || "Dhaka, Bangladesh",
          bio: savedProfile.bio || "Tell people a little about yourself.",
          joined: savedProfile.joined || "N/A",
          role: backendProfile.role || roleLabel,
          avatar: backendProfile.avatar || backendProfile.profile_image || "",
          password: "",
        };

        setSavedProfile(mergedProfile);
        setPhotoPreview(mergedProfile.avatar);
        setProfileForm((current) => ({
          ...current,
          fullName: mergedProfile.fullName,
          email: mergedProfile.email,
          phone: mergedProfile.phone,
        }));

        syncCurrentMemberProfile({
          fullName: mergedProfile.fullName,
          name: mergedProfile.fullName,
          email: mergedProfile.email,
          phone: mergedProfile.phone,
          avatar: mergedProfile.avatar,
        });

        dispatch(
          updateUserProfileSuccess({
            ...backendProfile,
            name: mergedProfile.fullName,
            fullName: mergedProfile.fullName,
            avatar: mergedProfile.avatar,
          }),
        );
      } catch {
        // keep local fallback profile
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [dispatch, fallbackName, roleLabel]);

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
        setSelectedImageFile(file);
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
    setSelectedImageFile(null);
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

  const handleSave = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      passwordForm.currentPassword ||
      passwordForm.newPassword ||
      passwordForm.confirmPassword
    ) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setErrorMessage("New passwords do not match.");
        return;
      }
    }

    setIsSaving(true);
    try {
      let uploadedProfile = null;

      if (selectedImageFile) {
        uploadedProfile = await uploadProfileImage(selectedImageFile, false);
      }

      const updatedProfile = await updateUserProfile({
        name: profileForm.fullName,
        email: profileForm.email,
        phone: profileForm.phone,
        avatar:
          uploadedProfile?.avatar ||
          uploadedProfile?.profile_image ||
          photoPreview,
        profile_image:
          uploadedProfile?.profile_image ||
          uploadedProfile?.avatar ||
          photoPreview,
      });

      if (passwordForm.newPassword) {
        await updateUserPassword(
          passwordForm.currentPassword,
          passwordForm.newPassword,
        );
      }

      const nextProfile = {
        fullName:
          updatedProfile?.fullName ||
          updatedProfile?.name ||
          profileForm.fullName,
        email: updatedProfile?.email || profileForm.email,
        phone: updatedProfile?.phone || profileForm.phone,
        location: profileForm.location,
        bio: profileForm.bio,
        joined: savedProfile.joined,
        role: updatedProfile?.role || roleLabel,
        avatar:
          updatedProfile?.avatar ||
          updatedProfile?.profile_image ||
          photoPreview ||
          "",
        password: "",
      };

      setSavedProfile(nextProfile);
      setPhotoPreview(nextProfile.avatar);
      setSelectedImageFile(null);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsEditing(false);

      syncCurrentMemberProfile({
        fullName: nextProfile.fullName,
        name: nextProfile.fullName,
        email: nextProfile.email,
        phone: nextProfile.phone,
        avatar: nextProfile.avatar,
        location: nextProfile.location,
        bio: nextProfile.bio,
      });

      dispatch(
        updateUserProfileSuccess({
          ...user,
          name: nextProfile.fullName,
          fullName: nextProfile.fullName,
          email: nextProfile.email,
          phone: nextProfile.phone,
          role: nextProfile.role,
          avatar: nextProfile.avatar,
          profile_image: nextProfile.avatar,
        }),
      );

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("profile-updated"));
      }

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(error?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:px-0 md:py-8 min-h-[calc(100vh-80px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account information
        </p>
      </div>

      {isLoading && (
        <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          Loading profile data...
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

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
                      disabled={!isEditing}
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
              disabled={!isEditing || isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Changes"}
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
