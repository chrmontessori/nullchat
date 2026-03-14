import type { Language } from "./translations";

export type FaqKey =
  | "faq_1_title" | "faq_1_body"
  | "faq_2_title" | "faq_2_body"
  | "faq_3_title" | "faq_3_body"
  | "faq_4_title" | "faq_4_body"
  | "faq_5_title" | "faq_5_body"
  | "faq_6_title" | "faq_6_body"
  | "faq_7_title" | "faq_7_body"
  | "faq_8_title" | "faq_8_body"
  | "faq_9_title" | "faq_9_body"
  | "faq_10_title" | "faq_10_body"
  | "faq_11_title" | "faq_11_body"
  | "faq_12_title" | "faq_12_body"
  | "faq_13_title" | "faq_13_body"
  | "faq_14_title" | "faq_14_body"
  | "faq_15_title" | "faq_15_body"
  | "faq_16_title" | "faq_16_body_1" | "faq_16_body_2"
  | "faq_17_title" | "faq_17_body"
  | "faq_18_title" | "faq_18_body"
  | "faq_19_title" | "faq_19_body"
  | "faq_20_title" | "faq_20_body"
  | "faq_21_title" | "faq_21_body"
  | "faq_22_title" | "faq_22_body"
  | "faq_23_title" | "faq_23_body"
  | "faq_24_title" | "faq_24_body"
  | "faq_25_title" | "faq_25_body"
  | "faq_26_title" | "faq_26_body"
  | "faq_27_title" | "faq_27_body"
  | "faq_28_title" | "faq_28_body"
  | "faq_29_title" | "faq_29_body"
  | "faq_30_title" | "faq_30_body_1" | "faq_30_body_2"
  | "faq_31_title" | "faq_31_body_1"
  | "faq_32_title" | "faq_32_body";

import { en } from "./faq/en";
import { es } from "./faq/es";
import { fr } from "./faq/fr";
import { de } from "./faq/de";
import { pt } from "./faq/pt";
import { ar } from "./faq/ar";
import { fa } from "./faq/fa";
import { zhCN } from "./faq/zh-CN";
import { zhTW } from "./faq/zh-TW";
import { ru } from "./faq/ru";
import { ja } from "./faq/ja";
import { ko } from "./faq/ko";
import { hi } from "./faq/hi";
import { tr } from "./faq/tr";
import { uk } from "./faq/uk";
import { pl } from "./faq/pl";
import { it } from "./faq/it";
import { nl } from "./faq/nl";
import { vi } from "./faq/vi";
import { th } from "./faq/th";
import { id } from "./faq/id";
import { ms } from "./faq/ms";
import { bn } from "./faq/bn";
import { ur } from "./faq/ur";
import { sw } from "./faq/sw";

export const faqTranslations: Record<Language, Record<FaqKey, string>> = {
  en,
  es,
  fr,
  de,
  pt,
  ar,
  fa,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  ru,
  ja,
  ko,
  hi,
  tr,
  uk,
  pl,
  it,
  nl,
  vi,
  th,
  id,
  ms,
  bn,
  ur,
  sw,
};
