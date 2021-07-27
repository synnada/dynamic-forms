declare type Action = {
    type: string;
    payload: any;
};
declare type State = {
    loadingArray: string[];
    validationSchemaObject: object;
};
export declare function appReducer(state: State | undefined, action: Action): State;
export {};
