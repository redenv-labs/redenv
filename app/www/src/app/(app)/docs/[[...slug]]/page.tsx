import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { DocsTOC } from "@/components/docs/DocsTOC";
import { REDENV_GITHUB_URL } from "@/consts";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

function getAdjacentPages(slug: string[] | undefined) {
  // Walk the page tree to get pages in sidebar order
  const tree = source.getPageTree();
  const ordered: { title: string; url: string }[] = [];

  function walk(nodes: typeof tree.children) {
    for (const node of nodes) {
      if (node.type === "page") {
        ordered.push({ title: node.name as string, url: node.url });
      } else if (node.type === "folder") {
        walk(node.children);
      }
    }
  }
  walk(tree.children);

  const currentUrl = slug ? `/docs/${slug.join("/")}` : "/docs";
  const index = ordered.findIndex((p) => p.url === currentUrl);
  if (index === -1) return { prev: undefined, next: undefined };
  const prev = index > 0 ? ordered[index - 1] : undefined;
  const next = index < ordered.length - 1 ? ordered[index + 1] : undefined;
  return { prev, next };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const page = source.getPage(resolvedParams.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  // Build breadcrumbs from slug
  const breadcrumbs = (resolvedParams.slug || []).map(
    (segment, index, arr) => ({
      label:
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href:
        index < arr.length - 1
          ? `/docs/${arr.slice(0, index + 1).join("/")}`
          : undefined,
    }),
  );

  // Build edit URL
  const editUrl = `${REDENV_GITHUB_URL}/edit/main/app/www/content/docs/${resolvedParams.slug?.join("/") || "index"}.mdx`;

  const { prev, next } = getAdjacentPages(resolvedParams.slug);

  return (
    <div className="flex gap-8 px-6 py-10">
      <DocsContent
        title={page.data.title}
        description={page.data.description}
        breadcrumbs={breadcrumbs}
        editUrl={editUrl}
        prev={prev}
        next={next}
      >
        <MDX components={getMDXComponents()} />
      </DocsContent>

      <DocsTOC toc={page.data.toc} />
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const page = source.getPage(resolvedParams.slug);
  if (!page) notFound();

  return {
    title: `${page.data.title} - Redenv Docs`,
    description: page.data.description,
  };
}
