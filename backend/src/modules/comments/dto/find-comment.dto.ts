export class FindCommentDto {
  limit?: number = 10;
  page?: number = 1;
  depth?: number = 0;
  repliesPerLevel?: number = 3;
}
