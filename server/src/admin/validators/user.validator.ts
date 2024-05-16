import validator from 'validator';

export class UserValidator {
  static validate(body: any, toValidate: string[]) {
    const errors: string[] = [];

    if (toValidate.includes('email') && !validator.isEmail(body.email)) {
      errors.push('Invalid Email format');
    }

    if (toValidate.includes('password')) {
      if (validator.isEmpty(body.password)) {
        errors.push('Password cannot be empty');
      }
    }

    if (toValidate.includes('confirmPassword')) {
      if (validator.isEmpty(body.confirmPassword)) {
        errors.push('Confirm password cannot be empty');
      } else if (body.password !== body.confirmPassword) {
        errors.push('Passwords do not match');
      }
    }

    return errors;
  }
}
