export type CommentsType = {
  owner: string;
  text: string;
  numberLikes: string;
  answers?: CommentsType[];
};
