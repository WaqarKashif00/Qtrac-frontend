export enum GraphArrowType{
    lessThan ="LT",
    greaterThan = "GT",
    equal = "EQ"
}

export interface IGraphArrow{
    key:string;
    value:string;
}

export const GraphArrow : IGraphArrow[] = [{
    key:GraphArrowType.lessThan,
    value:'\u2193'
},
{
    key:GraphArrowType.greaterThan,
    value:'\u2191'
},
{
    key:GraphArrowType.equal,
    value:'\u21CB'
}]

