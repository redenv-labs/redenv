import { Navbar } from "@/components/Navbar";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
