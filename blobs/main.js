const blobWorker = () => {
    const bigLoop = () => {
        let sum = 0;
        for (let i = 0; i < 200000000; i++) {
            sum += i;
        }
        return sum;
    };
    
    onmessage = (e) => {
        const { id, message } = e.data;
        console.log(`Message from: ${message}`);
        console.time(`worker${id}`);
        const sum = bigLoop();
        console.timeEnd(`worker${id}`);
        postMessage({ id, sum });
    };
};
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

const URL = window.URL || window.webkitURL;
const url = URL.createObjectURL(
    new window.Blob(
        ['(', blobWorker.toString(), ')()'],
        { type: 'text/javascript' },
    ),
);

for (let i = 0; i < window.navigator.hardwareConcurrency; i++) {
    let newWorker = {
        worker: new Worker(url),
        inUse: false,
        id: i + 12
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