
interface Account {
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
      default:
        return '💰';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${account.color} rounded-full flex items-center justify-center text-white`}>
          <span className="text-lg">{getAccountIcon(account.type)}</span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{account.name}</h4>
          <p className="text-sm text-gray-500 capitalize">{account.type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};
