/* eslint-disable no-case-declarations */
type Action = { type: 'get'; payload: any } | { type: 'set'; payload: any }
// type Dispatch = (action: Action) => void
type State = { loadingArray: string[] }

const initialState: State = { loadingArray: [] }

export function appReducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'set':
      const { name, value }: any = action.payload
      const draftTracing = [...state.loadingArray]
      const fieldFoundIndex = draftTracing.indexOf(name)
      const fieldFound = fieldFoundIndex > -1

      if (value && !fieldFound) {
        // yükleme başlasın
        draftTracing.push(name)
      } else if (!value && fieldFound) {
        // yükleme duracak
        draftTracing.splice(fieldFoundIndex, 1)
      }
      return {
        ...state,
        loadingArray: draftTracing
      }
  }

  return state
}
