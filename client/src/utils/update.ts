import React from 'react'

export function useForceUpdate(): () => void {
  return React.useReducer(() => ({}), {})[1] as () => void
}
