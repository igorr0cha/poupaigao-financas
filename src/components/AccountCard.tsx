
interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
  color: string;
}

interface AccountCardProps {
  account: Account;
}

export const AccountCard = ({ account }: AccountCardProps) => {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return '💳';
      case 'savings':
        return '🏦';
      case 'investment':
        return '📈';
      case 'cash':
        return '💰';
      default:
        return '💰';
    }
  };

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'checking':
        return 'Conta Corrente';
      case 'savings':
        return 'Poupança';
      case 'investment':
        return 'Investimento';
      case 'cash':
        return 'Dinheiro';
      default:
        return 'Conta';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900/30 border border-green-800/20 rounded-lg hover:shadow-md hover:shadow-green-500/10 transition-all duration-300 hover:scale-105">
      <div className="flex items-center space-x-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: account.color }}
        >
          <span className="text-lg">{getAccountIcon(account.type)}</span>
        </div>
        <div>
          <h4 className="font-medium text-white">{account.name}</h4>
          <p className="text-sm text-gray-400">{getAccountTypeName(account.type)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-green-400">
          R$ {Number(account.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};
