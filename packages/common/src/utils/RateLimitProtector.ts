export default class RateLimitProtector {
  padding: number;
  lastInvokation: number;
  backOfLine: Promise<void>;
  constructor({ padding }: { padding: number }) {
    this.padding = padding;
    this.lastInvokation = 0;
    this.backOfLine = Promise.resolve();
  }

  get waitTime() {
    const time = Date.now();
    const timeSinceLastCall = time - this.lastInvokation;
    const timeToWait = Math.max(this.padding - timeSinceLastCall, 0);
    return timeToWait;
  }

  shieldAll(obj: any, context: any) {
    for (const prop in obj) {
      const item = obj[prop];
      if (item instanceof Function) {
        obj[prop] = this.buildAsyncShield(item, context);
      }
    }
  }

  buildAsyncShield(fn: Function, context: any) {
    const self = this;
    if (context != undefined) {
      fn = fn.bind(context);
    }
    const shieldFn = async (...args: any[]) => {
      const shieldPromiseToWaitFor = this.backOfLine;
      let resolver: Function | undefined;
      this.backOfLine = new Promise((_resolve) => {
        resolver = _resolve;
      });
      await shieldPromiseToWaitFor;
      const waitTime = self.waitTime;
      if (waitTime) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
      self.lastInvokation = Date.now();
      resolver?.();
      return fn(...args);
    };
    const shield = {
      async [fn.name](...args: any[]) {
        return shieldFn(...args);
      },
    }[fn.name];
    return shield;
  }
}
