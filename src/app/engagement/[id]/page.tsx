import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Callout, Heading, Paragraphs } from "@/components/sheng/Article";
import { DetailPage } from "@/components/sheng/DetailPage";
import { Subpage } from "@/components/sheng/Subpage";
import { engagements, getEngagement } from "@/content/engagement";
import { routeMetadata } from "@/content/seo";
import { engagementItem, nextAfter } from "@/content/listing";

export const dynamicParams = false;

export function generateStaticParams() {
  return engagements.map((engagement) => ({ id: engagement.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const engagement = getEngagement(id);
  return engagement ? routeMetadata(`engagement/${id}`, { title: engagement.title, description: engagement.summary }) : {};
}

export default async function EngagementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const engagement = getEngagement(id);
  if (!engagement) notFound();
  const index = engagements.indexOf(engagement);

  return (
    <Subpage active="/engagement">
      <DetailPage
        back={{ href: "/engagement", label: "/engagement", aria: "Back to engagement" }}
        meta={[engagement.category, engagement.period]}
        title={engagement.title}
        lede={`${engagement.role}. ${engagement.commitment}.`}
        cover={engagement.cover}
        contact={{
          heading: "Want to hear more about this? Send me a note.",
          links: [
            { label: "Send me a note", href: "/#contact", primary: true },
            { label: "All engagement", href: "/engagement" },
          ],
          note: "I read every note and reply within a few days.",
        }}
        related={nextAfter(engagements, index).map(engagementItem)}
      >
        <Callout>{engagement.summary}</Callout>
        <dl className="facts">
          <div>
            <dt>Role</dt>
            <dd>{engagement.role}</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>{engagement.period}</dd>
          </div>
          <div>
            <dt>Commitment</dt>
            <dd>{engagement.commitment}</dd>
          </div>
        </dl>
        <Heading>The work</Heading>
        <Paragraphs items={engagement.work} />
        <Heading>What I learned</Heading>
        <Paragraphs items={engagement.learned} />
        <Heading>Why it matters</Heading>
        <Paragraphs items={engagement.relevance} />
      </DetailPage>
    </Subpage>
  );
}
