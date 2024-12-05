import React, { useState } from "react";
import ReactFlow, { MiniMap, Controls } from "react-flow-renderer";

const MindMap = () => {
  const [message, setMessage] = useState(""); // Estado para a mensagem do input
  const [nodes, setNodes] = useState([]); // Estado para os nodes do mapa mental
  const [edges, setEdges] = useState([]); // Estado para os edges do mapa mental
  const [nodeColor, setNodeColor] = useState("#000000");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();

      // Converte a resposta para nodes e edges para o ReactFlow
      const { nodes: parsedNodes, edges: parsedEdges } =
        convertResponseToNodesAndEdges(data.response);

      // Atualiza os estados de nodes e edges
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
    }
  };

  // Função para converter a resposta da API em nodes
  const convertResponseToNodes = (response) => {
    // Supondo que a resposta seja uma string com tópicos organizados de alguma forma,
    // você pode fazer uma divisão e criar mais nodes dinamicamente.

    const topics = response.split("\n## "); // Exemplo de separação por tópicos
    const newNodes = [];
    let yOffset = 0;

    topics.forEach((topic, index) => {
      const node = {
        id: `${index + 1}`, // Identificador único para cada node
        data: { label: topic.trim() }, // O conteúdo do tópico como label
        position: { x: 150, y: yOffset }, // Posições no eixo Y vão se distanciando
        style: { border: "1px solid " + nodeColor, padding: "10px" },
      };
      newNodes.push(node);
      yOffset += 150; // Ajuste do espaçamento entre os nodes
    });

    return newNodes;
  };

  // Função para converter a resposta da API em edges
  // Função para converter a resposta em nodes e edges
  // Função para converter a resposta em nodes e edges
  const convertResponseToNodesAndEdges = (response) => {
    const lines = response.split("\n");

    const nodes = [];
    const edges = [];
    let nodeId = 1; // Identificador único para cada node
    let parentNode = null; // Variável para armazenar o nó pai
    let xOffset = 250; // Posição inicial no eixo x (horizontal)
    let yOffset = 100; // Posição inicial no eixo y (vertical)

    lines.forEach((line, index) => {
      line = line.trim();

      // Verifica o tipo de título (título, subtítulo, etc.)
      if (line.startsWith("# ")) {
        // Nó de nível 1 (Título principal)
        nodes.push({
          id: String(nodeId),
          data: { label: line.replace("# ", "") },
          position: { x: xOffset, y: yOffset },
          style: {
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            backgroundColor: "black",
            color: "white",
          }, // Título preto
        });
        parentNode = nodeId; // Atualiza o nó pai
        yOffset += 150; // Desloca no eixo Y para o próximo nível
        nodeId++;
      } else if (line.startsWith("## ")) {
        // Nó de nível 2 (Subtítulo)
        nodes.push({
          id: String(nodeId),
          data: { label: line.replace("## ", "") },
          position: { x: xOffset + 250, y: yOffset }, // Desloca para a direita
          style: { backgroundColor: nodeColor, stroke: nodeColor }, // Subtítulo com fundo claro
        });
        if (parentNode) {
          edges.push({
            id: `e${parentNode}-${nodeId}`,
            source: String(parentNode),
            target: String(nodeId),
            style: { backgroundColor: nodeColor, stroke: nodeColor },
          });
        }
        parentNode = nodeId; // Atualiza o nó pai
        yOffset += 150; // Aumenta a distância vertical
        nodeId++;
      } else if (line.startsWith("### ")) {
        // Nó de nível 3 (Subtítulo de nível inferior)
        nodes.push({
          id: String(nodeId),
          data: { label: line.replace("### ", "") },
          position: { x: xOffset + 500, y: yOffset }, // Desloca mais à direita
          style: { backgroundColor: { nodeColor }, color: { nodeColor } }, // Subtítulo de nível inferior
        });
        if (parentNode) {
          edges.push({
            id: `e${parentNode}-${nodeId}`,
            source: String(parentNode),
            target: String(nodeId),
            style: { stroke: nodeColor },
          });
        }
        yOffset += 150; // Aumenta a distância vertical
        nodeId++;
      }
    });

    return { nodes, edges };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Crie um Mapa Mental</h1>

      {/* Formulário para digitar a mensagem */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Atualiza o valor do input
          placeholder="Digite sua mensagem"
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Gerar Mapa Mental
        </button>
      </form>

      {/* Seletor de cor para o título e bordas */}
      <div style={{ marginTop: "20px" }}>
        <label htmlFor="colorPicker">Escolha a cor do título: </label>
        <input
          id="colorPicker"
          type="color"
          value={nodeColor}
          onChange={(e) => setNodeColor(e.target.value)} // Atualiza a cor
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* Renderiza o mapa mental com o ReactFlow */}
      <div style={{ height: "80vh", width: "100%", marginTop: "20px" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          zoomOnScroll={true}
          zoomOnPinch={true}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default MindMap;
