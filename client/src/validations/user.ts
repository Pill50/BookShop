import * as Yup from 'yup'

export const updateProfileValidationSchema = Yup.object({
  displayName: Yup.string().trim().max(32, '').required('Display name is required'),
  address: Yup.string(),
  phone: Yup.string().trim().length(10)
})
