
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "./services/api";
import FormularioItem from "./components/FormularioItem";

function Detalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(false);
  const [destinatario, setDestinatario] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregarItem() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await api.get("/itens/" + id);
      setItem(resposta.data);
    } catch (erro) {
      setErro(
        erro.response?.data?.detail ||
        "Não foi possível carregar o item."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarItem();
  }, [id]);

  async function excluir() {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este item?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete("/itens/" + id);
      navigate("/");
    } catch (erro) {
      setMensagem(
        erro.response?.data?.detail || "Erro ao excluir o item."
      );
    }
  }

  async function devolver() {
    if (!destinatario.trim()) {
      setMensagem("Informe o nome de quem recebeu o objeto.");
      return;
    }

    try {
      await api.patch("/itens/" + id + "/devolver", {
        devolvido_para: destinatario
      });

      setMensagem("Item marcado como devolvido!");
      await carregarItem();
      setDestinatario("");
    } catch (erro) {
      setMensagem(
        erro.response?.data?.detail || "Erro ao devolver o item."
      );
    }
  }

  if (carregando) {
    return <p>Carregando item...</p>;
  }

  if (erro) {
    return (
      <div>
        <p className="erro">{erro}</p>
        <Link to="/">Voltar</Link>
      </div>
    );
  }

  if (!item) {
    return <p>Item não encontrado.</p>;
  }

  if (editando) {
    return (
      <div>
        <button
          className="botao-secundario"
          onClick={() => setEditando(false)}
        >
          Voltar aos detalhes
        </button>

        <FormularioItem item={item} />
      </div>
    );
  }

  return (
    <div>
      <Link to="/">← Voltar</Link>

      <div className="card-item">
        <h2>{item.nome}</h2>

        <p>
          Status: <strong>{item.status}</strong>
        </p>

        <p><strong>Descrição:</strong> {item.descricao}</p>
        <p><strong>Categoria:</strong> {item.categoria}</p>
        <p><strong>Local:</strong> {item.local}</p>
        <p>
          <strong>Encontrado em:</strong> {item.data_encontrado}
        </p>

        {item.status === "devolvido" && (
          <div>
            <p>
              <strong>Devolvido para:</strong> {item.devolvido_para}
            </p>
            <p>
              <strong>Data da devolução:</strong> {item.data_devolucao}
            </p>
          </div>
        )}

        <button onClick={() => setEditando(true)}>
          Editar
        </button>

        <button className="botao-excluir" onClick={excluir}>
          Excluir
        </button>
      </div>

      {item.status === "aguardando" && (
        <div className="card-item">
          <h3>Marcar como devolvido</h3>

          <label>Nome de quem recebeu</label>

          <input
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            placeholder="Digite o nome"
          />

          <button onClick={devolver}>
            Confirmar devolução
          </button>
        </div>
      )}

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default Detalhe;
