export interface RuleSet {
  condition: string;
  rules: Array<RuleSet | Rule>;
  collapsed?: boolean;
  isChild?: boolean;
}
export interface Rule {
  field: string;
  value?: any;
  operator?: string;
  entity?: string;
}
