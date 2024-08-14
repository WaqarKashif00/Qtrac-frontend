export interface ISideBarItems {
  id: string;
  text: string;
  icon: string;
  path: string;
  level: number;
  name: string;
  newWindowPath?: string;
  isOpenInNewWindow?: boolean;
  parentId?:string,
  canCompanyUserAccess: boolean;
  isParentSelected?:boolean
}
