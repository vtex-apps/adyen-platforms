import React from 'react'

const initialState = {
  onboarding: null,
  seller: null,
  adyenAccountHolder: null,
  dispatch: null,
}

export const StateContext = React.createContext(initialState as any)
