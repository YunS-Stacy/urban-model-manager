export const divideItemsByQuery = (
  items: any[],
  query: string,
  queryField: string,
) => {
  const hasArr = items.filter(({ [queryField]: target }) =>
    new RegExp(query, 'i').test(target),
  );
  return [
    hasArr,
    items.filter(
      ({ [queryField]: origin }) =>
        !hasArr.some(({ [queryField]: target }) => target === origin),
    ),
  ];
};
