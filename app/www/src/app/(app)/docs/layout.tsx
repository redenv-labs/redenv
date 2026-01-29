import { source } from "@/lib/source";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = source.getPageTree();

  return (
    <div className="relative flex max-w-screen-2xl mx-auto">
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] border-r border-border/30">
        <DocsSidebar tree={tree} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
