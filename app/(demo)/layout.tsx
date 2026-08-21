import { AppShell } from "@/components/layout/app-shell";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="demo-shell min-h-dvh">
      <AppShell>{children}</AppShell>
    </div>
  );
}
