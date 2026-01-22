import { PersonDetailView } from "@/components/people/person-detail-view";

export default function PersonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <PersonDetailView personId={params.id} />;
}
