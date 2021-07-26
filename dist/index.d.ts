import * as React from 'react';
interface Rules {
    initialValue?: any;
    fieldProps?: any;
    dependsOn?: any;
    manupilation?: any;
}
export interface FormContextData {
    getLoading: (name?: string | undefined) => boolean;
    setLoading: (name: string, value: boolean) => void;
}
export declare const formContextDefaultValue: FormContextData;
export declare const FormContext: React.Context<FormContextData>;
export declare const useDynamicForms: () => FormContextData;
export declare const Provider: ({ children }: any) => JSX.Element;
export declare const DynamicFormsProvider: (props: any) => JSX.Element;
export declare const withDynamicForms: (rules: Rules) => (Component: any) => (props: any) => JSX.Element;
export {};
