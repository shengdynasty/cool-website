import type { Metadata } from "next";
import { routeMetadata } from "@/content/seo";
import { ListPage } from "@/components/sheng/ListPage";
import { Subpage } from "@/components/sheng/Subpage";
import { currentEngagements, engagementCategories, engagements, getEngagement } from "@/content/engagement";
import { engagementItem } from "@/content/listing";

export const metadata: Metadata = routeMetadata("engagement");

export default function EngagementPage() {
  const featured = currentEngagements.flatMap(({ id, label }) => {
    const engagement = getEngagement(id);
    return engagement ? [{ item: engagementItem(engagement), label }] : [];
  });
  return (
    <Subpage active="/engagement">
      <ListPage
        title="Engagement"
        lede="Eight activities, from MailZoo to NASA, written up in full."
        featuredTitle="Right now."
        featured={featured}
        everyTitle="Every activity"
        categories={engagementCategories}
        items={engagements.map(engagementItem)}
        gridId="engagement-grid"
      />
    </Subpage>
  );
}
