// import * as Yup from 'yup'

export const validateSchema = (getValidationSchema: any) => (value: any) => {
  const valSchema = getValidationSchema(value)
  try {
    valSchema.validateSync(value, { abortEarly: false })
    return undefined
  } catch (error) {
    return error?.message
    // return getErrorsFromValidationError(error)
  }
}

/* const getErrorsFromValidationError = (validationError: any) => {
  const FIRST_ERROR = 0
  return validationError.inner.reduce(
    (errors: any, error: any) => ({
      ...errors,
      [error.path]: error.errors[FIRST_ERROR]
    }),
    {}
  )
} */
