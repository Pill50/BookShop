export type User = {
  id: string
  avatar?: string
  displayName: string
  email: string
  phone?: string
  gender?: string
  address?: string
  role: string
}

export type UpdateInformation = {
  avatar?: File | undefined
  displayName?: string
  phone?: string
  gender?: string
  address?: string
}
