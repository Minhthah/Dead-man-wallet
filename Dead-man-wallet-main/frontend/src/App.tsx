import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';
import { PACKAGE_ID, MODULE_NAME } from './constants';
import logo from './assets/logo.png'; 

function App() {
  const account = useCurrentAccount();
  
  // Hook ký giao dịch mới
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [lawyerAddr, setLawyerAddr] = useState('');
  const [amount, setAmount] = useState('');
  const [willIdToApprove, setWillIdToApprove] = useState('');

  const createWill = () => {
    if (!account || !lawyerAddr || !amount) return;

    // Tạo Transaction
    const txb = new Transaction();
    
    // Chuyển SUI sang MIST (1 SUI = 1 Tỷ MIST)
    const amountInMist = BigInt(parseFloat(amount) * 1_000_000_000);
    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(amountInMist)]);

    const beneficiaries = ["0x123...con", "0x456...bame", "0x789...nguoiyeu"];
    const percentages = [50, 30, 20];
    const unlockTime = Date.now() + 5 * 60 * 1000;

    txb.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_will`,
      arguments: [
        txb.pure.address(lawyerAddr),
        txb.pure.vector("address", beneficiaries),
        txb.pure.vector("u64", percentages),
        txb.pure.u64(unlockTime),
        coin
      ],
    });

    // 🛠️ FIX QUAN TRỌNG: Thêm 'as any' vào txb để tránh lỗi xung đột thư viện
    signAndExecute({ transaction: txb as any }, {
      onSuccess: (result: any) => {
        alert("✅ Tạo di chúc thành công! Vui lòng copy Object ID gửi cho Luật sư.");
        console.log("Tx Digest:", result.digest);
      },
      onError: (err: any) => alert("❌ Lỗi: " + err.message),
    });
  };

  const approveWill = () => {
    if (!willIdToApprove) return;
    const txb = new Transaction();

    txb.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::approve_will`,
      arguments: [txb.object(willIdToApprove)],
    });

    // 🛠️ FIX QUAN TRỌNG: Thêm 'as any' ở đây nữa
    signAndExecute({ transaction: txb as any }, {
      onSuccess: (result: any) => {
        alert("✅ Đã ký duyệt hồ sơ thành công!");
        console.log("Approved Digest:", result.digest);
      },
      onError: (err: any) => alert("❌ Lỗi: Bạn không phải luật sư của hồ sơ này! " + err.message),
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      <div className="max-w-2xl mx-auto">
        
        <header className="flex justify-between items-center mb-10 bg-gray-800 p-4 rounded-2xl shadow-lg border border-purple-500/30">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-16 h-16 rounded-xl border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-transform group-hover:scale-110" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                DEAD MAN WALLET
              </h1>
              <p className="text-xs text-gray-400">Powered by Sui Blockchain</p>
            </div>
          </div>
          <ConnectButton />
        </header>

        {!account ? (
          <div className="text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
            <img src={logo} className="w-24 h-24 mx-auto mb-4 opacity-50 grayscale" alt="Logo grayscale" />
            <h2 className="text-xl text-gray-300">Vui lòng kết nối ví để tiếp tục</h2>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Form User */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <span>📝</span> Tạo Di chúc (User)
              </h2>
              <div className="space-y-4">
                <input 
                  className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:border-green-500 outline-none transition"
                  placeholder="Nhập địa chỉ ví Luật sư..."
                  value={lawyerAddr}
                  onChange={(e) => setLawyerAddr(e.target.value)}
                />
                <input 
                  className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:border-green-500 outline-none transition"
                  type="number"
                  placeholder="Số SUI muốn để lại (VD: 0.5)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="p-3 bg-gray-700/50 rounded text-sm text-gray-300 border border-gray-600/50">
                  <p className="font-semibold text-gray-400 mb-2">Tỷ lệ phân chia mặc định:</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-600 p-2 rounded">Con<br/><span className="text-green-400 font-bold">50%</span></div>
                    <div className="bg-gray-600 p-2 rounded">Ba Mẹ<br/><span className="text-yellow-400 font-bold">30%</span></div>
                    <div className="bg-gray-600 p-2 rounded">Ny<br/><span className="text-pink-400 font-bold">20%</span></div>
                  </div>
                </div>
                <button 
                  onClick={createWill}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 py-3 rounded-lg font-bold transition shadow-lg transform active:scale-95"
                >
                  Tạo & Gửi hồ sơ
                </button>
              </div>
            </div>

            {/* Form Lawyer */}
            <div className="bg-gray-800 p-6 rounded-xl border border-blue-900/50 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-6xl">⚖️</span>
              </div>
              <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                <span>⚖️</span> Khu vực Luật sư (Lawyer)
              </h2>
              <div className="space-y-4 relative z-10">
                <p className="text-sm text-gray-400">Nhập ID hồ sơ để xác thực danh tính và phê duyệt.</p>
                <input 
                  className="w-full p-3 bg-gray-700 rounded text-white border border-blue-500/30 focus:border-blue-500 outline-none transition"
                  placeholder="Nhập Object ID của Di chúc..."
                  value={willIdToApprove}
                  onChange={(e) => setWillIdToApprove(e.target.value)}
                />
                <button 
                  onClick={approveWill}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 py-3 rounded-lg font-bold transition shadow-lg transform active:scale-95"
                >
                  🖋️ Ký Duyệt Hồ Sơ
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;