import MemberProfilePage from "../../../components/profile/MemberProfilePage";

const Profile = () => {
  return (
    <MemberProfilePage
      roleLabel="Property Owner"
      fallbackName="Owner"
      backFrom="/owner-dashboard/profile"
      badgeClass="bg-emerald-50 text-emerald-700"
    />
  );
};

export default Profile;
