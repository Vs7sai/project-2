import React from 'react';

const WalletPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid gap-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Available Balance</h2>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <div className="text-gray-500 text-center py-8">
              No transactions to display
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Deposit
            </button>
            <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;