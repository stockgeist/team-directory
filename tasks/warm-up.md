# Warm-up

Three small changes to get to know the app.

## 1. Initials

Implement `initials(firstName, lastName)` in `src/lib/initials.ts`.

| Call | Result |
|---|---|
| `initials('August', 'Hansen')` | `'AH'` |
| `initials('ada', 'lovelace')` | `'AL'` |

## 2. Emails on the list

On the home page (`/`), show each person's email under their city and
country.

## 3. Count endpoint

Add an endpoint `GET /api/people/count` that responds with the number of
people in the database as JSON:

```json
{ "count": 120 }
```

`npm run test:warm-up` runs the tests for the warm-up.
