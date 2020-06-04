(() => {
    const ARRAY_BUFFER = 'arrayBuffer';
    const BLOB = 'blob';
    const FORM_DATA = 'formData';
    const JSON = 'json';
    const TEXT = 'text';

    const CONSTS = {
        SUCCESS: 'success',
        FAILURE: 'failure'
    }

    class FetchWorker {
        static init() {
            if (window.Worker) {
                FetchWorker.worker = new window.Worker('worker.js');
                FetchWorker.runId = 0;
                FetchWorker.runObj = {};
            }
        }

        static get responseBody() {
            return {
                ARRAY_BUFFER,
                BLOB,
                FORM_DATA,
                JSON,
                TEXT,
            };
        }

        /**
         * Posts the necessary items to the fetch web worker an receives the data back
         * acting upon the returned data with either the supplied success or failure callbacks
         * @param {string} requestUrl: the service url to fetch
         * @param {function} successCb: success callback
         * @param {function} failureCb: failure callback
         * @param {object=} options: optional options to be supplied to the fetch request. Defaults to {}
         * @param {string=} body: optional body type as defined in responseBody enum @see {@link responseBody}. Defaults to 'json'
         * @param {number=} timetout: optional timeout, this defaults to 10000
         */
        static run({ requestUrl, successCb, failureCb, options = {}, body = FetchWorker.responseBody.JSON, timetout = 10000 } = {}) {
            FetchWorker.runId += 1;
            const data = { requestUrl, options, body, timetout, id: FetchWorker.runId };
            FetchWorker.runObj[FetchWorker.runId] = {
                successCb,
                failureCb,
            };

            /**
             * We are unable to post functions due to the restrictions imposed
             * by the structured clone algorithm @see {@link https://mzl.la/1li0d0T},
             * so use the supplied callbacks in the onmessage event
             */
            FetchWorker.worker.postMessage(data);
            FetchWorker.worker.onmessage = FetchWorker.onMessage;
        }

        static onMessage(event) {
            switch (event.data.type) {
                case CONSTS.SUCCESS:
                    FetchWorker.runObj[event.data.id].successCb(event.data.body);
                    break;
                
                case CONSTS.FAILURE:
                    FetchWorker.runObj[event.data.id].failureCb(event.data.body);
                    break;
                default:
                    console.log('Error running FetchWorker');
                    break;
            }

            // purge used callbacks
            delete FetchWorker.runObj[event.data.id];
            return event.data;
        }
    }

    FetchWorker.init();
    window.FetchWorker = FetchWorker;
    return FetchWorker;
})();