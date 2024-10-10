const messagesContainer = document.getElementById('messages');
const input = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const messageText = input.value.trim();
    if (messageText === '') {
        return;
    }

    // Exibe a mensagem do usuário
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user');
    userMessage.textContent = messageText;
    messagesContainer.appendChild(userMessage);

    // Limpa o campo de entrada
    input.value = '';

    // Rola o chat para a última mensagem
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Cria a mensagem do bot
    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot');

    const botText = document.createElement('span');
    botText.classList.add('bot-text');

    // Define o conteúdo HTML gerado
    botText.innerHTML = generateLoremIpsum();

    // Seleciona todos os elementos que queremos adicionar eventos
    const textElements = botText.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');

    // Adiciona event listeners a cada elemento
    textElements.forEach(function(element) {
        element.addEventListener('mouseenter', function() {
            element.style.color = '#FF5733';
        });
        element.addEventListener('mouseleave', function() {
            element.style.color = '';
        });
        element.addEventListener('click', function(event) {
            // Impede a propagação do clique
            event.stopPropagation();

            // Remove qualquer popover existente
            const existingPopover = document.querySelector('.popover');
            if (existingPopover) {
                existingPopover.remove();
            }

            // Cria o popover
            const popover = document.createElement('div');
            popover.classList.add('popover');
            popover.textContent = 'Conteúdo do Popover';

            // Adiciona o popover ao body
            document.body.appendChild(popover);

            // Posiciona o popover
            const rect = element.getBoundingClientRect();
            popover.style.left = rect.left + window.scrollX + 'px';
            popover.style.top = rect.bottom + window.scrollY + 'px';

            // Fecha o popover ao clicar fora dele
            document.addEventListener('click', function onDocClick(e) {
                if (!popover.contains(e.target)) {
                    popover.remove();
                    document.removeEventListener('click', onDocClick);
                }
            });
        });
    });

    botMessage.appendChild(botText);
    messagesContainer.appendChild(botMessage);

    // Rola o chat para a última mensagem
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
