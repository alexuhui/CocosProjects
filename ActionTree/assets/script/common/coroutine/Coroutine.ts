export function LoopCoroutine(generatorFunction, loopTimes = -1) {
    let iterator;
    let isAborted: boolean;
    let loop = loopTimes;
    let ins;

    function handle(result) {
        if (isAborted) return;
        if (result.done) {
            if (loopTimes === -1 || --loop > 0) {
                ins.start()
            }
            // console.log(`------------ loopTimes : ${loopTimes}  loop : ${loop} `)
            return;
        }
        result.value(function (err, data) {
            if (isAborted) {
                return
            }
            if (err) {
                iterator.throw(err);
            } else {
                handle(iterator.next(data));
            }
        });
    }

    this.start = function () {
        // console.log('--------------- start')
        isAborted = false;
        iterator = generatorFunction();
        handle(iterator.next());
    };

    this.stop = function () {
        // console.log('--------------- stop')
        isAborted = true;
    };

    ins = this;
    return ins;
}

export function Coroutine(generatorFunction) {
    return LoopCoroutine(generatorFunction, 1)
}

export function Wait(seconds) {
    let task = function asyncTask1(callback) {
        setTimeout(function () {
            callback(null, `wait ${seconds} seconds`);
        }, seconds * 1000);
    }
    return task
}

export function WaitMs(millisecond) {
    let task = function asyncTask1(callback) {
        setTimeout(function () {
            callback(null, `wait ${millisecond} millisecond`);
        }, millisecond);
    }
    return task
}