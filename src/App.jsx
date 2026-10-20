
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams
} from "react-router-dom";

import api from "./services/api";
import Cabecalho from "./components/Cabecalho";
import FormularioItem from "./components/FormularioItem";
import Inicio from "./Inicio";
import Detalhe from "./Detalhe";

function EditarItem() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarItem() {
      try {
        const resposta = await api.get("/itens/" + id);
        setItem(resposta.data);
      } catch (erro) {
        setErro(
          erro.response?.data?.detail ||
          "Erro ao carregar o item."
        );
      }
    }

    carregarItem();
  }, [id]);

  if (erro) return <p className="erro">{erro}</p>;
  if (!item) return <p>Carregando item...</p>;

  return <FormularioItem item={item} />;
}

function App() {
  const [aluno, setAluno] = useState("");

  useEffect(() => {
    async function carregarAluno() {
      try {
        const resposta = await api.get("/eu");
        setAluno(resposta.data.nome || "Aluno");
      } catch (erro) {
        setAluno("Aluno");
      }
    }

    carregarAluno();
  }, []);

  return (
    <BrowserRouter>
      <Cabecalho aluno={aluno} />

      <main className="container">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/novo" element={<FormularioItem />} />
          <Route path="/item/:id" element={<Detalhe />} />
          <Route path="/editar/:id" element={<EditarItem />} />
          <Route
            path="*"
            element={<p>Página não encontrada.</p>}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
