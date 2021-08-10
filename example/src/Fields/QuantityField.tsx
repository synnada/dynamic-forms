/* eslint-disable no-unused-vars */

import React from 'react'
import { withDynamicForms } from '@synnada/dynamic-forms'
import { useField } from 'formik'
// import * as Yup from 'yup';

function QuantityField({ fieldProps, ...props }: any) {
  // const { values, set } = useFormikContext()
  const { calculatedAmount } = fieldProps
  const [field, meta] = useField(props)

  return (
    <>
      <input {...props} {...field} value={calculatedAmount ?? ''} />
      {!!meta.touched && !!meta.error && <div>{meta.error}</div>}
    </>
  )
}

const rules = {
  fieldProps: {
    calculatedAmount: -1
  },
  manupilation: {
    [`%.amount`]: ({ relationValue }: any) => ({
      calculatedAmount: relationValue * 2
    })
  }
}

export default withDynamicForms(rules)(QuantityField)
