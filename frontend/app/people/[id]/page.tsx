import { PersonDetailView } from "@/components/people/person-detail-view";

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PersonDetailView personId={id} />;
}
