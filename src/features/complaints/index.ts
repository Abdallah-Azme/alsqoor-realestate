// Complaints feature exports
export { complaintsService } from "./services/complaints.service";
export { useComplaintTypes, useSubmitComplaint } from "./hooks/use-complaints";
export { complaintSchema } from "./schemas/complaint.schema";
export type { ComplaintFormData } from "./schemas/complaint.schema";
export type { Complaint, ComplaintType } from "./types/complaint.types";
