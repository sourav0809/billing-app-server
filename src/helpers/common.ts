export const filterObjectForUndefined = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
};