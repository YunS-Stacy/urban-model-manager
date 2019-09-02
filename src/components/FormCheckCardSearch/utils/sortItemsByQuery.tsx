export const sortItemsByQuery = (
  items: any[],
  queryField: string,
) =>
  items.sort(({ [queryField]: a }, { [queryField]: b }) =>
    `${a}`.toUpperCase() > `${b}`.toUpperCase() ? 1 : -1,
  );
