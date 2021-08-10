declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    app: {
        loadingArray: string[];
        validationSchemaObject: object;
    };
}, import("redux").AnyAction, [import("redux-thunk").ThunkMiddleware<{
    app: {
        loadingArray: string[];
        validationSchemaObject: object;
    };
}, import("redux").AnyAction, null> | import("redux-thunk").ThunkMiddleware<{
    app: {
        loadingArray: string[];
        validationSchemaObject: object;
    };
}, import("redux").AnyAction, undefined>]>;
export declare type RootState = ReturnType<typeof store.getState>;
export declare type AppDispatch = typeof store.dispatch;
export default store;
