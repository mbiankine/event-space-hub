
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t mt-12 bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-left">
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="text-muted-foreground hover:underline">Central de Ajuda</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">AirCover</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Combate à discriminação</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Suporte para pessoas com deficiência</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Opções de cancelamento</Link></li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-semibold mb-4">Comunidade</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="text-muted-foreground hover:underline">EventSpace.org: ajuda em crises</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Apoio a refugiados</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Combate à discriminação</Link></li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-semibold mb-4">Hospedagem</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="text-muted-foreground hover:underline">Anuncie seu espaço</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">AirCover para anfitriões</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Recursos para anfitriões</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Fórum da comunidade</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Hospedagem responsável</Link></li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-semibold mb-4">EventSpace</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="text-muted-foreground hover:underline">Newsroom</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Novos recursos</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Carreiras</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Investidores</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:underline">Cartão de presente</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm mb-4 md:mb-0 text-left">
            <span>© 2023 EventSpace, Inc.</span>
            <Link to="#" className="hover:underline">Privacidade</Link>
            <Link to="#" className="hover:underline">Termos</Link>
            <Link to="#" className="hover:underline">Mapa do site</Link>
          </div>
          <div className="flex gap-4">
            <Link to="#" className="text-sm hover:underline">Português (BR)</Link>
            <Link to="#" className="text-sm hover:underline">R$ BRL</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
