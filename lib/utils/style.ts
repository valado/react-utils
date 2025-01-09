// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isString = (it: any) => typeof it === "string" || it instanceof String;
type SwitchableClass = [className: string, activated: boolean];

export const concatClassNames = (
  ...classes: (string | SwitchableClass)[]
): string => {
  return classes
    .map((it) => {
      if (isString(it)) {
        return it;
      } else {
        const [className, activated] = it;
        return activated ? className : "";
      }
    })
    .join(" ");
};
