export const flattenArrays = (arrays: any[][]) => {
  const res = arrays.reduce((prev, curr) => {
    if (!curr) return prev;
    let newRes = prev;

    curr.forEach(el => newRes = [...newRes, el]);
    return newRes;
  }, []);
  return res;
};
