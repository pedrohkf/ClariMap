document.getElementById('sendButton').addEventListener('click', async () => {
    const userMessage = document.getElementById('userInput').value;

    const resposta = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: `userMessage` })
    });

    const dados = await resposta.json();
    document.getElementById('resultado').innerText = dados.response; // Exibe a resposta no HTML
});
