import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Library,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** When true, only highlight on an exact path match (used for the home route). */
  exact?: boolean;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/questionnaires", label: "Questionnaires", icon: ClipboardList },
  { href: "/controls", label: "Control Library", icon: Library },
  { href: "/brief", label: "Executive Brief", icon: FileText },
];
