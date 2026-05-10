const _withLeadingZero = (num: number) => ("0" + num).slice(-2);
const toApiString = (date: Date) =>
  `${date.getFullYear()}-${_withLeadingZero(date.getMonth() + 1)}-${_withLeadingZero(date.getDate())}`;

const getKeyForDate = (date: Date = new Date()) =>
  "trackuler-" + Utils.toApiString(date);

const classNamesFilter = (arg: any) => !!arg && typeof arg === "string";
const classNames = (...classes: any[]): string | undefined =>
  classes.filter(classNamesFilter).join(" ") || undefined;

export const getTagAndTextForDescription = (
  desc: string,
): [tag: undefined | string, text: string] => {
  const split = desc.split(": ");
  return split.length > 1
    ? [split[0], split.slice(1).join(": ")]
    : [undefined, desc];
};

export const Utils = {
  toApiString,
  getKeyForDate,
  classNames,
  getTagAndTextForDescription,
};
