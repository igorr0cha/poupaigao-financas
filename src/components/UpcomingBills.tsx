
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Clock } from "lucide-react";

export const UpcomingBills = () => {
  const bills = [
    {
      name: "Cartão de Crédito",
      amount: 1250.30,
      dueDate: "2024-01-15",
      status: "overdue",
      category: "Crédito"
    },
    {
      name: "Aluguel",
      amount: 800.00,
      dueDate: "2024-01-10",
      status: "due-soon",
      category: "Moradia"
    },
    {
      name: "Internet",
      amount: 89.90,
      dueDate: "2024-01-20",
      status: "upcoming",
      category: "Utilidades"
    },
    {
      name: "Academia",
      amount: 79.90,
      dueDate: "2024-01-25",
      status: "upcoming",
      category: "Saúde"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'destructive';
      case 'due-soon':
        return 'default';
      case 'upcoming':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'Vencido';
      case 'due-soon':
        return 'Vence em breve';
      case 'upcoming':
        return 'Próximo';
      default:
        return 'Pendente';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      case 'due-soon':
        return <Clock className="w-4 h-4" />;
      case 'upcoming':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
          Contas a Vencer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bills.map((bill, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900">{bill.name}</h4>
                <Badge variant={getStatusColor(bill.status)} className="text-xs">
                  {getStatusIcon(bill.status)}
                  <span className="ml-1">{getStatusText(bill.status)}</span>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{bill.category}</span>
                <span className="text-lg font-semibold text-gray-900">
                  R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Vencimento: {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-600">Total a pagar:</span>
            <span className="text-red-600 text-lg">
              R$ {bills.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
