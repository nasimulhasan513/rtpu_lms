import type { NavMenuItems } from "~/types/nav";

export const navMenu: NavMenuItems = [
  {
    title: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    link: "/admin",
    role: "contributor",
  },
  {
    title: "Courses",
    icon: "lucide:graduation-cap",
    role: "contributor",
    children: [
      {
        title: "All Courses",
        link: "/admin/courses",
        icon: "lucide:list-video",
        role: "contributor",
      },
      {
        title: "Add Course",
        link: "/admin/courses/create",
        icon: "lucide:plus-circle",
        role: "admin",
      },
      {
        title: "Categories",
        link: "/admin/courses/categories",
        icon: "lucide:layers",
        role: "admin",
      },
      {
        title: "Teachers",
        link: "/admin/courses/teachers",
        icon: "game-icons:teacher",
        role: "admin",
      },
    ],
  },

  {
    title: "Notifications",
    icon: "lucide:bell",
    link: "/admin/notifications",
    role: "contributor",
  },
  {
    title: "Exams",
    icon: "i-lucide-clipboard-list",
    role: "contributor",
    children: [
      {
        title: "All Exams",
        link: "/admin/exams",
        icon: "i-lucide-clipboard-list",
        role: "contributor",
      },
      {
        title: "Add Exam",
        link: "/admin/exams/create",
        icon: "lucide:plus-circle",
        role: "contributor",
      },
    ],
  },
  {
    title: "Assignments",
    icon: "i-lucide-file-text",
    children: [
      {
        title: "All Assignments",
        link: "/admin/assignments",
        icon: "lucide:clipboard-list",
        role: "contributor",
      },
      {
        title: "Add Assignment",
        link: "/admin/assignments/create",
        icon: "lucide:plus-circle",
        role: "contributor",
      },
      {
        title: "Submissions",
        link: "/admin/assignments/submissions",
        icon: "lucide:inbox",
        role: "contributor",
      },
    ],
  },

  {
    title: "Subjects",
    icon: "i-lucide-book-open",
    link: "/admin/subjects",
    role: "admin",
  },
  {
    title: "Contributors",
    icon: "i-lucide-users",
    link: "/admin/users/contributors",
    role: "admin",
  },
  {
    title: "Students",
    icon: "i-lucide-users",
    link: "/admin/users",
    role: "admin",
  },
];

const additionalMenu = [
  {
    title: "Live Classes",
    icon: "i-lucide-tv",
    link: "/admin/live-classes",
  },
  {
    title: "Badges & Achievements",
    icon: "lucide:award",
    link: "/admin/badges",
  },
  {
    title: "Questions",
    icon: "i-lucide-file-question",
    link: "/admin/questions",
  },
  {
    title: "Sales",
    icon: "lucide:chart-spline",
    children: [
      {
        title: "Revenue",
        link: "/admin/orders",
        icon: "lucide:dollar-sign",
      },
      {
        title: "Coupons",
        link: "/admin/coupons",
        icon: "i-lucide-tag",
      },
    ],
  },
  {
    title: "Settings",
    icon: "lucide:settings",
    children: [
      {
        title: "General",
        link: "/admin/settings",
        icon: "lucide:sliders-horizontal",
      },

      {
        title: "Email & SMS",
        link: "/admin/settings/noticechannel",
        icon: "lucide:mail",
      },
      {
        title: "Payment",
        link: "/admin/settings/payment",
        icon: "lucide:credit-card",
      },
      {
        title: "Contact",
        link: "/admin/settings/contact",
        icon: "lucide:handshake",
      },
    ],
  },
];

export const navMenuBottom: NavMenuItems = [
  {
    title: "Account",
    icon: "i-lucide-user",
    link: "/admin/account",
  },
];

export const mainMenu = [
  { name: "Home", path: "/", icon: "lucide:home" },
  { name: "Courses", path: "/courses", icon: "lucide:book-open" },
  { name: "Categories", path: "/categories", icon: "lucide:layers" },
];

export const courseMenu = [
  {
    title: "ক্লাসসমূহ",
    link: "lessons",
    icon: "lucide:video",
    type: "is_class",
  },

  {
    title: "বহুনির্বাচনী পরীক্ষা",
    link: "mcq",
    icon: "lucide:clipboard-list",
    type: "is_mcq",
  },
  {
    title: "লিখিত পরীক্ষা",
    link: "written",
    icon: "lucide:file-text",
    type: "is_cq",
  },
  {
    title: "হোম ওয়ার্কস",
    link: "homeworks",
    icon: "lucide:home",
    type: "general",
  },
  {
    title: "প্রোগ্রেস রিপোর্ট",
    link: "progress",
    icon: "lucide:bar-chart-3",
    type: "general",
  },
  {
    title: "নোটিস",
    link: "notice",
    icon: "lucide:bell",
    type: "general",
  },
];
