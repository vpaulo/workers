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