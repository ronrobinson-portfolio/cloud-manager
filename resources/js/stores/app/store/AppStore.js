import Vue from 'vue';
import ErrorBag  from 'utils/errorBag/ErrorBag';

const state = {
    namespace : 'app',
    notification : null,

    // Keep track of ajax requests
    ajaxRequestCount : 0,
    ajaxTypeCount    : {},

    // Error bag
    errorBag: new ErrorBag(),
};

const getters = {
    isLoading: (state) => (requestType) => {
        // Overall loading
        if (!requestType) {
            return !!state.ajaxRequestCount;
        }
        // Specific loading
        else {
            return !!state.ajaxTypeCount[requestType];
        }
    },

    requestTypeCount: (state, requestType) =>
        state.ajaxTypeCount[requestType]
            ? state.ajaxTypeCount[requestType]
            : 0
};

const mutations = {
    // Nofitication
    updateNotification(state, notification) {
        state.notification = notification;
    },

    // Update AJAX calls count
    startedAjax(state, requestType) {
        state.ajaxRequestCount++;

        if (requestType) {
            if (state.ajaxTypeCount[requestType]) {
                state.ajaxTypeCount[requestType]++;
            }
            else {
                Vue.set(state.ajaxTypeCount, requestType, 1)
            }
        }
    },

    finishedAjax(state, requestType) {
        state.ajaxRequestCount--;

        if (requestType) {
            if (state.ajaxTypeCount[requestType]) {
                state.ajaxTypeCount[requestType]--;
            }
            else {
                Vue.set(state.ajaxTypeCount, requestType, 0)
            }
        }
    },

    fatalError(state) {
        // There was a fatal error,most likely a axios response error.
        // Reset ajax tracking information
        // so the application isn't locked, i.e., loading indicators.

        state.ajaxRequestCount = 0;
        state.ajaxTypeCount    = {};
    },

    // Error Bag
    updateErrorBag(state, errorBag) {
        state.errorBag = errorBag;
    },

    updateErrors(state, error) {
        let errorBag  =  new ErrorBag();

        if (error.response) {
            /*
               Expected error format:
               {"message":"A name is required.","validationErrors":{"name":["A name is required."]}}
            */
            let errors = error.response.data;

            // When there are a validation errors, this typically means
            // the data is dealing with some sort of form. Assume this form is
            // in a component and mark it as a 'componentError'. If there are
            // no validation error then assume it's a general/global error
            // that should be display prominently on a page ('pageError')
            if (!errors.validationErrors) {
                // Error Message
                errorBag.add({
                    field: !errors.validationErrors ? 'pageError' : 'componentError',
                    msg: errors.message
                });
            }

            // Validation Errors
            // 'validationErrors' is a custom property. Check for validationErrors
            // then use 'errors' property if available.
            let validationErrors = errors.validationErrors ?
                errors.validationErrors : errors.errors

            if (validationErrors) {
                for (let prop in validationErrors ) {
                    errorBag.add({
                        field : prop,
                        msg   : validationErrors[prop]
                    });
                }
            }
        }
        else if (typeof error === 'string' || error instanceof String ) {
            errorBag.add({
                field : 'pageError',
                msg   : error
            });
        }
        //Unknown Error
        else {
            errorBag.add({
                field : 'pageError',
                msg   : 'Unknown Error'
            });
        }

        state.errorBag = errorBag;
    },

    resetErrorBag(state) {
        state.errorBag.clear();
    },

    clearPageError(state) {
        state.errorBag.remove('pageError');
    }
};

const actions = {
    init({commit, dispatch}) {
        const initDispatches = [
            'device/init',
            'os/init',
            'service/init',
            'status/init',
        ];

        const initPromises = initDispatches.map(initDispatch =>
            dispatch(initDispatch, null, {root: true})
                .then(() => Promise.resolve())
                .catch((err) => Promise.reject(err))
        )

        return Promise.all(initPromises)
            .then(() => Promise.resolve())
            .catch(() => {});
    },
};

export default {state, getters, mutations, actions};
