import type { EnneagramType } from "./enneagramQuestions";

export interface EnneagramTypeInfo {
  type: EnneagramType;
  name: string;
  color: string;
  softColor: string;
  keywords: string[];
}

export const enneagramTypeOrder: EnneagramType[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
];

export const enneagramTypes: Record<EnneagramType, EnneagramTypeInfo> = {
  1: {
    type: 1,
    name: "The Reformer",
    color: "#D94841",
    softColor: "#F9E4E2",
    keywords: ["principles", "improvement", "responsibility"],
  },
  2: {
    type: 2,
    name: "The Helper",
    color: "#3B82F6",
    softColor: "#E7F0FE",
    keywords: ["care", "connection", "helpfulness"],
  },
  3: {
    type: 3,
    name: "The Achiever",
    color: "#C99A16",
    softColor: "#F8F0D8",
    keywords: ["achievement", "adaptation", "results"],
  },
  4: {
    type: 4,
    name: "The Individualist",
    color: "#8B5CF6",
    softColor: "#EEE8FE",
    keywords: ["identity", "meaning", "individuality"],
  },
  5: {
    type: 5,
    name: "The Investigator",
    color: "#0F9F9A",
    softColor: "#DFF5F3",
    keywords: ["understanding", "privacy", "competence"],
  },
  6: {
    type: 6,
    name: "The Loyalist",
    color: "#4F46E5",
    softColor: "#E8E8FC",
    keywords: ["security", "planning", "trust"],
  },
  7: {
    type: 7,
    name: "The Enthusiast",
    color: "#F59E0B",
    softColor: "#FEF0D7",
    keywords: ["options", "experience", "possibility"],
  },
  8: {
    type: 8,
    name: "The Challenger",
    color: "#C92A4B",
    softColor: "#F8E3E9",
    keywords: ["autonomy", "strength", "directness"],
  },
  9: {
    type: 9,
    name: "The Peacemaker",
    color: "#739A7B",
    softColor: "#E7F0E8",
    keywords: ["harmony", "perspective", "stability"],
  },
};

export default enneagramTypes;
