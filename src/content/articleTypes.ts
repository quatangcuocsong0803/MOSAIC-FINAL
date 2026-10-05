export type ArticleHighlight = {
  label: string;
  text: string;
};

export type ArticleBlock =
  | { type: "heading"; level: 2 | 3; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "stack"; items: string[] }
  | { type: "definition"; title: string; text: string }
  | { type: "reference"; text: string; url?: string };

export type ArticleDocument = {
  title: string;
  eyebrow: string;
  subtitle: string;
  highlights: ArticleHighlight[];
  intro: string[];
  blocks: ArticleBlock[];
};
