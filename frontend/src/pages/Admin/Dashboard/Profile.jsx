import {
  Camera,
  Edit3,
  Eye,
  EyeOff,
  Mail,
  Save,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { updateUserProfileSuccess } from "../../../features/auth/authSlice";
import {
  fetchAdminProfile,
  updateAdminProfile,
  updateUserPassword,
  uploadProfileImage,
} from "../../../utils/userProfileService";

const inputBaseClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-gray-50 disabled:text-gray-500";

const AdminProfile = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [savedProfile, setSavedProfile] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    avatar: null,
    role: "admin",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const displayName = savedProfile.name || "Admin";
  const displayEmail = savedProfile.email || "No email set";

  // Load admin profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profile = await fetchAdminProfile();
        if (profile) {
          setSavedProfile({
            id: profile.id,
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            avatar: profile.avatar || profile.profile_image || null,
            role: profile.role || "admin",
          });
          setPhotoPreview(profile.avatar || profile.profile_image || null);
          setProfileForm({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
          });

          dispatch(
            updateUserProfileSuccess({
              ...profile,
              avatar: profile.avatar || profile.profile_image || "",
            }),
          );
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError(
          "Failed to load profile data. Please try refreshing the page.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadProfile();
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: "/admin/profile" }} />;
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

  const handleCancel = () => {
    setProfileForm({
      name: savedProfile.name,
      email: savedProfile.email,
      phone: savedProfile.phone,
    });
    setPhotoPreview(savedProfile.avatar);
    setSelectedImageFile(null);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setIsEditing(false);
    setSuccessMessage("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage("");

    // Validate password change if provided
    if (passwordForm.newPassword) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError("New passwords do not match");
        return;
      }
      if (!passwordForm.currentPassword) {
        setError("Please enter your current password to set a new one");
        return;
      }
      if (passwordForm.newPassword.length < 8) {
        setError("New password must be at least 8 characters long");
        return;
      }
    }

    setIsSaving(true);
    try {
      let uploadedImageProfile = null;

      if (selectedImageFile) {
        uploadedImageProfile = await uploadProfileImage(
          selectedImageFile,
          true,
        );
      }

      // Update profile information
      const updatedProfile = await updateAdminProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        avatar:
          uploadedImageProfile?.avatar ||
          uploadedImageProfile?.profile_image ||
          photoPreview,
        profile_image:
          uploadedImageProfile?.profile_image ||
          uploadedImageProfile?.avatar ||
          photoPreview,
      });

      if (updatedProfile) {
        const mergedProfile = {
          ...updatedProfile,
          avatar: updatedProfile.avatar || updatedProfile.profile_image || "",
        };
        setSavedProfile(mergedProfile);
        setPhotoPreview(mergedProfile.avatar);
        setSelectedImageFile(null);

        localStorage.setItem("adminProfile", JSON.stringify(mergedProfile));
        dispatch(updateUserProfileSuccess(mergedProfile));

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("profile-updated"));
        }
      }

      // Update password if provided
      if (passwordForm.newPassword) {
        await updateUserPassword(
          passwordForm.currentPassword,
          passwordForm.newPassword,
        );
      }

      setSuccessMessage(
        "Profile updated successfully" +
          (passwordForm.newPassword ? " and password changed" : ""),
      );
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsEditing(false);
      setShowPassword(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError(err.message || "Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-0 md:py-8 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-0 md:py-8 min-h-[calc(100vh-80px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update the admin identity shown in the sidebar and dashboard.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Header */}
        <section className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div
            className="h-2"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #7c3aed 0%, #4f46e5 55%, #06b6d4 100%)",
            }}
          />
          <div className="p-6 md:p-8 flex flex-col items-center text-center gap-5">
            <div className="flex flex-col items-center gap-4">
              {/* Avatar */}
              <div className="relative w-fit">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#4338ca] text-white shadow-[0_16px_32px_rgba(67,56,202,0.28)]">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={48} />
                  )}
                </div>
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity hover:opacity-100">
                  <Camera size={18} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={!isEditing}
                  />
                </label>
              </div>

              {/* Info */}
              <div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                    {displayName}
                  </h2>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    {savedProfile.role}
                  </span>
                </div>
                <p className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  {displayEmail}
                </p>
                {savedProfile.phone && (
                  <p className="mt-1 text-sm text-gray-600">
                    📱 {savedProfile.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>
        </section>

        {/* Account Information */}
        <section className="rounded-[28px] border border-gray-100 bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h3 className="text-xl font-semibold text-gray-900">
            Account Information
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Admin can update the visible identity and login email here.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="name"
                value={profileForm.name}
                onChange={handleFieldChange}
                disabled={!isEditing}
                className={inputBaseClass}
                placeholder="Enter full name"
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
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                value={profileForm.phone}
                onChange={handleFieldChange}
                disabled={!isEditing}
                className={inputBaseClass}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </section>

        {/* Password Section - Only show when editing */}
        {isEditing && (
          <section className="rounded-[28px] border border-gray-100 bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <h3 className="text-xl font-semibold text-gray-900">
              Change Password
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Leave empty to keep your current password.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className={inputBaseClass}
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={`${inputBaseClass} pr-12`}
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className={inputBaseClass}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </section>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
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
            disabled={!isEditing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
