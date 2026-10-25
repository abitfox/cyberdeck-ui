"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* Side navigation for the showcase: fixed on desktop, horizontal scroll on mobile */

const GROUPS: Array<{ label: string; items: Array<{ href: string; label: string }> }> = [
  {
    label: "OVERVIEW",
    items: [
      { href: "/", label: "Home" },
      { href: "/workstation", label: "Workstation" },
      { href: "/components/theme", label: "Theme & Colors" },
    ],
  },
  {
    label: "TYPOGRAPHY",
    items: [{ href: "/components/scramble-text", label: "ScrambleText" }],
  },
  {
    label: "PANELS",
    items: [
      { href: "/components/panel-frame", label: "PanelFrame" },
      { href: "/components/datastream-panel", label: "DataStreamPanel" },
      { href: "/components/modal", label: "Modal" },
    ],
  },
  {
    label: "WIDGETS",
    items: [
      { href: "/components/widgets-status", label: "Status Widgets" },
      { href: "/components/widgets-telemetry", label: "Telemetry Widgets" },
    ],
  },
  {
    label: "EFFECTS",
    items: [
      { href: "/components/boot-overlay", label: "BootOverlay" },
      { href: "/components/globe", label: "Globe" },
    ],
  },
  {
    label: "INPUT",
    items: [
      { href: "/components/keyboard", label: "Keyboard" },
      { href: "/components/virtual-keyboard", label: "VirtualKeyboard" },
      { href: "/components/hairline-input", label: "HairlineInput" },
    ],
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="z-20 border-[var(--edex-line)] bg-[rgba(5,9,11,0.85)] backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:w-52 lg:overflow-y-auto lg:border-r">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:block lg:px-5 lg:py-5">
        <Link href="/" className="edex-glow text-sm tracking-[0.3em] text-[var(--edex-fg-bright)]">
          CYBERDECK
        </Link>
        <Link
          href="https://github.com/abitfox/cyberdeck-ui"
          target="_blank"
          className="hidden text-[9px] tracking-[0.25em] text-[var(--edex-fg-dim)] transition hover:text-[var(--edex-acc)] lg:block"
        >
          ★ GITHUB
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 lg:block lg:px-0 lg:pb-0">
        {GROUPS.map((group) => (
          <div key={group.label} className="flex-none lg:mb-5 lg:w-full">
            <div className="hidden whitespace-nowrap px-5 pb-1.5 text-[9px] tracking-[0.3em] text-[var(--text-faint)] lg:block">
              {group.label}
            </div>
            <div className="flex gap-3 lg:block">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block flex-none whitespace-nowrap border-b px-1 pb-2 pt-0 text-[11px] tracking-wider transition lg:w-full lg:border-b-0 lg:border-l-2 lg:px-5 lg:py-1.5 ${
                      active
                        ? "border-[var(--edex-acc)] text-[var(--edex-acc)] lg:border-l-[var(--edex-acc)]"
                        : "border-transparent text-[var(--edex-fg-dim)] hover:text-[var(--edex-fg-bright)] lg:border-l-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
