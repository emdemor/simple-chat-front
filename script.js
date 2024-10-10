// Certifique-se de que a biblioteca 'faker' está incluída em seu arquivo HTML
// <script src="https://cdn.jsdelivr.net/npm/@faker-js/faker/dist/faker.min.js"></script>

const messagesContainer = document.getElementById('messages');
const input = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Event Listener para o botão de enviar
sendButton.addEventListener('click', sendMessage);

// Event Listener para a tecla 'Enter' no campo de entrada
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Função principal para enviar a mensagem
function sendMessage() {
  const messageText = input.value.trim();
  if (!messageText) return;

  addUserMessage(messageText);
  input.value = '';
  scrollToBottom();

  addBotMessage();
  scrollToBottom();
}

// Função para adicionar a mensagem do usuário ao chat
function addUserMessage(text) {
  const userMessage = document.createElement('div');
  userMessage.classList.add('message', 'user');
  userMessage.textContent = text;
  messagesContainer.appendChild(userMessage);
}

// Função para adicionar a mensagem do bot ao chat
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

// Função para anexar event listeners aos elementos de texto
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
    // Remove qualquer popover existente
    const existingPopover = messagesContainer.querySelector('.popover');
    if (existingPopover) {
        existingPopover.remove();
    }

    // Cria o novo popover
    const popover = document.createElement('div');
    popover.classList.add('popover');

    // Cria o botão de fechamento
    const closeButton = document.createElement('span');
    closeButton.classList.add('popover-close-button');
    closeButton.innerHTML = '&times;'; // Símbolo '×'

    // Adiciona o event listener ao botão de fechamento
    closeButton.addEventListener('click', function(event) {
        event.stopPropagation();
        popover.remove();
    });

    // Cria o conteúdo do popover
    const popoverContent = document.createElement('div');
    popoverContent.classList.add('popover-content');

    // Cria o formulário de avaliação
    const form = document.createElement('form');
    form.classList.add('feedback-form');

    // Adiciona checkboxes com opções predefinidas
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

    // Adiciona um campo de texto para comentários adicionais
    const textareaLabel = document.createElement('label');
    textareaLabel.classList.add('textarea-label');
    textareaLabel.textContent = 'Comentários Adicionais:';

    const textarea = document.createElement('textarea');
    textarea.name = 'additionalComments';
    textarea.rows = 3;

    textareaLabel.appendChild(textarea);
    form.appendChild(textareaLabel);

    // Adiciona um botão de envio
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Enviar';

    form.appendChild(submitButton);

    // Manipula o envio do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Coleta as opções selecionadas
        const selectedOptions = [];
        const checkboxes = form.querySelectorAll('input[name="feedbackOptions"]:checked');
        checkboxes.forEach(checkbox => {
            selectedOptions.push(checkbox.value);
        });

        // Obtém os comentários adicionais
        const additionalComments = textarea.value.trim();

        // Processa os dados conforme necessário (por exemplo, enviar para um servidor)
        console.log('Opções Selecionadas:', selectedOptions);
        console.log('Comentários Adicionais:', additionalComments);

        // Fecha o popover
        popover.remove();
    });

    // Adiciona o formulário ao conteúdo do popover
    popoverContent.appendChild(form);

    // Adiciona o botão de fechamento e o conteúdo ao popover
    popover.appendChild(closeButton);
    popover.appendChild(popoverContent);

    // Anexa o popover ao messagesContainer
    messagesContainer.appendChild(popover);

    // Calcula a posição do elemento clicado em relação ao contêiner
    const elementRect = element.getBoundingClientRect();
    const containerRect = messagesContainer.getBoundingClientRect();

    const top = elementRect.bottom - containerRect.top + messagesContainer.scrollTop;
    const left = elementRect.left - containerRect.left + messagesContainer.scrollLeft;

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;

    // Fecha o popover ao clicar fora dele
    document.addEventListener('click', function onDocClick(e) {
        if (!popover.contains(e.target) && e.target !== element) {
            popover.remove();
            document.removeEventListener('click', onDocClick);
        }
    });
}


// Função para rolar o chat até a última mensagem
function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Função para gerar conteúdo Lorem Ipsum
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
