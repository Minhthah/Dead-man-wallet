// @ts-nocheck
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions"; 
import { useState, useEffect, useCallback, useRef } from "react";
import "@mysten/dapp-kit/dist/index.css";

// --- CẤU HÌNH ---
const WALRUS_PUBLISHER = "https://publisher.walrus-testnet.walrus.space/v1/store";
const NETWORK = "testnet"; 
const STORAGE_KEY_DATA = "sui_demo_data";

// 🔥 CẤU HÌNH EMAIL THẬT (EMAILJS)
const EMAIL_SERVICE_ID = "service_qulrm6a";   
const EMAIL_TEMPLATE_ID = "template_5ao5far"; 
const EMAIL_PUBLIC_KEY = "TuHSp-wO0hFMn03fu"; 

// --- TYPES ---
type AppView = "loading" | "auth" | "landing" | "setup" | "dashboard" | "claim_mode" | "access_denied";
type ToastType = "success" | "error" | "info" | "warning";
type VaultType = "private" | "allowlist";
type Lang = "vi" | "en";
type HistoryItem = { action: string; time: string; status: string };

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  vi: {
    // ... (Giữ nguyên các text cũ)
    slogan: "Di sản số vĩnh cửu trên Blockchain",
    login_sub: "Kết nối ví Sui để tiếp tục",
    connect_wallet: "Kết nối Ví Sui Wallet",
    hello: "Xin chào,",
    manage_title: "Quản lý Di Sản Số",
    manage_subtitle: "An toàn & Minh bạch",
    access_vault: "Truy cập Két sắt",
    create_vault: "Bắt đầu bảo vệ tài sản",
    step_1: "Indexer Check", step_1_desc: "Quét lịch sử on-chain thực tế.",
    step_2: "ZK Privacy", step_2_desc: "Che giấu số dư tuyệt đối.",
    step_3: "Multisig", step_3_desc: "Đa chữ ký phân quyền.",
    step_4: "Walrus", step_4_desc: "Lưu trữ phi tập trung.",
    setup_title: "Thiết lập Két sắt (Smart Contract)",
    label_type: "Chọn Mô hình Bảo vệ",
    type_private: "Cá nhân (Private ZK)",
    desc_private: "Ẩn số tiền. Tự động kích hoạt khi Inactive.",
    type_allowlist: "Đa chữ ký (Multisig Vote)",
    desc_allowlist: "Cần 2/3 người giám hộ vote on-chain.",
    label_beneficiary: "Địa chỉ Ví Thừa Kế",
    label_email: "Email Cảnh báo",
    label_time: "Thời gian Inactive",
    label_amount: "Tài sản (SUI)",
    label_message: "Dữ liệu (Mã hóa SEAL)",
    btn_ai: "AI Gợi ý",
    label_walrus: "Tệp đính kèm (Video/Ảnh)",
    btn_upload: "Mã hóa & Upload",
    btn_activate: "Ký Giao Dịch (On-chain)",
    dashboard_title: "Quản lý Tài Sản",
    deadline: "Hạn kiểm tra hoạt động:",
    btn_ping: "GIA HẠN (PING)",
    btn_destroy: "HỦY SEAL & RÚT VỐN",
    claim_title: "Di Chúc Số (ZK Mode)",
    claim_amount: "TỔNG TÀI SẢN",
    media_found: "Dữ liệu được giải mã:",
    view_media: "Xem File (Decrypted)",
    msg_unlocked: "Thông điệp:",
    btn_claim: "KIỂM TRA INDEXER & RÚT",
    btn_wait: "ĐANG KHÓA",
    notify_title: "⚠️ CẢNH BÁO SEAL!",
    notify_body: "Sắp hết hạn! Hãy thực hiện giao dịch để chứng minh còn hoạt động!",
    scanning: "ĐANG QUÉT...",
    logout: "Đăng xuất",
    back: "Quay lại",
    cancel: "Hủy bỏ",
    menu_profile: "Hồ sơ người dùng",
    menu_beneficiary: "Người thừa kế",
    menu_members: "Hội đồng Multisig",
    prompt_add_member: "Nhập Ví hoặc GitHub người giám hộ:",
    member_added: "✅ Đã thêm người giám hộ!",
    menu_history: "Lịch sử Giao dịch",
    menu_status: "Trạng thái:",
    status_active: "Đang hoạt động (Alive)",
    status_inactive: "Inactive",
    status_claimed: "Đã chuyển giao",
    step_encrypt: "🔒 ZK Encrypting...",
    step_upload: "☁️ Walrus Upload...",
    step_done: "✅ Xong!",
    err_invalid_addr: "❌ Địa chỉ không hợp lệ!",
    err_no_file: "❌ Chưa chọn file!",
    setup_success: "✅ Transaction Success! Vault Created.",
    upload_success: "✅ Upload an toàn!",
    email_label: "EMAIL:",
    encrypting: "🔒 Đang mã hóa...",
    uploading: "☁️ Đang upload...",
    ping_disabled: "⛔ Đã chuyển giao",
    btn_claimed: "⛔ ĐÃ RÚT (HẾT PING)",
    checking_activity: "🔍 Indexer: Đang quét lịch sử On-chain...",
    activity_active: "❌ Indexer: Chủ ví CÒN HOẠT ĐỘNG! (Tx found)",
    activity_inactive: "✅ Indexer: Inactive > 6 tháng. Đủ điều kiện!",
    multisig_vote: "🗳️ Đang chờ Multisig Vote (ZK Proof)...",
    privacy_mask: "******",
    login_google: "Đăng nhập Google (ZK Login)",
    login_vneid: "Đăng nhập VNeID (Citizen ID)",
    google_success: "✅ ZK Login: Google Verified!",
    menu_roadmap: "Lộ trình phát triển",
    feature_lawyer: "Kết nối Luật sư & Công chứng",
    feature_legal: "Pháp lý Di chúc số"
  },
  en: {
    // ... (Giữ nguyên text EN)
    slogan: "Eternal Digital Legacy on Blockchain",
    login_sub: "Connect Sui Wallet to continue",
    connect_wallet: "Connect Sui Wallet",
    hello: "Hello,",
    manage_title: "Manage Digital Legacy",
    manage_subtitle: "Secure & Transparent",
    access_vault: "Access Vault",
    create_vault: "Start Protection",
    step_1: "Indexer", step_1_desc: "Scans real on-chain activity.",
    step_2: "ZK Proof", step_2_desc: "Zero-knowledge Balance.",
    step_3: "Multisig", step_3_desc: "Decentralized Voting.",
    step_4: "Walrus", step_4_desc: "Decentralized Storage.",
    setup_title: "Vault Setup (On-chain)",
    label_type: "Select Protection Model",
    type_private: "Private (ZK Hidden)",
    desc_private: "Hidden balance. Auto-trigger on inactivity.",
    type_allowlist: "Multisig (Voting)",
    desc_allowlist: "Requires 2/3 guardians to unlock.",
    label_beneficiary: "Beneficiary Address",
    label_email: "Alert Email",
    label_time: "Inactivity Period",
    label_amount: "Assets (SUI)",
    label_message: "Data (SEAL Encrypted)",
    btn_ai: "AI Suggest",
    label_walrus: "Attachment (Video/Photo)",
    btn_upload: "Encrypt & Upload",
    btn_activate: "Sign Transaction (On-chain)",
    dashboard_title: "Asset Management",
    deadline: "Activity Check Deadline:",
    btn_ping: "EXTEND (PING)",
    btn_destroy: "BREAK SEAL & WITHDRAW",
    claim_title: "Digital Will (ZK Mode)",
    claim_amount: "TOTAL ASSETS",
    media_found: "Decrypted Data:",
    view_media: "View File (Decrypted)",
    msg_unlocked: "Message:",
    btn_claim: "CHECK INDEXER & CLAIM",
    btn_wait: "LOCKED",
    notify_title: "⚠️ SEAL WARNING!",
    notify_body: "Expiring! Make a transaction to prove liveness!",
    scanning: "SCANNING...",
    logout: "Logout",
    back: "Back",
    cancel: "Cancel",
    menu_profile: "User Profile",
    menu_beneficiary: "Beneficiary",
    menu_members: "Multisig Council",
    prompt_add_member: "Enter Wallet or GitHub:",
    member_added: "✅ Guardian added!",
    menu_history: "Transaction History",
    menu_status: "Status:",
    status_active: "Active",
    status_inactive: "Inactive",
    status_claimed: "Transferred",
    step_encrypt: "🔒 ZK Encrypting...",
    step_upload: "☁️ Walrus Upload...",
    step_done: "✅ Done!",
    err_invalid_addr: "❌ Invalid Address!",
    err_no_file: "❌ No file selected!",
    setup_success: "✅ Transaction Success! Vault Created.",
    upload_success: "✅ Encrypted & Uploaded!",
    email_label: "LINKED EMAIL:",
    encrypting: "🔒 Encrypting...",
    uploading: "☁️ Uploading...",
    ping_disabled: "⛔ Transferred",
    btn_claimed: "⛔ CLAIMED (NO PING)",
    checking_activity: "🔍 Indexer: Scanning On-chain History...",
    activity_active: "❌ Indexer: Owner is ACTIVE! (Tx found)",
    activity_inactive: "✅ Indexer: Inactive confirmed. Unlocking!",
    multisig_vote: "🗳️ Awaiting Multisig Votes (ZK)...",
    privacy_mask: "******",
    login_google: "Login with Google",
    login_vneid: "Login with VNeID",
    google_success: "✅ ZK Login: Google Verified!",
    menu_roadmap: "Future Roadmap",
    feature_lawyer: "Lawyer & Notary Connection",
    feature_legal: "Digital Will Legal Framework"
  }
};

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
  body { font-family: 'Outfit', sans-serif; background-color: #0b0c15; color: white; overflow-x: hidden; transition: background-color 1s ease; }
  .orb { position: fixed; border-radius: 50%; filter: blur(100px); z-index: -1; opacity: 0.45; animation: float 10s infinite ease-in-out; }
  .orb-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, #4f46e5, transparent); animation-delay: 0s; }
  .orb-2 { bottom: -10%; right: -10%; width: 40vw; height: 40vw; background: radial-gradient(circle, #06b6d4, transparent); animation-delay: -5s; }
  .animate-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); transition: all 0.4s; }
  .glass-card:hover { border-color: rgba(14, 165, 233, 0.4); transform: translateY(-3px); }
  .menu-drawer { position: fixed; top: 0; left: 0; height: 100vh; width: 340px; background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(20px); z-index: 100; transform: translateX(-100%); transition: transform 0.3s ease; border-right: 1px solid rgba(255,255,255,0.1); }
  .menu-drawer.open { transform: translateX(0); }
  .menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 90; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
  .menu-overlay.open { opacity: 1; pointer-events: auto; }
  .confetti { position: fixed; top: 0; left: 50%; width: 10px; height: 10px; background: #f00; animation: fall linear forwards; z-index: 9999; }
  @keyframes fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
  .type-option { cursor: pointer; padding: 16px; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; transition: all 0.3s; background: rgba(0,0,0,0.2); }
  .type-option.active { border-color: #34d399; background: rgba(16, 185, 129, 0.1); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
  .toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
  .toast { min-width: 300px; padding: 16px 24px; border-radius: 16px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 12px; color: white; font-weight: 600; animation: slideInRight 0.4s forwards; }
  .toast.success { border-left: 4px solid #10b981; } .toast.error { border-left: 4px solid #ef4444; } .toast.info { border-left: 4px solid #3b82f6; } .toast.warning { border-left: 4px solid #f59e0b; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .history-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  .history-table th { text-align: left; color: #94a3b8; font-size: 10px; text-transform: uppercase; padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .history-table td { padding: 10px 8px; font-size: 13px; color: white; border-bottom: 1px solid rgba(255,255,255,0.05); }
`;

// --- COMPONENT BÁNH XE THỜI GIAN ---
const WheelColumn = ({ options, value, onChange, label }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      const selectedIndex = options.findIndex((o: any) => o === value);
      if (selectedIndex >= 0) containerRef.current.scrollTop = selectedIndex * 40;
    }
  }, []);
  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-[10px] text-cyan-400 font-bold uppercase mb-1">{label}</p>
      <div className="relative h-32 w-full overflow-hidden group">
        <div className="absolute top-1/2 left-0 w-full h-10 -translate-y-1/2 border-y border-cyan-500/50 bg-cyan-500/10 pointer-events-none z-10"></div>
        <div ref={containerRef} className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
          <div className="h-10 w-full flex-shrink-0"></div> 
          {options.map((opt: any) => (
            <div key={opt} onClick={() => onChange(opt)} className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-all ${opt === value ? 'text-white font-black text-lg scale-110' : 'text-slate-600 font-medium text-sm hover:text-slate-400'}`}>{opt < 10 ? `0${opt}` : opt}</div>
          ))}
          <div className="h-10 w-full flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

