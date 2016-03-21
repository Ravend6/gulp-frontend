import Post from './models/Post';
// let Post = {
//   findAll() {
//     return new Promise((resolve, reject) => {
//       resolve('ok posts');
//     });
//   }
// }

let ui = {
  renderPosts(posts) {
    console.log(posts);
  }
}

Post.findAll().then(ui.renderPosts);
