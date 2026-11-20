import { useSub } from "../../store";

export const useI18n = () => {
  const language = useSub((s) => s.language);

  const t = (d: Date, options?: Intl.DateTimeFormatOptions): string =>
    new Intl.DateTimeFormat(language, {
      hour: "numeric",
      minute: "numeric",
      ...options,
    }).format(d);

  return { t };
};
