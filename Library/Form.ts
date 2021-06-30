
export type ValidatorFunction = (field: string, originalValue: any, transformedValue: any) => string | undefined
export interface FormField {
    name: string
    type: any,
    validators: ValidatorFunction[]
}

export function Field(...validators: ValidatorFunction[]) {
    return (target: object, property: string) => {
        const fields: FormField[] = Reflect.getMetadata('form-fields', target) ?? []

        const type = Reflect.getMetadata('design:type', target, property)
        const primitiveType = Form.types.get(type)

        fields.push({
            name: property,
            type,
            validators: primitiveType?.validator ? [primitiveType.validator, ...validators] : validators
        })

        Reflect.defineMetadata('form-fields', fields, target)
    }
}

export function isString(field: string, originalValue: any, transformedValue: string) {
    if (typeof originalValue !== 'string' && typeof originalValue !== 'number') {
        return `The '${field}' field is invalid`
    }
}

export function isRequired(field: string, originalValue: any, transformedValue: string) {
    if (originalValue === '' || originalValue === undefined) {
        return `The '${field}' field is required`
    }
}

export function isEmail(field: string, originalValue: any, transformedValue: string) {
    if (!originalValue?.includes?.('@')) {
        return `The '${field}' field is not a valid email address`
    }
}

export function isNumber(field: string, originalValue: any, transformedValue: number) {
    if (isNaN(transformedValue)) {
        return `The '${field}' field is not a valid number`
    }
}

export function isDate(field: string, originalValue: any, transformedValue: Date) {
    if (isNaN(transformedValue.getTime())) {
        return `The '${field}' field is not a valid date`
    }
}

export class Form {
    static types = new Map<any, {transformer: (value: any) => any, validator?: ValidatorFunction}>()
    errors: Record<string, string[]> = {}

    constructor(request: Record<string, any>) {
        const fields: FormField[] = Reflect.getMetadata('form-fields', this) ?? []

        fields.forEach(field => {
            const originalValue = request[field.name]
            const formType = Form.types.get(field.type)
            const actualValue = formType?.transformer(originalValue)

            const errors = field.validators.map(validator => {
                return validator(field.name, originalValue, actualValue)
            }).filter(Boolean)

            if (errors.length) {
                this.errors[field.name] = errors as string[]
            }

            Object.assign(this, {
                [field.name]: actualValue
            })
        })
    }
}

Form.types.set(String, {
    transformer: (value: any) => String(value),
    validator: isString
})
Form.types.set(Number, {
    transformer: (value: any) => Number(value),
    validator: isNumber
})
Form.types.set(Date, {
    transformer: (value: any) => new Date(value),
    validator: isDate
})
Form.types.set(Boolean, {
    transformer: (value: any) => Boolean(value)
})
