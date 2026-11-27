import { uploadTaskProof } from "@/lib/task-submission-upload";

export function PATCH(request: Request, { params }: { params: { id: string } }) {
  return uploadTaskProof(request, params.id, "resubmit");
}
