import { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from './store';
export declare const useAppDispatch: () => import("redux-thunk").ThunkDispatch<{
    app: {
        loadingArray: string[];
        validationSchemaObject: object;
    };
}, null, import("redux").AnyAction> & import("redux-thunk").ThunkDispatch<{
    app: {
        loadingArray: string[];
        validationSchemaObject: object;
    };
}, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>;
export declare const useAppSelector: TypedUseSelectorHook<RootState>;
