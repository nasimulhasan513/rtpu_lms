import type { NavMenuItems } from "~/types/nav";

export const navMenu: NavMenuItems = [
  {
    title: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    link: "/admin",
  },
  {
    title: "Courses",
    icon: "lucide:graduation-cap",
    children: [
      {
        title: "All Courses",
        link: "/admin/courses",
        icon: "lucide:list-video",
      },
      {
        title: "Add Course",
        link: "/admin/courses/create",
        icon: "lucide:plus-circle",
      },
      {
        title: "Categories",
        link: "/admin/courses/categories",
        icon: "lucide:layers",
      },
      {
        title: "Teachers",
        link: "/admin/courses/teachers",
        icon: "game-icons:teacher",
      },
    ],
  },
  {
    title: "Classes",
    icon: "lucide:video",
    link: "/admin/lessons",
  },
  {
    title: "Live Classes",
    icon: "i-lucide-tv",
    link: "/admin/live-classes",
  },
  {
    title: "Notifications",
    icon: "lucide:bell",
    link: "/admin/notifications",
  },
  {
    title: "Exams",
    icon: "i-lucide-clipboard-list",
    children: [
      {
        title: "All Exams",
        link: "/admin/exams",
        icon: "i-lucide-clipboard-list",
      },
      {
        title: "Add Exam",
        link: "/admin/exams/create",
        icon: "lucide:plus-circle",
      },
      {
        title: "Submissions",
        link: "/admin/exams/submissions",
        icon: "lucide:inbox",
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
      },
      {
        title: "Add Assignment",
        link: "/admin/assignments/create",
        icon: "lucide:plus-circle",
      },
      {
        title: "Submissions",
        link: "/admin/assignments/submissions",
        icon: "lucide:inbox",
      },
    ],
  },
  {
    title: "Questions",
    icon: "i-lucide-file-question",
    link: "/admin/questions",
  },
  {
    title: "Subjects",
    icon: "i-lucide-book-open",
    link: "/admin/subjects",
  },
  {
    title: "Students",
    icon: "i-lucide-users",
    link: "/admin/students",
  },
  {
    title: "Badges & Achievements",
    icon: "lucide:award",
    link: "/admin/badges",
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
];

export const navMenuBottom: NavMenuItems = [
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
    title: "ড্যাশবোর্ড",
    link: "dashboard",
    icon: "tabler:dashboard",
  },
  {
    title: "ক্লাসসমূহ",
    link: "lessons",
    icon: "lucide:video",
  },
  {
    title: "এক্সাম",
    link: "exams",
    icon: "lucide:clipboard-list",
  },
  {
    title: "অ্যাসাইনমেন্ট",
    link: "assignments",
    icon: "lucide:file-text",
  },
];
