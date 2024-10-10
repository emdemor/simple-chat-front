// Certifique-se de que a biblioteca 'faker' está incluída em seu arquivo HTML

const messagesContainer = document.getElementById('messages');
const input = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const messageText = input.value.trim();
  if (!messageText) return;

  addUserMessage(messageText);
  input.value = '';
  scrollToBottom();

  addBotMessage();
  scrollToBottom();
}

function addUserMessage(text) {
  const userMessage = document.createElement('div');
  userMessage.classList.add('message', 'user');
  userMessage.textContent = text;
  messagesContainer.appendChild(userMessage);
}

function addBotMessage() {
  const botMessage = document.createElement('div');
  botMessage.classList.add('message', 'bot');

  const botText = document.createElement('span');
  botText.classList.add('bot-text');
  botText.innerHTML = generateLoremIpsum();

  attachEventListeners(botText);

  botMessage.appendChild(botText);
  messagesContainer.appendChild(botMessage);
}

function attachEventListeners(element) {
  const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');

  textElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      el.style.color = '#FF5733';
      el.style.cursor = "pointer";
    });
    el.addEventListener('mouseleave', () => {
      el.style.color = '';
      el.style.cursor = "";
    });
    el.addEventListener('click', (event) => {
      event.stopPropagation();
      handlePopover(el);
    });
  });
}

function handlePopover(element) {
    removeExistingPopover();

    const popover = createPopover();

    const closeButton = createCloseButton(popover);

    const popoverContent = createPopoverContent();

    const form = createFeedbackForm();

    popoverContent.appendChild(form);

    popover.appendChild(closeButton);
    popover.appendChild(popoverContent);

    messagesContainer.appendChild(popover);

    positionPopover(popover, element);

    attachOutsideClickListener(popover, element);
}

function removeExistingPopover() {
    const existingPopover = messagesContainer.querySelector('.popover');
    if (existingPopover) {
        existingPopover.remove();
    }
}

function createPopover() {
    const popover = document.createElement('div');
    popover.classList.add('popover');
    return popover;
}

function createCloseButton(popover) {
    const closeButton = document.createElement('span');
    closeButton.classList.add('popover-close-button');
    closeButton.innerHTML = '&times;'; // Símbolo '×'

    closeButton.addEventListener('click', function(event) {
        event.stopPropagation();
        popover.remove();
    });

    return closeButton;
}

function createPopoverContent() {
    const popoverContent = document.createElement('div');
    popoverContent.classList.add('popover-content');
    return popoverContent;
}

function createFeedbackForm() {
    const form = document.createElement('form');
    form.classList.add('feedback-form');

    const options = [
        'Útil',
        'Não Relevante',
        'Precisa de Correção'
    ];

    options.forEach(option => {
        const label = document.createElement('label');
        label.classList.add('checkbox-label');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'feedbackOptions';
        checkbox.value = option;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(option));

        form.appendChild(label);
    });

    const textareaLabel = document.createElement('label');
    textareaLabel.classList.add('textarea-label');
    textareaLabel.textContent = 'Comentários Adicionais:';

    const textarea = document.createElement('textarea');
    textarea.name = 'additionalComments';
    textarea.rows = 3;

    textareaLabel.appendChild(textarea);
    form.appendChild(textareaLabel);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Enviar';

    form.appendChild(submitButton);

    form.addEventListener('submit', handleFormSubmit);

    return form;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const selectedOptions = [];
    const checkboxes = form.querySelectorAll('input[name="feedbackOptions"]:checked');
    checkboxes.forEach(checkbox => {
        selectedOptions.push(checkbox.value);
    });

    const textarea = form.querySelector('textarea[name="additionalComments"]');
    const additionalComments = textarea.value.trim();

    console.log('Opções Selecionadas:', selectedOptions);
    console.log('Comentários Adicionais:', additionalComments);

    form.closest('.popover').remove();
}

function positionPopover(popover, element) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = messagesContainer.getBoundingClientRect();

    const top = elementRect.bottom - containerRect.top + messagesContainer.scrollTop;
    const left = elementRect.left - containerRect.left + messagesContainer.scrollLeft;

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
}

function attachOutsideClickListener(popover, element) {
    document.addEventListener('click', function onDocClick(e) {
        if (!popover.contains(e.target) && e.target !== element) {
            popover.remove();
            document.removeEventListener('click', onDocClick);
        }
    });
}


function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateLoremIpsum() {
  const listItems = Array.from({ length: 5 }, () => `<li>${faker.lorem.sentence()}</li>`).join('');

  return `
    <h1>${faker.lorem.words(5)}</h1>
    <p>${faker.lorem.paragraph()}</p>
    <h2>${faker.lorem.words(4)}</h2>
    <ul>
      ${listItems}
    </ul>
    <h3>${faker.lorem.words(3)}</h3>
    <p>${faker.lorem.paragraph()}</p>
    <ol>
      ${listItems}
    </ol>
  `;
}
