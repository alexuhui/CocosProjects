export class Utils {

  /** 
   * 产生左闭又开的伪随机数 
   * @param [forceInt=false] 是否转成整数，默认不转
   * @param args 不传值返回[0, 1）, 传一个指 max 返回 [0, max), 传两个值min, max 返回 [min, max)
   */
  static getRandom(forceInt : boolean = false, ...args: number[]): number {
    // console.log("---------", args[0], args[1])
    let min = args.length < 2 ? 0 : args[0]
    let max = args.length < 1 ? 1 : (args.length < 2 ? args[0] : args[1])
    let retsult = Math.random() * (max - min) + min
    // cc.log('min : ', min, 'max : ', max, "result : ", retsult)
    if (forceInt) {
      retsult = Math.floor(retsult)
    }
    return retsult
  }

  static getRandomElement<T>(array: T[]): T | undefined {
    if (array.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  /** 打乱数组元素顺序 */
  static shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = array;//array.slice(); // 创建数组的副本，以免修改原始数组

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      // 交换元素
      const temp = shuffledArray[i];
      shuffledArray[i] = shuffledArray[randomIndex];
      shuffledArray[randomIndex] = temp;
    }

    return shuffledArray;
  }

  /** 把一个元素随机塞到数组中 */
  static shuffleItemToArray<T>(array: T[], item: T) {
    const randomIndex = Math.min(Math.floor(Math.random() * (array.length + 1)), array.length);
    array.splice(randomIndex, 0, item)
    return randomIndex
  }
}