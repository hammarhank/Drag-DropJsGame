class HelpDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.getElementById('dialog-template');
    const templateContent = template.content.cloneNode(true);
    this.shadowRoot.appendChild(templateContent);

    this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => {
      console.log(this.title);
      if (this.title === "Congratulations!") {

        location.reload(); // Reload the page Bug. dont work
      } else {
        this.hide(); // Just hide the dialog for other cases
      }
    });
  }

  set title(newTitle) {
    this.shadowRoot.querySelector('h2').textContent = newTitle;
  }

  set content(newContent) {
    const contentContainer = this.shadowRoot.querySelector('p');
    contentContainer.innerHTML = ''; // Clear previous content
    newContent.split("\n\n").forEach(paragraphText => {
      const paragraph = document.createElement('p');
      paragraph.textContent = paragraphText;
      contentContainer.appendChild(paragraph);
    });
  }

  show() {
    this.style.display = 'flex';

  }

  hide() {
    this.style.display = 'none';
  }
}
customElements.define('help-dialog', HelpDialog);