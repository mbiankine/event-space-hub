
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Settings, Users, Building2, CreditCard, FileSpreadsheet } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Gerenciar Usuários',
      description: 'Adicionar e editar contas de usuários',
      path: '#',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      soon: false
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      title: 'Avaliar Espaços',
      description: 'Revisar espaços pendentes',
      path: '#',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      soon: false
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: 'Configurar Pagamentos',
      description: 'Gerenciar integrações de pagamento',
      path: '/admin/stripe',
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      soon: false
    },
    {
      icon: <FileSpreadsheet className="h-5 w-5" />,
      title: 'Exportar Relatórios',
      description: 'Baixar dados em CSV ou PDF',
      path: '#',
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      soon: true
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: 'Ajustes do Sistema',
      description: 'Configurações avançadas da plataforma',
      path: '#',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      soon: true
    },
  ];

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {actions.map((action, index) => (
          <Card key={index} className="relative">
            {action.soon && (
              <span className="absolute top-2 right-2 bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-full">
                Em breve
              </span>
            )}
            <Link to={action.soon ? '#' : action.path} className={action.soon ? 'opacity-70 pointer-events-none' : ''}>
              <CardHeader className="pb-2 pt-6">
                <div className={`p-2 rounded-full w-10 h-10 flex items-center justify-center mb-2 ${action.color}`}>
                  {action.icon}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
};

export default QuickActions;
