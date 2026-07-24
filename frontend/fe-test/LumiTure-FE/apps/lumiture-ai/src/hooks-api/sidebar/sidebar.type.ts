export interface SidebarItem {
  key: string;
  uuid: string;
  children?: SidebarItem[]; // * TypeScript 有遞迴用法 https://www.geeksforgeeks.org/what-are-recursive-types-interfaces-in-typescript/
}

export interface Sidebar {
  schema: SidebarItem[];
}
