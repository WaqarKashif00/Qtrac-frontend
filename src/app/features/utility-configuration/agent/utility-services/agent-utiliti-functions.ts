import { IAgentCustomersListItem } from '../models/agent-models';

export function IsAnyFieldRepeated<T, P>(elements: T[], getter: (x: T) => P) {
  let arr = elements.map(getter);
  return arr.length > [...new Set(arr)].length;
}

export function sortBySortPosition(
  item1: IAgentCustomersListItem,
  item2: IAgentCustomersListItem
): number {
  if (Number(item1.sortPosition) > Number(item2.sortPosition)) return 1;
  if (Number(item1.sortPosition) == Number(item2.sortPosition)) return 0;
  if (Number(item1.sortPosition) < Number(item2.sortPosition)) return -1;
}

export function sortByTime(
  item1: IAgentCustomersListItem,
  item2: IAgentCustomersListItem
): number {
  if (
    new Date(item1.utcTimeString).getTime() >
    new Date(item2.utcTimeString).getTime()
  )
    return 1;
  if (
    new Date(item1.utcTimeString).getTime() ==
    new Date(item2.utcTimeString).getTime()
  )
    return 0;
  if (
    new Date(item1.utcTimeString).getTime() <
    new Date(item2.utcTimeString).getTime()
  )
    return -1;
}
