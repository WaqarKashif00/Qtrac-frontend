import { QuestionType } from 'src/app/models/enums/question-type.enum';

export const TypeOfNumber = QuestionType.Number.value;
export const TypeOfString = QuestionType.Text.value;
export const TypeOfLongString = QuestionType.LongText.value;
export const TypeOfBoolean = "BOOLEAN";
export const TypeOfPhoneNumber = QuestionType.PhoneNumber.value;
export const TypeOfSMSPhoneNumber = QuestionType.SMSPhoneNumber.value;
export const TypeOfEmail = QuestionType.Email.value;
export const TypeOfDate = QuestionType.Date.value;
export const TypeOfTime = QuestionType.Time.value;
export const TypeOfDropDown = QuestionType.DropDown.value;
export const TypeOfMultiSelect = QuestionType.MultiSelect.value;
export const TypeOfOptions = QuestionType.Options.value;

export enum Operators{
    Equals ='Equals',
    NotEquals = 'Not Equals',
    GreaterThan = 'Greater Than',
    GreaterThanAndEquals ='Greater Than and Equals',
    LessThan = 'Less Than',
    LessThanAndEquals = 'Less Than and Equals',
    Contains = 'Contains',
    IsEmpty = 'IsEmpty',
    True = 'True',
    False = 'False',
    After = 'After',
    Before = 'Before',
    In = 'In',
    NotIn = 'Not In',
}

export enum operatorsValue{
    Equals ='==',
    NotEquals = '!=',
    GreaterThan = '>',
    GreaterThanAndEquals ='>=',
    LessThan = '<',
    LessThanAndEquals = '<=',
    Contains = 'contains',
    IsEmpty = 'isEmpty',
    True = 'true',
    False = 'false',
    After = '>',
    Before = '<',
    In = 'in',
    NotIn = 'notIn',
}

export const NumberOperatorArray = [
    {text: Operators.Equals , value: operatorsValue.Equals},
    {text: Operators.NotEquals,value: operatorsValue.NotEquals},
    {text: Operators.GreaterThan,value: operatorsValue.GreaterThan},
    {text: Operators.GreaterThanAndEquals,value: operatorsValue.GreaterThanAndEquals},
    {text: Operators.LessThan,value: operatorsValue.LessThan},
    {text: Operators.LessThanAndEquals,value: operatorsValue.LessThanAndEquals}
];

export const StringOperatorsArray = [
    {text: Operators.Equals , value: operatorsValue.Equals},
    {text: Operators.NotEquals,value: operatorsValue.NotEquals},
    {text: Operators.Contains,value: operatorsValue.Contains},
    {text: Operators.IsEmpty,value: operatorsValue.IsEmpty}
];

export const PhoneEmailOperatorsArray = [
    {text: Operators.Equals , value: operatorsValue.Equals},
    {text: Operators.NotEquals,value: operatorsValue.NotEquals},
    {text: Operators.IsEmpty,value: operatorsValue.IsEmpty}
];

export const BooleanOperatorsArray = [
    {text:Operators.True,value: operatorsValue.True},
    {text:Operators.False,value: operatorsValue.False},
    {text: Operators.IsEmpty,value: operatorsValue.IsEmpty}
];

export const DateTimeOperatorsArray = [
    {text: Operators.Equals , value: operatorsValue.Equals},
    {text: Operators.NotEquals,value: operatorsValue.NotEquals},
    {text: Operators.After,value: operatorsValue.After},
    {text: Operators.Before,value:operatorsValue.Before},
];

export const MultiSelectorsOperatorsArray = [
    {text: Operators.Equals , value: operatorsValue.Equals},
    {text: Operators.NotEquals,value: operatorsValue.NotEquals},
    {text:Operators.In,value: operatorsValue.In},
    {text: Operators.NotIn,value: operatorsValue.NotIn}
];

export const TypesAndOperations : Map<string,any[]> = new Map<string,any[]>([
    [
        TypeOfNumber,
        NumberOperatorArray
    ],
    [
        TypeOfString,
        StringOperatorsArray
    ],
    [
        TypeOfLongString,
        StringOperatorsArray
    ],
    [
        TypeOfPhoneNumber,
        PhoneEmailOperatorsArray
    ],
    [
        TypeOfSMSPhoneNumber,
        PhoneEmailOperatorsArray
    ],
    [
        TypeOfEmail,
        PhoneEmailOperatorsArray
    ],
    [
        TypeOfBoolean,
        BooleanOperatorsArray
    ],
    [
        TypeOfDate,
        DateTimeOperatorsArray
    ],
    [
        TypeOfTime,
        DateTimeOperatorsArray
    ],
    [
        TypeOfDropDown,
        MultiSelectorsOperatorsArray
    ],
    [
        TypeOfMultiSelect,
        MultiSelectorsOperatorsArray
    ],
    [
        TypeOfOptions,
        MultiSelectorsOperatorsArray
    ]
]);

export enum ConditionType {
  Trigger = 'Trigger'
}
