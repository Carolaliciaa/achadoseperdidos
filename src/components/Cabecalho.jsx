
import { Link } from "react-router-dom";

function Cabecalho({ aluno }) {
  return (
    <header className="cabecalho">
      <Link to="/" className="logo">
        Achados e Perdidos IFRN
      </Link>

      <p>Olá, {aluno || "Aluno"}!</p>
    </header>
  );
}

export default Cabecalho;
