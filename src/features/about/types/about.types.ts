export interface AboutData {
  title?: string | { ar: string; en: string };
  description?: string | { ar: string; en: string };
  content?: string | { ar: string; en: string };
  image?: string;
  sections?: Array<{
    title: string | { ar: string; en: string };
    content: string | { ar: string; en: string };
    image?: string;
  }>;
  [key: string]: any;
}
