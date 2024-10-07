// test utility to await all running promises
global.nextTick = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 0));

export {};
