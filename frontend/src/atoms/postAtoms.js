import { atom, atomFamily } from "recoil";

export const postsAtom = atom({
  key: "postsState",
  default: [],
});

export const postDetailFamily = atomFamily({
  key: "postDetailFamily",
  default: (postId) => ({}),
});
