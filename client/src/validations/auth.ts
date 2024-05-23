import * as Yup from 'yup'

export const loginValidationSchema = Yup.object({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required')
})

export const registerValidationSchema = Yup.object({
  displayName: Yup.string().required('Display name is required'),
  email: Yup.string().email('Invalid email').required('Email is required').trim(),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password is too long')
    .trim(),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Confirm password do not match')
    .trim()
})

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email().required('Email is required')
})

export const resetPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password is too long')
    .trim(),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Confirm password do not match')
    .trim()
})
