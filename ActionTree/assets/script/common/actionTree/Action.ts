import { Behavior } from "./IBehavior";

export class Action implements Behavior {
    constructor(private actionName: string) {}
  
    execute(): boolean {
      console.log(`执行动作: ${this.actionName}, 子类未重写execute()方法`);
      // 实际执行逻辑，这里简化为始终成功
      return true;
    }
  }