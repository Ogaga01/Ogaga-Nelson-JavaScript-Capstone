import { commentList } from '../__mocks__/fetchApi.js';
import countComments from '../modules/countComments.js';

test('count comments', () => {
  const comments = commentList();
  const count = countComments(comments);
  expect(count).toBe(1);
});