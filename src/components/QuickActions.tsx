
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ArrowLeftRight, Target, CreditCard, PieChart } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      title: "Adicionar Receita",
      description: "Registrar um novo ganho",
      icon: Plus,
      color: "bg-green-500 hover:bg-green-600",
      action: () => console.log("Add income")
    },
    {
      title: "Registrar Despesa",
      description: "Anotar um novo gasto",
      icon: Minus,
      color: "bg-red-500 hover:bg-red-600",
      action: () => console.log("Add expense")
    },
    {
      title: "Transferência",
      description: "Entre contas próprias",
      icon: ArrowLeftRight,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => console.log("Transfer")
    },
    {
      title: "Nova Meta",
      description: "Criar objetivo financeiro",
      icon: Target,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => console.log("New goal")
    },
    {
      title: "Adicionar Conta",
      description: "Cadastrar nova conta",
      icon: CreditCard,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => console.log("Add account")
    },
    {
      title: "Ver Relatórios",
      description: "Análises detalhadas",
      icon: PieChart,
      color: "bg-indigo-500 hover:bg-indigo-600",
      action: () => console.log("View reports")
    }
  ];

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all border-green-800/30 text-gray-300 hover:text-white hover:bg-white/10 bg-gray-900/30"
              onClick={action.action}
            >
              <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center transition-transform hover:scale-110`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-gray-400">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
