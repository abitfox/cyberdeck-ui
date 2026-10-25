import type { ReactNode } from "react";
import { SideNav } from "@/components/showcase/SideNav";

/* Shared layout for all /components/* demo pages: SideNav + scrollable content column */

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="booted relative z-10 flex h-dvh-safe min-h-0 flex-col">
      <SideNav />
      <main className="min-h-0 flex-1 overflow-y-auto lg:pl-52">{children}</main>
    </div>
  );
}
