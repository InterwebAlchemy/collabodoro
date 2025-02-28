import Haikunator from "haikunator";

import { ADJECTIVES, NOUNS } from "../constants/slugs";

const haikunator = new Haikunator({
  adjectives: ADJECTIVES,
  nouns: NOUNS,
  defaults: {
    delimiter: "-",
    tokenLength: 4,
    tokenChars: "0123456789",
  },
});

export const generateSlug = () => {
  return haikunator.haikunate();
};
