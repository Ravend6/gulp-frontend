export default class Post {
  static findAll() {
    return new Promise((resolve, reject) => {
      resolve('ok posts!');
    });
  }
}
