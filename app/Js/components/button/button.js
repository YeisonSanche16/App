/* global components */
const template = components.templates;
class Button {
  constructor(node, title, icon) {
    this.node = node;
    this.name = 'oe';
    this.node.innerHtml = template({
      title,
      icon,
    });
  }

  print() {
    return console.log(this.name);
  }
}

export default Button;
