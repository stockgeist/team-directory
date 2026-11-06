/** A 303 "See Other" redirect: the browser follows it with a GET request. */
export function redirect(location: string, headers: HeadersInit = {}): Response {
  return new Response(null, { status: 303, headers: { ...headers, Location: location } })
}
