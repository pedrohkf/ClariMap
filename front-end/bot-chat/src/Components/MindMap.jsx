import ReactFlow from "react-flow-renderer";

const nodes = [
  { id: "1", data: { label: "História da Ferrari" }, position: { x: 250, y: 50 } },
  { id: "2", data: { label: "Fundação e Início" }, position: { x: 250, y: 150 } },
  { id: "3", data: { label: "Enzo Ferrari" }, position: { x: 450, y: 250 } },
  { id: "4", data: { label: "Primeiros anos de corridas" }, position: { x: 450, y: 350 } },
  { id: "5", data: { label: "Desenvolvimento de motores" }, position: { x: 450, y: 450 } },
  { id: "6", data: { label: "Vitórias em corridas" }, position: { x: 450, y: 550 } },
];

const edges = [
  { id: "e1", source: "1", target: "2" },
  { id: "e2", source: "2", target: "3" },
  { id: "e3", source: "2", target: "4" },
  { id: "e4", source: "2", target: "5" },
  { id: "e5", source: "2", target: "6" },
];

const MindMap = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
};

export default MindMap;
