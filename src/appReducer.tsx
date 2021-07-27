/* eslint-disable no-case-declarations */
type Action = { type: string; payload: any }
// type Dispatch = (action: Action) => void
type State = {
  loadingArray: string[]
  validationSchemaObject: object
}

const initialState: State = {
  loadingArray: [],
  validationSchemaObject: {}
}

export function appReducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'setLoading':
      const payload: any = action.payload
      const draftTracing = [...state.loadingArray]
      const fieldFoundIndex = draftTracing.indexOf(payload.name)
      const fieldFound = fieldFoundIndex > -1

      if (payload.value && !fieldFound) {
        // yükleme başlasın
        draftTracing.push(payload.name)
      } else if (!payload.value && fieldFound) {
        // yükleme duracak
        draftTracing.splice(fieldFoundIndex, 1)
      }
      return {
        ...state,
        loadingArray: draftTracing
      }
    case 'addValidationSchema':
      /* const draftObject = { ...state.validationSchemaObject }
      draftObject[action.payload.name] = action.payload.rules.validationSchema */
      return {
        ...state
        // validationSchemaObject: draftObject
      }
  }

  return state
}
