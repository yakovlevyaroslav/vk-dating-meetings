export function classNames(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(' ');
}
