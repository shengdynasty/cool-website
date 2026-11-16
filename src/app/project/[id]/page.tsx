import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Callout, CodeBlock, Figure, Heading, LinkList, Paragraphs, RowList, type LinkRow } from "@/components/sheng/Article";
import { DetailPage } from "@/components/sheng/DetailPage";
import { Subpage } from "@/components/sheng/Subpage";
import { nextAfter, projectItem, shortTitle } from "@/content/listing";
import { projectVideos } from "@/content/media";
import { getProject, projects } from "@/content/projects";
import { routeMetadata } from "@/content/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  return project ? routeMetadata(`project/${id}`, { title: project.title, description: project.excerpt }) : {};
}

const listJoin = (items: readonly string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const index = projects.indexOf(project);

  const links: LinkRow[] = [
    { title: "Code on GitHub", note: project.github.replace(/^https:\/\//, ""), href: project.github, external: true },
  ];
  if (project.live) links.push({ title: "Live demo", note: project.live.replace(/^https:\/\//, ""), href: project.live, external: true });
  if (project.reportUrl) {
    links.push({ title: "Project report", note: "The full write-up: design, experiments, and results.", href: project.reportUrl, external: true });
  }

  return (
    <Subpage active="/projects">
      <DetailPage
        back={{ href: "/projects", label: "/projects", aria: "Back to projects" }}
        meta={[project.category, project.technologies.slice(0, 3).join(" · ")]}
        title={project.title}
        lede={project.description}
        cover={project.cover}
        contact={{
          heading: `Questions about ${shortTitle(project.title)}? Send me a note.`,
          links: [
            { label: "Send me a note", href: "/#contact", primary: true },
            { label: "View the code", href: project.github, external: true },
          ],
          note: "I read every note and reply within a few days.",
        }}
        related={nextAfter(projects, index).map(projectItem)}
      >
        <Callout>Built with {listJoin(project.technologies)}. The code is on GitHub.</Callout>
        <Paragraphs items={project.paragraphs} />
        <LinkList links={links} />
        {project.features.length ? (
          <>
            <Heading>What it does</Heading>
            <RowList items={project.features} />
          </>
        ) : null}
        {project.diagrams.length ? (
          <>
            <Heading>How it works</Heading>
            {project.diagrams.map((diagram) => (
              <Figure key={diagram.src} {...diagram} />
            ))}
          </>
        ) : null}
        {projectVideos[project.id] ? (
          <>
            <Heading>Demo</Heading>
            <figure>
              <video className="demo-video" controls playsInline preload="metadata" src={projectVideos[project.id].src} />
              <figcaption>{projectVideos[project.id].caption}</figcaption>
            </figure>
          </>
        ) : null}
        {project.code ? (
          <>
            <Heading>From the code</Heading>
            <CodeBlock id={`code-${project.id}`} label={project.code.language} source={project.code.source} />
          </>
        ) : null}
      </DetailPage>
    </Subpage>
  );
}
