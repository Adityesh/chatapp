export function arrayDifference<T>(
  first: T[],
  second: T[],
  compareFn?: (a: T, b: T) => boolean,
): T[] {
  if (compareFn) {
    return first.filter(
      (item1) => !second.some((item2) => compareFn(item1, item2)),
    );
  }

  return first.filter((element) => !second.includes(element));
}

export function arrayEqual(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const arr1Sorted = [...arr1].sort();
  const arr2Sorted = [...arr2].sort();

  for (let i = 0; i < arr1Sorted.length; i++) {
    if (arr1Sorted[i] !== arr2Sorted[i]) {
      return false;
    }
  }
  return true;
}
