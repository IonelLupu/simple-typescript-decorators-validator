import { Field, Form, isRequired, isEmail } from '../Library/Form'

export class PlayerForm extends Form {
    @Field(isRequired)
    name: string

    @Field(minValue(100))
    coins: number

    @Field(isEmail)
    email: string

    @Field()
    isBanned: boolean

    @Field()
    birthday: Date
}

function minValue(value: number){
    return (field: string, originalValue: any, transformedValue: number) => {
        if (transformedValue < value) {
            return `The '${field}' must be bigger than ${value}`
        }
    }
}
