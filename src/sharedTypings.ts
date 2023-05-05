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

export interface IShopQuestion {
  name: string
  type: ShopQuestionType
  data: any
}

export interface IShopItem {
  cost: number
  questions: IShopQuestion[]
  name: string
  desc: string
  isPublished: boolean
  script: string
}

export enum ShopQuestionType {
  TEXT,
  SELECT,
}

export type SelectOption = {
  label: string
  value: string
}
