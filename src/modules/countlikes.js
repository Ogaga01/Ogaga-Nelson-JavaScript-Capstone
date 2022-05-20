const countLike = (likesList, itemId) => {
  const itemLikes = likesList.find((l) => parseInt(l.item_id, 10) === parseInt(itemId, 10));
  let likeCount = 0;
  if (itemLikes !== undefined) {
    likeCount = itemLikes.likes;
  } else {
    likeCount = 0;
  }

  return likeCount;
};

export default countLike;