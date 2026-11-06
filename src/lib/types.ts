// Types shared by server and client code. Keep this file free of server imports.

export type Role = 'admin' | 'member'

export type User = {
  id: number
  username: string
  role: Role
}

export type Person = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  country: string
  picture: string
}

export type Note = {
  id: number
  body: string
  author: string
  createdAt: string
}
