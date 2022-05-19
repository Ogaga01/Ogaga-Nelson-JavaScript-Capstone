import './styles.css';
import img from './assets/OD-image.png';
import comment from './assets/comment.png';
import heartEmpty from './assets/heart.png';

const logo = document.getElementById('logo1');
logo.src = img;

const artContainer = document.getElementById('art-container');
const artContent = document.createElement('div');

const likes = [];
let images = [];

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
    await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${appID}/likes`, {
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
  
  const imageString = images.map((img, index) =>  `
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
           <img class="comment" id="${img.id}" src="${comment}" alt="comment icon">&nbsp;<span class="comment-count">Comments</span>
           </figcaption>
         </figure>
       </article>`).join('');
  artContainer.innerHTML = imageString;
  artContainer.appendChild(artContent);
  getLikeElements();
};

window.onload = () => {
    updateLikes();
  getLikeElements()
  
  setTimeout(() => getImages(), 2000);
  ;
};
