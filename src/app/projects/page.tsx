import type { Metadata } from "next";
import { routeMetadata } from "@/content/seo";
import { ListPage } from "@/components/sheng/ListPage";
import { Subpage } from "@/components/sheng/Subpage";
import { projectItem } from "@/content/listing";
import { featuredProjectIds, getProject, projectCategories, projects } from "@/content/projects";

export const metadata: Metadata = routeMetadata("projects");

export default function ProjectsPage() {
  const featured = featuredProjectIds.flatMap((id) => {
    const project = getProject(id);
    return project ? [{ item: projectItem(project), label: project.category }] : [];
  });
  return (
    <Subpage active="/projects">
      <ListPage
        title="Projects"
        lede="Thirteen projects, written up in full, with the code on GitHub."
        featuredTitle="Start with these three."
        featured={featured}
        everyTitle="Every project"
        categories={projectCategories}
        items={projects.map(projectItem)}
        gridId="project-grid"
      />
    </Subpage>
  );
}
