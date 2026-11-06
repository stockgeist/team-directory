import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getUserFromRequest } from '../server/auth.server'

/** The logged-in user, or null. Runs on the server; callable from anywhere. */
export const getCurrentUser = createServerFn().handler(() => getUserFromRequest(getRequest()))
