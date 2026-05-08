import {
  Camera,
  Edit3,
  Eye,
  EyeOff,
  Mail,
  Save,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getAdminProfile,
  syncAdminProfile,
} from "../../../utils/memberStorage";

const inputBaseClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-gray-50 disabled:text-gray-500";

const AdminProfile = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const initialProfile = useMemo(() => {
    const stored = getAdminProfile();

    return {
      fullName: stored.fullName || "",
      email: stored.email || "",
      password: stored.password || "",
      avatar: stored.avatar || "",
    };
  }, []);

  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [photoPreview, setPhotoPreview] = useState(initialProfile.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: initialProfile.fullName,
    email: initialProfile.email,
    password: initialProfile.password,
  });

  const displayName = savedProfile.fullName || "Admin";
  const displayEmail = savedProfile.email || "No email set";

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
        syncAdminProfile({ avatar: result });
        localStorage.setItem("adminProfilePhoto", result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setProfileForm({
      fullName: savedProfile.fullName,
      email: savedProfile.email,
      password: savedProfile.password,
    });
    setPhotoPreview(savedProfile.avatar);
    setShowPassword(false);
    setIsEditing(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    const updatedProfile = syncAdminProfile({
      fullName: profileForm.fullName,
      email: profileForm.email,
      password: profileForm.password,
      avatar: photoPreview,
    });

    const nextProfile = {
      fullName: updatedProfile.fullName,
      email: updatedProfile.email,
      password: updatedProfile.password,
      avatar: updatedProfile.avatar,
    };

    setSavedProfile(nextProfile);
    setProfileForm({
      fullName: nextProfile.fullName,
      email: nextProfile.email,
      password: nextProfile.password,
    });
    setPhotoPreview(nextProfile.avatar);
    localStorage.setItem("adminProfilePhoto", nextProfile.avatar);
    setShowPassword(false);
    setIsEditing(false);
    alert("Admin profile updated successfully.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-0 md:py-8 min-h-[calc(100vh-80px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update the admin identity shown in the sidebar and dashboard.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div
            className="h-2"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #7c3aed 0%, #4f46e5 55%, #06b6d4 100%)",
            }}
          />
          <div className="p-6 md:p-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative w-fit">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#4338ca] text-white shadow-[0_16px_32px_rgba(67,56,202,0.28)]">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Admin"
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
                  />
                </label>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                    {displayName}
                  </h2>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    Admin
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  {displayEmail}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>
        </section>

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
                name="fullName"
                value={profileForm.fullName}
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

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={profileForm.password}
                  onChange={handleFieldChange}
                  disabled={!isEditing}
                  className={`${inputBaseClass} pr-12`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={!isEditing}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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

export default AdminProfile;
