import { User } from "@/types";
import PointsCard from "./points-card";
import UserInfoCard from "./user-info-card";
import ContactCard from "./contact-card";

interface ProfileSidebarProps {
  user: User;
  isSubmitting?: boolean;
  isEditing?: boolean;
  onEditToggle?: () => void;
}

const ProfileSidebar = ({
  user,
  isSubmitting,
  isEditing,
  onEditToggle,
}: ProfileSidebarProps) => {
  return (
    <aside className="space-y-6 sticky top-24">
      <PointsCard points={user.points || user.pointsBalance || 0} />
      <UserInfoCard user={user} />
      <ContactCard
        user={user}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
        onEditToggle={onEditToggle}
      />
    </aside>
  );
};

export default ProfileSidebar;
