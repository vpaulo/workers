function fetchTimeout(url, options, timeout) {
    let controller;
    let signal = {};
    if (AbortController) {
        controller = new AbortController();
        signal = controller.signal;
    }

    const newOptions = {...options, ...signal};

    return Promise.race([
        fetch(url, newOptions),
        new Promise((_, reject) => {
            return setTimeout(() => {
                if (controller) {
                    controller.abort();
                }
                return reject('Fetch timeout');
            }, timeout);
        })
    ]);
}

onmessage = (event) => {
    const { requestUrl, options, body, timeout, id } = event.data;
    let response = {
        type: '',
        body: '',
        id,
    };

    fetchTimeout(requestUrl, options, timeout)
    .then((rsp) => {
        return rsp[body]()
        .then((data) => {
            if (!rsp.ok) {
                const error = {
                    status: rsp.status,
                    statusText: rsp.statusText,
                    message: data
                };
                return Promise.reject(error);
            }
            return data;
        })
        .then((data) => {
            response.type = 'success';
            response.body = data;
            postMessage(response);
        })
        .catch((error) => {
            response.type = 'failure';
            response.body = error.message;
            postMessage(response);
        });
    })
};