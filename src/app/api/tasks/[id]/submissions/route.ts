import { uploadTaskProof } from "@/lib/task-submission-upload";

export function POST(request: Request, { params }: { params: { id: string } }) {
  return uploadTaskProof(request, params.id, "submit");
}
