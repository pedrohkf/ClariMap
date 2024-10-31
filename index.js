import express, { response } from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Middleware para permitir o uso de JSON no corpo das requisições
app.use(express.json()); // Certifique-se de que isso está no topo

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    console.log('Mensagem recebida:', req.body.message); // Log para depuração

    // Validação básica para garantir que a mensagem não esteja vazia
    if (!req.body.message) {
        return res.status(400).json({ error: 'Mensagem não pode estar vazia' });
    }

    const userMessage = req.body.message;

    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "user", "content": `Utilize a seguinte estrutura:

                    O título principal deve ser precedido por #.

                    Tópicos principais devem ser precedidos por ##, no minimo 6 tópicos.
                    
                    Subtópicos e listas devem ser precedidos por - para listas não ordenadas, com no minimo 5 palavras gerando uma frase.
                    
                    faça um codigo Markmap sobre ${userMessage}
                    
                    exemplo de um tema simples,  mas gere codigos maiores e mais afundo noas temas. Faça uma pesquisa profunda como se você fosse professor e está dando aula com mapas mentais. 
                    Aqui está o mapa mental sobre primeiros carros do Brasil:

# História dos Carros no Brasil

## Início da História
### Importações
- Carros franceses, italianos e americanos se tornam populares no país
- Marcações governamentais incentivam a importação de carros

## Autos do início do século XX
### Modelo T de Ford
- Primeiro carro a ser produzido em larga escala no Brasil
- Inovação tecnológica e design revolucionário
- Vendas rápidas, tornando-se um sucesso entre os brasileiros
- Modelo T revoluciona a indústria automobilística no país

### Alemães e italianos entraram no mercado
- Carros alemães, como o Mercedes-Benz, e italianos, como o Fiat, começam a ser importados
- Marcações governamentais incentivam a competição entre fabricantes
- Primeiros concorrentes diretos do Modelo T de Ford

## Automobilismo Esportivo
### Primeiros Rallys
- Autos especiais são criados para competir em rallys e corridas
- Pilotos brasileiros começam a participar de competições internacionais
- Período de boom para o automobilismo esportivo no Brasil

### Primeiros Corridas no Brasil
- Primeiras corridas ocorrem no país, levando ao estabelecimento de circuitos
- Motores e chassis são desenvolvidos locamente
- Competições se tornam cada vez mais populares entre os brasileiros

## Influência do Automobilismo no Brasil
### Impacto na Economia
- Indústria automobilística começa a se estabelecer no país
- Criação de empregos e desenvolvimento de infraestrutura
- Carros se tornam símbolo de status e prestígio

### Impacto na Cultura
- Carros se tornam uma parte integral da cultura popular brasileira
- Mulheres começam a dirigir, mudando a sociedade
- Carros se tornam sinônimo de liberdade e modernidade

Vale lembrar que essas informações são uma síntese de conhecimento e podem ser atualizadas ou completadas com novas informações.
`

                }
            ],
            "model": "llama3-8b-8192",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });

        // Retorna a resposta da IA como JSON
        const responseContent = chatCompletion.choices[0]?.message.content || 'Sem resposta';
        console.log({ response: responseContent });
        res.json({ response: responseContent });
        console.log('Mensagem enviada para IA:', userMessage);
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error); // Log detalhado do erro
        res.status(500).json({ error: 'Erro ao processar a solicitação' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log('Chave da API:', process.env.GROQ_API_KEY ? 'Carregada' : 'Não carregada');
    console.log(`Servidor rodando em http://localhost:${port}`);
});
