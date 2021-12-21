export enum CommandCondition {
    EQUALS,
    CONTAINS,
    STARTS_WITH,
    ENDS_WITH,
}

export enum ReactionRoleType {
    GIVE = 'give',
    REMOVE = 'remove',
    MULTI = 'multi',
}

export enum ShopQuestionType {
    TEXT,
    SELECT,
}

export type SelectOption = {
    label: string
    value: string
}
