/**
 * 循环执行的协程
 * @param generatorFunction  生成器函数
 * @param loopTimes  循环次数，默认-1 表示无限循环
 * @returns 返回协程实例
 */
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

    /**
     * 开始执行协程
     */
    this.start = function () {
        // console.log('--------------- start')
        isAborted = false;
        iterator = generatorFunction();
        handle(iterator.next());
    };

    /**
     * 停止协程
     */
    this.stop = function () {
        // console.log('--------------- stop')
        isAborted = true;
    };

    ins = this;
    return ins;
}


/**
 * 单次执行的协程
 * @param generatorFunction 生成器函数
 * @returns 协程实例
 */
export function Coroutine(generatorFunction) {
    return LoopCoroutine(generatorFunction, 1)
}

/**
 * 协程等待
 * @param seconds 等待秒数
 * @returns 
 */
export function Wait(seconds) {
    let task = function asyncTask1(callback) {
        setTimeout(function () {
            callback(null, `wait ${seconds} seconds`);
        }, seconds * 1000);
    }
    return task
}

/**
 * 协程等待
 * @param millisecond 等待豪秒数
 * @returns 
 */
export function WaitMs(millisecond) {
    let task = function asyncTask1(callback) {
        setTimeout(function () {
            callback(null, `wait ${millisecond} millisecond`);
        }, millisecond);
    }
    return task
}