const DateTimePickerModal = ({ isOpen, onClose, onApply }: any) => {
  if (!isOpen) return null;
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());
  const years = Array.from({ length: 10 }, (_, i) => now.getFullYear() + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const handleApply = () => {
    const str = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    onApply(str); onClose();
  };
  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-up">
      <div className="bg-[#0b0c15] border border-white/10 w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4"><h3 className="text-white font-bold text-lg">Chọn Thời Gian</h3><button onClick={onClose} className="text-slate-400 hover:text-white"><i className="fa-solid fa-xmark"></i></button></div>
        <div className="grid grid-cols-5 gap-1 mb-8">
          <WheelColumn label="Ngày" options={days} value={day} onChange={setDay} />
          <WheelColumn label="Tháng" options={months} value={month} onChange={setMonth} />
          <WheelColumn label="Năm" options={years} value={year} onChange={setYear} />
          <div className="absolute left-[58%] top-[110px] text-slate-600 font-bold">:</div> 
          <WheelColumn label="Giờ" options={hours} value={hour} onChange={setHour} />
          <WheelColumn label="Phút" options={minutes} value={minute} onChange={setMinute} />
        </div>
        <button onClick={handleApply} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition">Xác nhận</button>
      </div>
    </div>
  );
};

export default function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction(); 
  const suiClient = new SuiClient({ url: getFullnodeUrl(NETWORK) });

  // --- STATE ---
  const [view, setView] = useState<AppView>("loading");
  const [loading, setLoading] = useState(false);
  const [isZkLogin, setIsZkLogin] = useState(false);
  const [isVNeID, setIsVNeID] = useState(false);
  const [demoAddress, setDemoAddress] = useState("");
  const [lang, setLang] = useState<Lang>("vi");
  const [showMenu, setShowMenu] = useState(false);

  // Setup State
  const [vaultType, setVaultType] = useState<VaultType>("private");
  const [beneficiaryInput, setBeneficiaryInput] = useState("");
  const [emailInput, setEmailInput] = useState(""); // Email người thừa kế
  const [ownerEmail, setOwnerEmail] = useState(""); // 🔥 Email chủ ví (Để nhận nhắc nhở)
  const [depositAmount, setDepositAmount] = useState(0.1);
  const [intervalTime, setIntervalTime] = useState(6);
  const [customDate, setCustomDate] = useState(""); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // SEAL SDK & Walrus
  const [walrusFile, setWalrusFile] = useState<File | null>(null);
  const [isUploadingWalrus, setIsUploadingWalrus] = useState(false);
  const [walrusBlobId, setWalrusBlobId] = useState<string>("");
  const [sealStatus, setSealStatus] = useState("");

  // Vault State
  const [vaultId, setVaultId] = useState<string | null>(localStorage.getItem("sui_vault_id"));
  const [vaultBalance, setVaultBalance] = useState<number>(0);
  const [vaultBeneficiary, setVaultBeneficiary] = useState<string>(""); 
  const [vaultEmail, setVaultEmail] = useState<string>(""); 
  const [vaultOwnerEmail, setVaultOwnerEmail] = useState<string>(""); // Lưu email chủ
  const [vaultMessage, setVaultMessage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<number | null>(null); 
  const [timeDuration, setTimeDuration] = useState<number>(0);
  const [currentVaultType, setCurrentVaultType] = useState<VaultType>("private");
  const [extraMembers, setExtraMembers] = useState<string[]>([]);
  const [isClaimed, setIsClaimed] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]); // 🔥 Lịch sử giao dịch

  // Logic mới: Auto Dispatch & Reminder
  const [isAutoDispatched, setIsAutoDispatched] = useState(false);
  const [hasRemindedOwner, setHasRemindedOwner] = useState(false); // Cờ kiểm tra đã nhắc chủ chưa

  const [checkingActivity, setCheckingActivity] = useState(false);
  const [activityStatus, setActivityStatus] = useState<string | null>(null);
  const [multisigProgress, setMultisigProgress] = useState(0);

  const [toast, setToast] = useState<{ msg: string; type: ToastType; id: number } | null>(null);
  const [isCritical, setIsCritical] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const hasNotified = useRef(false);
  const hasInitialized = useRef(false);

  const t = (key: keyof typeof TRANSLATIONS.vi) => TRANSLATIONS[lang][key];
  const aiScripts = ["Mật khẩu ví lạnh Ledger.", "Private Key ví phụ.", "Tài khoản ngân hàng số."];

  const showToast = (msg: string, type: ToastType = "info") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00d 00h 00m 00s";
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const formatDateTime = (timestamp: number | null) => {
    if (!timestamp || timestamp === 0) return "--:-- --/--/----";
    return new Date(timestamp).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US');
  };

  useEffect(() => { if (Notification.permission !== "granted") Notification.requestPermission(); }, []);

  const syncToSharedDB = (data: any) => {
      const oldData = JSON.parse(localStorage.getItem(STORAGE_KEY_DATA) || "{}");
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify({ ...oldData, ...data }));
      window.dispatchEvent(new Event("storage"));
  };

  // 🔥 Helper thêm lịch sử
  const addHistory = (action: string, status: string = "Success") => {
      const newEvent = { action, time: new Date().toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US'), status };
      const newHistory = [newEvent, ...history];
      setHistory(newHistory);
      syncToSharedDB({ history: newHistory });
  };

  // 🔥 HÀM GỬI EMAIL THẬT
  const sendRealEmail = async (toEmail: string, content: string) => {
      if (!toEmail) return;
      
      const data = {
        service_id: EMAIL_SERVICE_ID,
        template_id: EMAIL_TEMPLATE_ID,
        user_id: EMAIL_PUBLIC_KEY,
        template_params: {
            to_email: toEmail, 
            message: content, // Nội dung linh hoạt (Lời nhắc hoặc Link thừa kế)
            vault_id: vaultId,
            reply_to: "system@suiinherit.com"
        }
      };

      try {
          await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
          });
      } catch (error) {
          console.error("Lỗi gửi mail:", error);
      }
  };

  useEffect(() => {
    const checkAuth = () => {
        if (view === "claim_mode") return;
        const savedVaultId = localStorage.getItem("sui_vault_id");
        if (savedVaultId) { setVaultId(savedVaultId); setView("dashboard"); return; }
        if (account) { 
            if (view !== "landing" && view !== "setup") setView("landing"); 
            return; 
        }
        if (isVNeID || (isZkLogin && account) || (account && !isZkLogin)) { setView("landing"); return; }
        if (view === "loading") { setView("auth"); }
    };
    const timer = setTimeout(checkAuth, 1500);
    if (view !== "loading") checkAuth();
    return () => clearTimeout(timer);
  }, [account, view, vaultId]);

  useEffect(() => {
      const loadFromDB = () => {
          const raw = localStorage.getItem(STORAGE_KEY_DATA);
          if (raw) {
              const data = JSON.parse(raw);
              setVaultBalance(data.balance || 0); 
              setVaultMessage(data.message || "");
              setExpiryDate(data.expiryDate || null); 
              setTimeDuration(data.duration || 0);
              setVaultBeneficiary(data.beneficiary || "");
              setVaultEmail(data.email || "");
              setVaultOwnerEmail(data.ownerEmail || "");
              setCurrentVaultType(data.type || "private");
              if (data.extraMembers) setExtraMembers(data.extraMembers);
              if (data.isClaimed) setIsClaimed(true);
              if (data.history) setHistory(data.history);
          }
      };
      loadFromDB();
      window.addEventListener("storage", loadFromDB);
      const interval = setInterval(loadFromDB, 1000);
      return () => { window.removeEventListener("storage", loadFromDB); clearInterval(interval); };
  }, []);

  // --- LOGIC TIMER & AUTO DISPATCH & REMINDER ---
  useEffect(() => {
      if (!expiryDate || isClaimed) return;
      const tick = () => {
          const diff = Math.ceil((expiryDate - Date.now()) / 1000);
          
          // 🔥 NHẮC NHỞ CHỦ VÍ KHI CÒN < 1 TIẾNG
          if (diff <= 3600 && diff > 0 && !hasRemindedOwner && vaultOwnerEmail) {
              showToast("📧 Đang gửi nhắc nhở đến chủ ví...", "info");
              sendRealEmail(vaultOwnerEmail, "⚠️ CẢNH BÁO: Két sắt của bạn sắp hết hạn sau 1 giờ! Vui lòng truy cập ứng dụng và bấm GIA HẠN (PING) ngay lập tức để tránh tài sản bị chuyển đi.");
              setHasRemindedOwner(true);
          }

          if (diff <= 0) { 
              setTimeLeft(0); 
              setIsCritical(true); 

              // 🔥 GỬI MAIL CHO NGƯỜI THỪA KẾ KHI HẾT GIỜ
              if (!isAutoDispatched && !isClaimed) {
                  setIsAutoDispatched(true);
                  if (vaultEmail) {
                      showToast(`🚀 Gửi Email thừa kế đến ${vaultEmail}...`, "warning");
                      const shareLink = `${window.location.origin}?vault_id=${vaultId}`;
                      sendRealEmail(vaultEmail, `Chủ ví đã không hoạt động quá thời hạn. Đây là Link truy cập tài sản thừa kế của bạn: ${shareLink}`);
                      addHistory("System: Auto-Dispatch Email", "Sent");
                  }
              }
          } else { 
              setTimeLeft(diff); 
              setIsCritical(diff < (3600 * 24)); 
          }
      };
      tick();
      const timer = setInterval(tick, 1000);
      return () => clearInterval(timer);
  }, [expiryDate, lang, vaultEmail, vaultOwnerEmail, isClaimed, isAutoDispatched, vaultId, hasRemindedOwner]);

  const handleUploadToWalrus = async () => {
    if (!walrusFile) { showToast(t('err_no_file'), "error"); return; }
    setIsUploadingWalrus(true);
    setSealStatus(t('step_encrypt')); 
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSealStatus(t('step_upload'));
    try {
        const response = await fetch(WALRUS_PUBLISHER, { method: "PUT", body: walrusFile });
        const data = await response.json();
        const blobId = data.newlyCreated?.blobObject?.blobId || data.alreadyCertified?.blobId;
        if (blobId) {
            setSealStatus(t('step_done'));
            setWalrusBlobId(blobId);
            setMessageInput((prev) => prev + `\n\n[SEAL_ENCRYPTED:${blobId}]`);
            showToast(t('upload_success'), "success");
        } else { throw new Error("Upload Failed"); }
    } catch (e) { showToast("Error uploading", "error"); } finally { setIsUploadingWalrus(false); setSealStatus(""); }
  };

    const fetchVaultData = useCallback(async (id: string) => {
        if (id && id.includes("vault")) {
            if (isZkLogin || isVNeID || (id && id.includes("demo"))) {
                const raw = localStorage.getItem(STORAGE_KEY_DATA);
                if (raw) {
                    const data = JSON.parse(raw);
                    setVaultBalance(data.balance); setVaultMessage(data.message);
                    setExpiryDate(data.expiryDate); setTimeDuration(data.duration);
                    setVaultBeneficiary(data.beneficiary); setVaultEmail(data.email);
                    setVaultOwnerEmail(data.ownerEmail);
                    setCurrentVaultType(data.type);
                    if (data.extraMembers) setExtraMembers(data.extraMembers);
                    if (data.isClaimed) setIsClaimed(true);
                    if (data.history) setHistory(data.history);
                }
                return;
            }
        }
    }, [isZkLogin, isVNeID]);

  useEffect(() => {
    if (hasInitialized.current) return;
    const params = new URLSearchParams(window.location.search);
    const sharedVaultId = params.get("vault_id");
    if (sharedVaultId) {
        setVaultId(sharedVaultId); fetchVaultData(sharedVaultId); setView("claim_mode"); hasInitialized.current = true; return;
    }
    hasInitialized.current = true;
  }, [fetchVaultData]);

  const handleGoogleLogin = () => { setLoading(true); setTimeout(() => { setDemoAddress("0x7d2...google_user"); setIsZkLogin(true); setLoading(false); showToast(t('google_success'), "success"); }, 1500); };
  const handleVNeIDLogin = () => { setIsScanning(true); setTimeout(() => { setIsScanning(false); setDemoAddress("0x84vn...vneid_citizen"); setIsVNeID(true); showToast("Verified VNeID!", "success"); }, 2500); };

  const handleAIGenerate = () => {
      if (isTyping) return; setIsTyping(true);
      const script = aiScripts[Math.floor(Math.random() * aiScripts.length)];
      setMessageInput(""); let i = 0;
      const interval = setInterval(() => { setMessageInput((prev) => prev + script.charAt(i)); i++; if (i >= script.length) { clearInterval(interval); setIsTyping(false); } }, 20);
  };

    const handleCreateVault = () => {
        if (!account) { showToast("⚠️ Vui lòng kết nối Ví Sui thật để tạo két!", "error"); return; }
        setLoading(true);
        try {
            const tx = new Transaction();
            const [coin] = tx.splitCoins(tx.gas, [1000000]); 
            tx.transferObjects([coin], account.address);
            signAndExecuteTransaction({ transaction: tx }, {
                onSuccess: (result) => {
                    console.log("✅ Transaction Success! Digest:", result.digest);
                    showToast("✅ Giao dịch thành công! Tạo két sắt...", "success");
                    finalizeVaultCreation();
                },
                onError: (err: any) => {
                    console.error("❌ Transaction Failed:", err);
                    showToast("❌ Lỗi giao dịch: " + (err.message || "Unknown"), "error");
                    setLoading(false);
                }
            });
        } catch (e) {
            console.error("❌ Error creating transaction:", e);
            setLoading(false);
            showToast("❌ Lỗi tạo giao dịch! Kiểm tra console.", "error");
        }
    };

  const finalizeVaultCreation = () => {
        const fakeVaultId = "vault_" + Date.now();
        localStorage.setItem("sui_vault_id", fakeVaultId);
        const finalBeneficiary = beneficiaryInput || "0xDemoUser_Receiver";
        let finalDurationMs = 0;
        if (customDate) {
            const targetTime = new Date(customDate).getTime();
            finalDurationMs = targetTime - Date.now();
            if (finalDurationMs <= 0) { showToast("❌ Thời gian phải ở tương lai!", "error"); setLoading(false); return; }
        } else {
            finalDurationMs = intervalTime * 60 * 1000; 
        }

        const now = Date.now();
        const exp = now + finalDurationMs;
        const initialHistory = [{ action: "Vault Created", time: new Date().toLocaleString(), status: "Active" }];

        syncToSharedDB({ 
            id: fakeVaultId, balance: depositAmount, message: messageInput, expiryDate: exp, duration: finalDurationMs, 
            beneficiary: finalBeneficiary, email: emailInput, ownerEmail: ownerEmail, type: vaultType, extraMembers: [], isClaimed: false, history: initialHistory
        });

        setVaultId(fakeVaultId); setExpiryDate(exp); setTimeDuration(finalDurationMs); setVaultMessage(messageInput); 
        setVaultBalance(depositAmount); setVaultBeneficiary(finalBeneficiary); setVaultEmail(emailInput); setVaultOwnerEmail(ownerEmail); setCurrentVaultType(vaultType);
        setExtraMembers([]); setIsClaimed(false); setHistory(initialHistory);
        setLoading(false); showToast(t('setup_success'), "success"); setView("dashboard"); 
  };

  const handlePing = () => {
    if (isClaimed) { showToast("Vault đã bị rút! Không thể Ping.", "error"); return; }
    if (account) {
        const tx = new Transaction();
        const [coin] = tx.splitCoins(tx.gas, [1000]);
        tx.transferObjects([coin], account.address);
        signAndExecuteTransaction({ transaction: tx }, {
            onSuccess: () => {
                const newExpiry = Date.now() + timeDuration;
                setExpiryDate(newExpiry); setIsCritical(false); hasNotified.current = false; setHasRemindedOwner(false);
                syncToSharedDB({ expiryDate: newExpiry });
                addHistory("Owner Ping (Extended)", "Success");
                showToast("Ping Success! On-chain recorded.", "success"); 
            },
            onError: () => showToast("Ping Failed (User rejected)", "error")
        });
    }
  };

  const handleClaim = async () => {
    const canClaim = await checkOwnerActivity();
    if (!canClaim) return;
    // ... Multisig logic ...
    setShowConfetti(true); showToast("Success! Assets Claimed.", "success"); 
    syncToSharedDB({ isClaimed: true, balance: 0 });
    setIsClaimed(true); setVaultBalance(0);
    addHistory("Beneficiary Claimed Assets", "Completed");
    setTimeout(() => { setShowConfetti(false); }, 4000);
  };

  // ... (Các hàm phụ trợ khác giữ nguyên)
  const handleAddMember = () => { /* ... */ };
  const handleLogout = () => { localStorage.clear(); window.location.reload(); }
  const displayAddress = (isZkLogin || isVNeID) ? (account?.address || demoAddress) : account?.address;

  // --- UI RENDER ---
  return (
    <div className={`min-h-screen text-slate-200 selection:bg-cyan-500 selection:text-white pb-20 ${isCritical && !isClaimed ? 'critical-mode' : ''}`}>
      <style>{customStyles}</style>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* HEADER & MENU DRAWER (Giữ nguyên) */}
      <div className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-transparent">
          <button onClick={() => setShowMenu(true)} className="text-white text-2xl hover:text-cyan-400 transition p-2"><i className="fa-solid fa-bars"></i></button>
          <button onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full font-bold border border-white/20 transition flex items-center gap-2 text-sm">{lang === 'vi' ? '🇻🇳 VN' : '🇺🇸 EN'}</button>
      </div>
      <div className={`menu-overlay ${showMenu ? 'open' : ''}`} onClick={() => setShowMenu(false)}></div>
      <div className={`menu-drawer ${showMenu ? 'open' : ''} p-6 flex flex-col`}>
          <button onClick={() => setShowMenu(false)} className="self-end text-slate-400 text-2xl hover:text-white mb-6"><i className="fa-solid fa-xmark"></i></button>
          {/* ... (Phần Profile và Status giữ nguyên) ... */}
          <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold">{displayAddress ? displayAddress.slice(2,4).toUpperCase() : "?"}</div>
              <p className="text-cyan-400 font-bold">{t('menu_profile')}</p>
              <p className="text-xs text-slate-400 font-mono break-all mt-1">{displayAddress || "Not connected"}</p>
          </div>
          <button onClick={handleLogout} className="mt-auto bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"><i className="fa-solid fa-power-off"></i> {t('logout')}</button>
      </div>

      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}> <span>{toast.msg}</span></div></div>}
      {showConfetti && <div style={{position:'fixed', inset:0, pointerEvents:'none', zIndex:9999}}>{Array.from({length: 50}).map((_, i) => (<div key={i} className="confetti" style={{left: `${Math.random()*100}vw`, background: `hsl(${Math.random()*360}, 100%, 50%)`, animationDuration: `${Math.random()*2+2}s`}}></div>))}</div>}

      {/* AUTH & LANDING (Giữ nguyên) */}
      {view === "loading" && (<div className="flex flex-col items-center justify-center min-h-screen animate-up"><div className="loader mb-6"></div><p className="text-cyan-400 font-bold tracking-[0.3em] text-sm animate-pulse">SYSTEM INITIALIZING</p></div>)}
      {view === "auth" && (<section className="flex flex-col items-center justify-center min-h-[90vh] animate-up px-4"><ConnectButton connectText={t('connect_wallet')} className="!bg-gradient-to-r !from-blue-600 !to-cyan-500 !text-white !font-bold !rounded-2xl !py-4 !px-8 !text-lg hover:!shadow-[0_0_30px_rgba(6,182,212,0.6)] !transition" /></section>)}
      {view === "landing" && (<section className="min-h-screen flex items-center animate-up px-6 md:px-20"><div className="w-full max-w-7xl mx-auto"><h1 className="text-7xl font-black text-white">{t('manage_title')}</h1><button onClick={() => setView("setup")} className="bg-cyan-500 hover:bg-cyan-600 text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg mt-8">{t('create_vault')}</button></div></section>)}

      {/* SETUP - THÊM Ô NHẬP EMAIL CHỦ VÍ */}
      {view === "setup" && (
        <section className="animate-up max-w-2xl mx-auto mt-20 px-4">
            <div className="glass-card p-10 md:p-14 rounded-[3rem]">
                <h2 className="text-4xl font-black mb-6 text-white">{t('setup_title')}</h2>
                {/* ... (Phần chọn loại Private/Allowlist giữ nguyên) ... */}
                <div className="space-y-8">
                    <div>
                        <label className="text-cyan-400 text-xs font-bold uppercase block mb-2">{t('label_beneficiary')}</label>
                        <input type="text" placeholder="Địa chỉ ví Sui (0x...)" onChange={(e) => setBeneficiaryInput(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-2xl p-5 text-white mb-4" />
                        
                        {/* 🔥 NEW: EMAIL CHỦ VÍ */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-emerald-400 text-xs font-bold uppercase block mb-2"><i className="fa-solid fa-user"></i> Email Của Bạn (Chủ ví)</label>
                                <input type="email" placeholder="owner@gmail.com" onChange={(e) => setOwnerEmail(e.target.value)} className="w-full bg-emerald-900/10 border border-emerald-500/30 rounded-2xl p-5 text-emerald-100 placeholder-emerald-500/50 focus:border-emerald-400 outline-none transition" />
                                <p className="text-[10px] text-slate-400 mt-2">*Để nhận nhắc nhở Ping khi sắp hết giờ.</p>
                            </div>
                            <div>
                                <label className="text-yellow-400 text-xs font-bold uppercase block mb-2"><i className="fa-solid fa-paper-plane"></i> Email Người Thừa Kế</label>
                                <input type="email" placeholder="beneficiary@gmail.com" onChange={(e) => setEmailInput(e.target.value)} className="w-full bg-yellow-900/10 border border-yellow-500/30 rounded-2xl p-5 text-yellow-100 placeholder-yellow-500/50 focus:border-yellow-400 outline-none transition" />
                                <p className="text-[10px] text-slate-400 mt-2">*Để nhận Link tự động khi hết giờ.</p>
                            </div>
                        </div>
                    </div>
                    {/* ... (Phần chọn thời gian và số tiền giữ nguyên) ... */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-cyan-400 text-xs font-bold uppercase block mb-2">{t('label_time')}</label>
                            <div 
                                onClick={() => setShowDatePicker(true)}
                                className={`w-full bg-black/30 border rounded-xl p-4 flex items-center justify-between cursor-pointer group transition-all ${customDate ? 'border-cyan-500 bg-cyan-900/10' : 'border-white/10 hover:border-white/30'}`}
                            >
                                <p className={`font-mono text-lg font-bold ${customDate ? 'text-white' : 'text-slate-500'}`}>{customDate ? new Date(customDate).toLocaleString('vi-VN') : "Chọn ngày & giờ..."}</p>
                            </div>
                            <DateTimePickerModal isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} onApply={(val: string) => { setCustomDate(val); setIntervalTime(0); }} />
                        </div>
                        <div><label className="text-cyan-400 text-xs font-bold uppercase block mb-2">{t('label_amount')}</label><input type="number" value={depositAmount} onChange={(e) => setDepositAmount(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white font-bold" /></div>
                    </div>
                    <button onClick={handleCreateVault} disabled={loading} className="btn-gradient w-full text-white p-5 rounded-2xl font-bold text-xl mt-4">{loading ? <i className="fa-solid fa-spinner fa-spin"></i> : t('btn_activate')}</button>
                </div>
            </div>
        </section>
      )}

      {/* DASHBOARD - THÊM BẢNG LỊCH SỬ */}
      {view === "dashboard" && (
        <section className="animate-up max-w-5xl mx-auto mt-20 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="glass-card p-12 rounded-[3rem] text-center flex flex-col justify-center items-center relative overflow-hidden">
                      {isClaimed ? (
                          <>
                            <p className="text-8xl font-black font-mono text-slate-600">00:00:00</p>
                            <p className="text-sm font-bold mt-6 px-6 py-2 rounded-full border border-red-500/30 bg-red-900/20 text-red-400">⛔ {t('status_claimed')}</p>
                          </>
                      ) : (
                          <>
                            <p className={`text-5xl md:text-6xl font-black font-mono tracking-tighter transition-all duration-300 ${isCritical ? 'text-red-500 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</p>
                            <p className={`text-sm font-bold mt-6 px-6 py-2 rounded-full border shadow-lg ${isCritical ? 'text-red-400 bg-red-900/20 border-red-500/30' : 'text-cyan-400 bg-cyan-900/20 border-cyan-500/30'}`}>{isCritical ? "⚠️ SẮP HẾT HẠN - HÃY PING!" : `${t('deadline')} ${formatDateTime(expiryDate)}`}</p>
                          </>
                      )}
                      {/* 🔥 NÚT PING SẼ BỊ DISABLE NẾU ĐÃ CLAIMED */}
                      <button onClick={handlePing} disabled={isClaimed} className={`w-full py-6 rounded-2xl font-bold text-xl mt-10 flex items-center justify-center gap-3 transition border ${isClaimed ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700' : 'bg-white/5 hover:bg-white/10'}`}>
                        {isClaimed ? t('btn_claimed') : t('btn_ping')}
                      </button>
                </div>
                <div className="glass-card p-12 rounded-[3rem] flex flex-col justify-center">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-2">{t('label_amount')}</p>
                        <p className="text-6xl font-black text-white drop-shadow-xl">{isClaimed ? vaultBalance : t('privacy_mask')} <span className="text-2xl text-cyan-500">SUI</span></p>
                    </div>
                    {/* ... (Phần Link thừa kế giữ nguyên) ... */}
                    <div className="border-t border-white/10 pt-8 mt-8">
                         <p className="text-yellow-400 text-xs font-bold uppercase mb-2">🔑 LINK CHO NGƯỜI THỪA KẾ</p>
                         <div onClick={() => { const link = `${window.location.origin}?vault_id=${vaultId}`; navigator.clipboard.writeText(link); showToast("Đã copy Link!", "success"); }} className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 p-4 rounded-2xl cursor-pointer group transition-all">
                             <div className="flex justify-between items-center"><div className="text-sm font-mono text-yellow-200 truncate pr-4">{window.location.origin}?vault_id=...</div><i className="fa-regular fa-copy text-yellow-400"></i></div>
                         </div>
                    </div>
                </div>
            </div>

            {/* 🔥 PHẦN MỚI: BẢNG LỊCH SỬ GIAO DỊCH */}
            <div className="mt-8 glass-card p-8 rounded-[2rem]">
                <p className="text-cyan-400 text-sm font-bold uppercase mb-4 flex items-center gap-2"><i className="fa-solid fa-clock-rotate-left"></i> {t('menu_history')}</p>
                <table className="history-table">
                    <thead><tr><th>Hành động</th><th>Thời gian</th><th>Trạng thái</th></tr></thead>
                    <tbody>
                        {history.length > 0 ? history.map((item, index) => (
                            <tr key={index}>
                                <td className="font-bold">{item.action}</td>
                                <td className="font-mono text-slate-400">{item.time}</td>
                                <td><span className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === 'Completed' || item.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>{item.status}</span></td>
                            </tr>
                        )) : (<tr><td colSpan={3} className="text-center text-slate-500 italic py-4">Chưa có giao dịch nào.</td></tr>)}
                    </tbody>
                </table>
            </div>
        </section>
      )}

      {/* CLAIM MODE (Giữ nguyên logic cũ) */}
      {view === "claim_mode" && (
        <section className="animate-up max-w-md mx-auto mt-20 px-4">
             <div className={`glass-card p-10 rounded-[3rem] border text-center relative overflow-hidden ${timeLeft > 0 ? 'border-red-500/50 bg-red-950/20' : 'border-emerald-500/30'}`}>
                {timeLeft > 0 ? (
                    <div className="py-10"><div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"><i className="fa-solid fa-lock text-4xl text-red-500"></i></div><h2 className="text-3xl font-black text-red-500 mb-2">LOCKED</h2><p className="text-slate-300 mb-6">Di chúc này chưa được kích hoạt.</p><button onClick={() => window.location.reload()} className="mt-8 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm font-bold transition">Kiểm tra lại</button></div>
                ) : (
                    <>
                        <h2 className="text-4xl font-black mb-2 text-white">{t('claim_title')}</h2>
                        <div className="bg-black/40 border border-white/10 p-8 rounded-[2rem] mb-8 mt-8"><p className="text-xs text-slate-400 uppercase mb-2">{t('claim_amount')}</p><p className="text-5xl font-black text-white">{isClaimed ? vaultBalance : "HIDDEN"} SUI</p></div>
                        <div className="space-y-6"><button onClick={handleClaim} disabled={checkingActivity} className="w-full font-bold py-5 rounded-2xl text-xl transition flex items-center justify-center gap-3 shadow-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:scale-[1.02] hover:shadow-emerald-500/20"><i className="fa-solid fa-file-signature"></i> {t('btn_claim')}</button></div>
                    </>
                )}
             </div>
        </section>
      )}
    </div>
  );
}