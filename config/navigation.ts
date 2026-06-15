import {
  MessageSquare,
  FileText,
  Briefcase,
  Map,
  Settings,
  Search,
  FileSignature,
} from "lucide-react";

export const navigation = [
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Resume Review",
    href: "/resume-review",
    icon: FileText,
  },
  {
    title: "Mock Interview",
    href: "/mock-interview",
    icon: Briefcase,
  },
  {
    title: "Job Matcher",
    href: "/job-match",
    icon: Search,
  },
  {
    title: "Cover Letter",
    href: "/cover-letter",
    icon: FileSignature,
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    icon: Map,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
