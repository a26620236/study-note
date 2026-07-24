// eslint-disable-next-line promise/avoid-new, no-promise-executor-return
export const sleep = async (ms: number) => await new Promise((resolve) => setTimeout(resolve, ms));
