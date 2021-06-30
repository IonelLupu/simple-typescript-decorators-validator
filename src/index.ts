import 'reflect-metadata'
import request from './request.json'
import { PlayerForm } from './PlayerForm'

console.clear()
console.log()

const form = new PlayerForm(request)

if (Object.keys(form.errors).length) {
    console.log('Form is INVALID')
    console.log(JSON.stringify(form.errors, null, 2))
} else {
    console.log('Form is VALID')
    console.log(form)
}

/*
// Example of errors from form.errors

{
  "name": [
    "The 'name' field is required"
  ],
  "email": [
    "The 'email' field is not a valid email address"
  ]
}

*/


