export interface NavLink {
  title: string;
  link: string;
  icon?: string;
  role?: string;
}

export interface NavSectionTitle {
  heading: string;
}

export interface NavGroup {
  title: string;
  icon?: string;
  role?: string;
  children: NavLink[];
}

export declare type NavMenuItems = (NavLink | NavGroup | NavSectionTitle)[];
