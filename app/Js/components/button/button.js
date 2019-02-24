/* global components */
const template = components.templates;

class Button {
  constructor(node, title, icon) {
    this.node = node;
    this.node.innerHtml = template({
      title,
      icon,
    });
  }
}

export default Button;
