import type { NavMenuItems } from "~/types/nav";

export const mainMenu = [
  { name: "হোম", path: "/", icon: "lucide:home" },
  { name: "কোর্স সমূহ", path: "/courses", icon: "lucide:graduation-cap" },
  // { name: "বই সমূহ", path: "/books", icon: "lucide:book" },
  { name: "আমার কোর্সসমূহ", path: "/my-courses", icon: "lucide:info" },
];

export const navMenu: NavMenuItems = [
  {
    title: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    link: "/admin",
    role: "MODERATOR",
  },
  {
    title: "Courses",
    icon: "lucide:graduation-cap",
    role: "MODERATOR",
    children: [
      {
        title: "All Courses",
        link: "/admin/courses",
        icon: "lucide:list-video",
        role: "MODERATOR",
      },
      {
        title: "Add Course",
        link: "/admin/courses/create",
        icon: "lucide:plus-circle",
        role: "ADMIN",
      },
      {
        title: "Categories",
        link: "/admin/courses/categories",
        icon: "lucide:layers",
        role: "ADMIN",
      },
      {
        title: "Teachers",
        link: "/admin/courses/teachers",
        icon: "game-icons:teacher",
        role: "ADMIN",
      },
    ],
  },

  // {
  //   title: "Notifications",
  //   icon: "lucide:bell",
  //   link: "/admin/notifications",
  //   role: "MODERATOR",
  // },
  {
    title: "Exams",
    icon: "i-lucide-clipboard-list",
    role: "MODERATOR",
    children: [
      {
        title: "All Exams",
        link: "/admin/exams",
        icon: "i-lucide-clipboard-list",
        role: "MODERATOR",
      },
      {
        title: "Add Exam",
        link: "/admin/exams/create",
        icon: "lucide:plus-circle",
        role: "MODERATOR",
      },
    ],
  },

  {
    title: "Subjects",
    icon: "i-lucide-book-open",
    link: "/admin/subjects",
    role: "ADMIN",
  },

  {
    title: "Sales",
    icon: "lucide:chart-spline",

    role: "ADMIN",
    children: [
      {
        title: "All Sales",
        link: "/admin/sales",
        icon: "i-lucide-clipboard-list",
        role: "MODERATOR",
      },
      {
        title: "Coupons",
        link: "/admin/sales/coupons",
        icon: "i-lucide-tag",
        role: "MODERATOR",
      },
      {
        title: "Search Transaction",
        link: "/admin/sales/search",
        icon: "lucide:search",
        role: "MODERATOR",
      },
    ],
  },

  {
    title: "Students",
    icon: "i-lucide-users",
    link: "/admin/users",
    role: "ADMIN",
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
    title: "প্রোগ্রেস রিপোর্ট",
    link: "progress",
    icon: "lucide:bar-chart-3",
    type: "general",
  },
  {
    title: "হোম ওয়ার্কস",
    link: "homeworks",
    icon: "lucide:home",
    type: "general",
  },

  {
    title: "নোটিস",
    link: "notice",
    icon: "lucide:bell",
    type: "general",
  },
];
