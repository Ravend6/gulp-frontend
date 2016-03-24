export default class App {
  render() {
    let h1Element = document.createElement('h1');
    let msg = document.createTextNode('Gulp Frontend Start');
    h1Element.appendChild(msg);
    let app = document.querySelector('.app');
    // document.body.appendChild(h1Element);
    app.appendChild(h1Element);
  }
}
