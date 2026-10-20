
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./services/api";

function Inicio() {
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarItens() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await api.get("/itens");
        const dados = resposta.data;

        if (Array.isArray(dados)) {
          setItens(dados);
        } else {
          setItens(dados.itens || []);
        }
      } catch (erro) {
        setErro(
          erro.response?.data?.detail ||
          "Erro ao carregar os itens. Verifique sua chave da API."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarItens();
  }, []);

  const categorias = [
    ...new Set(itens.map((item) => item.categoria).filter(Boolean))
  ];

  const locais = [
    ...new Set(itens.map((item) => item.local).filter(Boolean))
  ];

  const itensFiltrados = itens.filter((item) => {
    const texto = busca.toLowerCase();

    const combinaBusca =
      (item.nome || "").toLowerCase().includes(texto) ||
      (item.descricao || "").toLowerCase().includes(texto);

    const combinaStatus = !status || item.status === status;
    const combinaCategoria =
      !categoria || item.categoria === categoria;
    const combinaLocal = !local || item.local === local;

    return (
      combinaBusca &&
      combinaStatus &&
      combinaCategoria &&
      combinaLocal
    );
  });

  return (
    <div>
      <div className="titulo-pagina">
        <h2>Itens encontrados</h2>

        <Link to="/novo" className="botao-link">
          + Novo item
        </Link>
      </div>

      <input
        placeholder="Buscar por nome ou descrição..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="filtros">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="aguardando">Aguardando</option>
          <option value="devolvido">Devolvido</option>
        </select>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Todas as categorias</option>

          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        >
          <option value="">Todos os locais</option>

          {locais.map((lugar) => (
            <option key={lugar} value={lugar}>
              {lugar}
            </option>
          ))}
        </select>
      </div>

      {carregando && <p>Carregando itens...</p>}

      {erro && <p className="erro">{erro}</p>}

      {!carregando && !erro && itensFiltrados.length === 0 && (
        <p>Nenhum item encontrado.</p>
      )}

      {!carregando && !erro && (
        <div className="lista">
          {itensFiltrados.map((item) => (
            <div className="card-item" key={item.id}>
              <h3>{item.nome}</h3>

              <p>{item.descricao}</p>
              <p>Categoria: {item.categoria}</p>
              <p>Local: {item.local}</p>
              <p>Status: <strong>{item.status}</strong></p>

              <Link to={"/item/" + item.id}>
                Ver detalhes
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inicio;
