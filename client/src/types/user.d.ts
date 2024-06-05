export type User = {
  id: string
  avatar?: string
  displayName: string
  email: string
  phone?: string
  gender?: Gender
  address?: string
  role: string
}

enum Gender {
  MALE,
  FEMALE,
  ANOTHER
}

export type UpdateInformation = {
  avatar?: File | undefined
  displayName?: string
  phone?: string
  gender?: string
  address?: string
}
