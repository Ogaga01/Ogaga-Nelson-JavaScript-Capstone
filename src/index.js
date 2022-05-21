import './styles.css';
import img from './assets/OD-image.png';
import heartEmpty from './assets/heart.png';

const logo = document.getElementById('logo1');
logo.src = img;

const artContainer = document.getElementById('art-container');
const artContent = document.createElement('div');
const popupContainer = document.querySelector('.bg-popup');
const commentForm = document.querySelector('form');
const messageContainer = document.querySelector('.message');
const commentsCounterParagraph = document.querySelector('.comments-counter');
const grab = (e) => document.getElementById(e);

const likes = [];
let images = [];

const message = (text) => {
  messageContainer.innerHTML = text;
  setTimeout(() => {
    messageContainer.innerHTML = '';
  }, 2000);
};

const renderComment = (arr) => {
  const commentContainer = document.querySelector('.comments-container');
  commentContainer.innerHTML = '';
  if (Array.isArray(arr)) {
    arr.forEach((item) => {
      commentContainer.innerHTML += `
      <span class="bg-blue-400 p-2 mt-3 text-lg text-white mr-0">${item.creation_date}</span>
      <span class="bg-blue-500 p-2 mt-3 text-lg text-white">${item.username}:</span>
      <span class="p-2 mt-3 text-lg">${item.comment}</span>
      <br>
      <br>`;
    });
  }
};

const fetchComments = async (id) => {
  await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/Km2IRmmIjbL7vNKDRpvP/comments?item_id=${id}`)
    .then((response) => response.json())
    .then((data) => {
      // if(data.status)
      if (data.length > 0) {
        commentsCounterParagraph.innerHTML = `Comment (${data.length})`;
      } else if (data.error.status === 400) {
        commentsCounterParagraph.innerHTML = 'Comment (0)';
      } else {
        commentsCounterParagraph.innerHTML = data.error;
      }

      renderComment(data);
    });
};

const createNewComment = async (newObject, itemId = null) => {
  const appID = 'Km2IRmmIjbL7vNKDRpvP';
  await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${appID}/comments/`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; Charset=UTF-8',
    },
    body: JSON.stringify(newObject),
  })
    .then((response) => {
      if (response.status === 201) {
        message('Comment successfully added.');
        fetchComments(itemId);
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};
const handleCommentForm = (itemId) => {
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = grab('name');
    const comment = grab('comment');

    if (name.value && comment.value !== '') {
      const newComment = {
        item_id: itemId,
        username: name.value,
        comment: comment.value,
      };
      createNewComment(newComment, itemId);
      name.value = '';
      comment.value = '';
    } else {
      message('please fill all fields');
    }
  });
};
const openPopup = (images) => {
  const trigger = document.querySelectorAll('.comment');
  trigger.forEach((element, index) => {
    element.addEventListener('click', () => {
      popupContainer.classList.remove('hidden');

      images.forEach(async (img, imgIndex) => {
        if (imgIndex === index) {
          grab('popup-image').src = `https://www.artic.edu/iiif/2/${img.image_id}/full/843,/0/default.jpg`;
          const cardDetails = document.querySelector('.details-container');
          const details = ` <h2 class="title">${img.title},
       ${img.date}</h2>
     <h3 class="artist">${img.artist}</h3>`;
          cardDetails.innerHTML = details;

          fetchComments(img.id);
          handleCommentForm(img.id);
        }
      });
    });
  });
};

const closePopup = () => {
  const closeButton = grab('closeIcon');
  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    popupContainer.classList.add('hidden');
  });
};
const updateLikes = async () => {
  const appID = 'NY2YXaf6kAE8tAIQDCPo';
  await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${appID}/likes`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((article) => {
        likes.push(article.likes);
      });
    });
};

const like = async (id) => {
  const appID = 'NY2YXaf6kAE8tAIQDCPo';
  await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${appID}/likes/`, {
    method: 'Post',
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      item_id: id,
    }),
  }).then(() => {
    updateLikes();
  });
};

const getLikeElements = () => {
  const hearts = document.querySelectorAll('.like');
  const likeCounter = document.querySelectorAll('.like-count');
  hearts.forEach((heart, index) => {
    let counter = 0;
    heart.addEventListener('click', (e) => {
      e.preventDefault();
      like(images[index].id);
      counter += 1;
      likeCounter[index].innerHTML = `${likes[index] + counter} Likes`;
    });
  });
};

const baseUrl = 'https://api.artic.edu/api/v1/artworks?limit=15';
const getImages = async () => {
  const response = await fetch(baseUrl);
  const data = await response.json();
  images = data.data;
  images = images.map((image) => ({
    id: image.id,
    image_id: image.image_id,
    title: image.title,
    date: image.date_start,
    artist: image.artist_title,
  })).filter((image) => image.image_id !== null && image.artist !== null);

  const paintCounter = document.querySelector('.paint-counter');
  paintCounter.innerHTML = images.length;
  const imageString = images.map((img, index) => `
  <article class="article-style">
   <img class="image-style" src="https://www.artic.edu/iiif/2/${img.image_id}/full/843,/0/default.jpg"
       alt="image of artwork">
     <h2 class="title">${img.title},
       ${img.date}</h2>
     <h3 class="artist">${img.artist}</h3>
    
     <figure class="caption-container">
       <figcaption class="caption-content">
         <img class="like" id="${img.id}" src="${heartEmpty}" alt="like icon">&nbsp;
           <span class="like-count">
           ${likes[index]} Likes
           </span>
           <button class="comment" id="${img.id}" class="comment-count" type="button">Comments</button>
           </figcaption>
         </figure>
       </article>`).join('');
  artContainer.innerHTML = imageString;
  artContainer.appendChild(artContent);

  openPopup(images);
  closePopup();
  getLikeElements();
};

window.onload = () => {
//   getLikeElements();
  updateLikes();
  setTimeout(() => getImages(), 2000);
};