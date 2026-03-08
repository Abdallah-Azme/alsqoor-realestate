"use client";

import { RequestList } from "@/features/requests/components/request-list";

const MyRequestsTab = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <RequestList />
    </div>
  );
};

export default MyRequestsTab;
