let workerList = [];
const callSum = () => {
    let w = workerList.find(worker => !worker.inUse);
    if (w) {
        w.inUse = true;
        w.worker.postMessage({ id: w.id, message: `worker id: ${w.id}` });
        w.worker.onMessage = (e) => {
            const { id, sum } = e.data;
            console.log(`Message received from worker${id} : ${sum}`);
            workerList[id].inUse = false;
        };
    } else {
        console.log('Worker not available');
    }
};

for (let i = 0; i < window.navigator.hardwareConcurrency; i++) {
    let newWorker = {
        worker: new Worker('../worker.js'),
        inUse: false,
        id: i
    };
    workerList.push(newWorker);
}

console.log('Workers: ', window.navigator.hardwareConcurrency, workerList);
callSum();
callSum();
callSum();
callSum();
callSum();
callSum();
callSum();
callSum();
callSum();
callSum();
callSum();
callSum();
callSum();