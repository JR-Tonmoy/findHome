import MemberProfilePage from "../../../components/profile/MemberProfilePage";

const OwnerProfile = () => {
  return (
    <MemberProfilePage
      roleLabel="Owner"
      fallbackName="Owner"
      backFrom="/owner-dashboard/profile"
      badgeClass="bg-emerald-50 text-emerald-700"
    />
  );
};

export default OwnerProfile;
