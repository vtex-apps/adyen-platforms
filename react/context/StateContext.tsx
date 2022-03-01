import React from 'react'

const initialState = {
  onboarding: null,
  seller: null,
  adyenAccountHolder: null,
  setContextState: () => {},
}

export const StateContext = React.createContext(initialState as any)
