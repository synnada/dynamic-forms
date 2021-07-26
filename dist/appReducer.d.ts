declare type Action = {
    type: 'get';
    payload: any;
} | {
    type: 'set';
    payload: any;
};
declare type State = {
    loadingArray: string[];
};
export declare function appReducer(state: State | undefined, action: Action): State;
export {};
