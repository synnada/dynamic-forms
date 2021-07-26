import React from 'react'

// import { ExampleComponent } from '@synnada/dynamic-forms'
import '@synnada/dynamic-forms/dist/index.css'
import { FieldArray, Form, Formik, useFormikContext } from 'formik'
import SentTypeField from './Fields/SentTypeField'
import ClientField from './Fields/ClientField'
import AmountField from './Fields/AmountField'
import { DynamicFormsProvider, useDynamicForms } from '@synnada/dynamic-forms'
import ScenerioField from './Fields/ScenerioField'
import QuantityField from './Fields/QuantityField'
// @ts-ignore
import _ from 'lodash'

const FormWrapper = () => {
  const { getLoading } = useDynamicForms()
  const { values }: any = useFormikContext()
  const loading = React.useMemo(() => getLoading(), [getLoading])
  return (
    <Form>
      {loading && <h1>Loading...</h1>}

      <ClientField name='client' />

      <SentTypeField name='sentType' />

      <ScenerioField name='scenerio' />

      <table className='table table-bordered table-vcenter'>
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Adı</th>
            <th>Miktar</th>
            <th>Birimi</th>
            <th>Birim Fiyat</th>
            <th>KDV</th>
            <th>İndirim</th>
            <th className='text-center' />
          </tr>
        </thead>
        <tbody>
          <FieldArray
            name='lines'
            render={(arrayHelpers) => (
              <>
                {values?.lines?.map((_item: any, index: number) => {
                  const rowName = `lines.${index}`
                  return (
                    <tr key={index.toString()}>
                      <td className='align-middle'>
                        <AmountField
                          placeholder='amount'
                          name={`${rowName}.amount`}
                        />
                      </td>
                      <td>
                        <QuantityField
                          placeholder='quantitiy'
                          name={`${rowName}.quantitiy`}
                        />
                      </td>

                      <td className='align-middle'>
                        <button
                          type='button'
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  )
                })}
                <tr>
                  <td className='text-center' colSpan={9}>
                    <button
                      type='button'
                      className='btn btn-success'
                      onClick={() => arrayHelpers.push({ quantitiy: 5 })}
                    >
                      +
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    Total Amount:
                    {_.sumBy(values.lines, 'amount')}
                  </td>
                </tr>
              </>
            )}
          />
        </tbody>
      </table>

      <button type='submit'>submit</button>
    </Form>
  )
}

const App = () => {
  return (
    <>
      <Formik
        initialValues={{
          lines: [
            {
              quantitiy: 10
            }
          ]
        }}
        onSubmit={async (values) => alert(JSON.stringify(values, null, 2))}
      >
        {() => (
          <DynamicFormsProvider>
            <FormWrapper />
          </DynamicFormsProvider>
        )}
      </Formik>
    </>
  )
}

export default App
