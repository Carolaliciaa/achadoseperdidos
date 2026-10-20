
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function FormularioItem({ item }) {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");
  const [data, setData] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const respostaCategorias = await api.get("/categorias");
        const respostaLocais = await api.get("/locais");

        const dadosCategorias = respostaCategorias.data;
        const dadosLocais = respostaLocais.data;

        setCategorias(
          Array.isArray(dadosCategorias)
            ? dadosCategorias
            : dadosCategorias.categorias || []
        );

        setLocais(
          Array.isArray(dadosLocais)
            ? dadosLocais
            : dadosLocais.locais || []
        );
      } catch (erro) {
        setMensagem("Erro ao carregar categorias e locais.");
      }
    }

    carregarOpcoes();
  }, []);

  useEffect(() => {
    if (item) {
      setNome(item.nome || "");
      setDescricao(item.descricao || "");
      setCategoria(item.categoria || "");
      setLocal(item.local || "");
      setData(item.data_encontrado || "");
    }
  }, [item]);

  async function salvar(evento) {
    evento.preventDefault();
    setMensagem("");

    const dados = {
      nome: nome,
      descricao: descricao,
      categoria: categoria,
      local: local,
      data_encontrado: data
    };

    try {
      if (item) {
        await api.put("/itens/" + item.id, dados);
      } else {
        await api.post("/itens", dados);
      }

      navigate("/");
    } catch (erro) {
      setMensagem(
        erro.response?.data?.detail || "Erro ao salvar o item."
      );
    }
  }

  return (
    <div>
      <h2>{item ? "Editar item" : "Novo item"}</h2>

      <form onSubmit={salvar}>
        <label>Nome do objeto</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <label>Categoria</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="">Escolha uma categoria</option>

          {categorias.map((cat, index) => {
            const valor = typeof cat === "string"
              ? cat
              : cat.nome || cat.categoria || cat.id;

            return (
              <option key={index} value={valor}>
                {valor}
              </option>
            );
          })}
        </select>

        <label>Local onde foi encontrado</label>
        <select
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          required
        >
          <option value="">Escolha um local</option>

          {locais.map((lugar, index) => {
            const valor = typeof lugar === "string"
              ? lugar
              : lugar.nome || lugar.local || lugar.id;

            return (
              <option key={index} value={valor}>
                {valor}
              </option>
            );
          })}
        </select>

        <label>Data em que foi encontrado</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />

        {mensagem && <p className="erro">{mensagem}</p>}

        <button type="submit">Salvar</button>

        <button
          type="button"
          className="botao-secundario"
          onClick={() => navigate("/")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default FormularioItem;
