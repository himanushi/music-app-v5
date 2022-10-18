/* eslint-disable @typescript-eslint/no-explicit-any */
// ref: https://xstate.js.org/docs/guides/states.html#state-meta-data
export const mergeMeta = <T extends {}>(meta: Record<string, any>) =>
  Object.keys(meta).reduce((acc, key) => {
    const value = meta[key];

    // Assuming each meta value is an object
    Object.assign(acc, value);

    return acc;
  }, {} as T);
