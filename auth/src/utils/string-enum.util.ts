export function toEnum<T extends string>(...values: T[]) {
  return values.reduce(
    (acc, value) => {
      acc[value] = value.toLowerCase();
      return acc;
    },
    {} as Record<T, string>,
  );
}
