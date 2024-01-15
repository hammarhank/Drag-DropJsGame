class CongratsDialog extends HTMLElement {
    constructor() {
      super();
  
      // Attach a shadow DOM tree to the instance
      this.attachShadow({ mode: 'open' });
  
      // Clone the template and append it to the shadow DOM
      const template = document.getElementById('dialog-template');
      const templateContent = template.content.cloneNode(true);
      this.shadowRoot.appendChild(templateContent);
  
      // Bind the close button
      this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => {
        this.hide();
      });
    }
  
    // Function to show the dialog
    show() {
      this.style.display = 'flex';
    }
  
    // Function to hide the dialog
    hide() {
      this.style.display = 'none';
    }
  }
  
  // Define the new element
  customElements.define('congrats-dialog', CongratsDialog);