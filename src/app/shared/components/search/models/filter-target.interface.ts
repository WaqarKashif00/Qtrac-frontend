import { IFilterable } from "./filterable.interface";

export interface IFilterTarget {
  matchesFilter(filterModel: IFilterable): boolean;
}
