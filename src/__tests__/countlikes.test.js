import likesList from '../__mocks__/fetchAPI.js';
import countLike from '../modules/countlikes.js'

test('count likes for certain item', () => {
  const likes = likesList();
  const itemId = '113436';
  const count = countLike(likes, itemId);
  expect(count).toBe(8);
});