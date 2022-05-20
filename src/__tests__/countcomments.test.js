import { commentList } from '../__mocks__/fetch-api.js';
import countComments from '../modules/countcomments.js';

test('count comments', () => {
  const comments = commentList();
  const count = countComments(comments);
  expect(count).toBe(1);
});