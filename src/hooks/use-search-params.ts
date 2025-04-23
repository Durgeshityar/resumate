import { parseAsString, useQueryState } from 'nuqs'

export function useSearchParams() {
  return useQueryState(
    'search', // key : can be dynamic
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  )
}
