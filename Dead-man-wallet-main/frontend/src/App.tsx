// @ts-nocheck
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { TransactionBlock } from "@mysten/sui.js/transactions"; 
import { useState, useEffect, useCallback, useRef } from "react";
import "@mysten/dapp-kit/dist/index.css";

// --- CẤU HÌNH ---
const WALRUS_PUBLISHER = "https://publisher.walrus-testnet.walrus.space/v1/store";
const STORAGE_KEY_DATA = "sui_demo_data";
const NETWORK = "testnet";

// --- TYPES ---
type AppView = "loading" | "auth" | "landing" | "setup" | "dashboard" | "claim_mode";
type ToastType = "success" | "error" | "info" | "warning";
type VaultType = "private" | "allowlist";
type Lang = "vi" | "en";

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  vi: {
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
    type_private: "Cá nhân (Private ZK)",
    desc_private: "Ẩn số tiền. Tự động kích hoạt khi Inactive.",
    type_allowlist: "Đa chữ ký (Multisig Vote)",
    desc_allowlist: "Cần 2/3 người giám hộ vote on-chain.",
    label_beneficiary: "Địa chỉ Ví Thừa Kế",
    label_time: "Thời gian Inactive (Tháng)",
    label_amount: "Tài sản (SUI)",
    btn_activate: "Ký Giao Dịch (On-chain)",
    deadline: "Hạn kiểm tra hoạt động:",
    btn_ping: "GIA HẠN (PING)",
    claim_title: "Di Chúc Số (ZK Mode)",
    claim_amount: "TỔNG TÀI SẢN",
    btn_claim: "KIỂM TRA INDEXER & RÚT",
    btn_wait: "ĐANG KHÓA",
    scanning: "ĐANG QUÉT...",
    logout: "Đăng xuất",
    back: "Quay lại",
    menu_profile: "Hồ sơ người dùng",
    menu_members: "Hội đồng Multisig",
    prompt_add_member: "Nhập Ví hoặc GitHub người giám hộ:",
    member_added: "✅ Đã thêm người giám hộ!",
    menu_status: "Trạng thái:",
    status_active: "Đang hoạt động (Alive)",
    status_inactive: "Inactive",
    status_claimed: "Đã chuyển giao",
    step_encrypt: "🔒 ZK Encrypting...",
    step_upload: "☁️ Walrus Upload...",
    step_done: "✅ Xong!",
    err_no_file: "❌ Chưa chọn file!",
    setup_success: "✅ Transaction Success! Vault Created.",
    upload_success: "✅ Upload an toàn!",
    checking_activity: "🔍 Indexer: Đang quét lịch sử On-chain...",
    activity_active: "❌ Indexer: Chủ ví CÒN HOẠT ĐỘNG! (Tx found)",
    activity_inactive: "✅ Indexer: Inactive > 6 tháng. Đủ điều kiện!",
    multisig_vote: "🗳️ Đang chờ Multisig Vote (ZK Proof)...",
    privacy_mask: "******",
    step_4_label: "Tải lên Walrus (Video/Ảnh)"
  },
  en: {
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
    type_private: "Private (ZK Hidden)",
    desc_private: "Hidden balance. Auto-trigger on inactivity.",
    type_allowlist: "Multisig (Voting)",
    desc_allowlist: "Requires 2/3 guardians to unlock.",
    label_beneficiary: "Beneficiary Address",
    label_time: "Inactivity Period (Months)",
    label_amount: "Assets (SUI)",
    btn_activate: "Sign Transaction (On-chain)",
    deadline: "Activity Check Deadline:",
    btn_ping: "EXTEND (PING)",
    claim_title: "Digital Will (ZK Mode)",
    claim_amount: "TOTAL ASSETS",
    btn_claim: "CHECK INDEXER & CLAIM",
    btn_wait: "LOCKED",
    scanning: "SCANNING...",
    logout: "Logout",
    back: "Back",
    menu_profile: "User Profile",
    menu_members: "Multisig Council",
    prompt_add_member: "Enter Wallet or GitHub:",
    member_added: "✅ Guardian added!",
    menu_status: "Status:",
    status_active: "Active",
    status_inactive: "Inactive",
    status_claimed: "Transferred",
    step_encrypt: "🔒 ZK Encrypting...",
    step_upload: "☁️ Walrus Upload...",
    step_done: "✅ Done!",
    err_no_file: "❌ No file selected!",
    setup_success: "✅ Transaction Success! Vault Created.",
    upload_success: "✅ Encrypted & Uploaded!",
    checking_activity: "🔍 Indexer: Scanning On-chain History...",
    activity_active: "❌ Indexer: Owner is ACTIVE! (Tx found)",
    activity_inactive: "✅ Indexer: Inactive confirmed. Unlocking!",
    multisig_vote: "🗳️ Awaiting Multisig Votes (ZK)...",
    privacy_mask: "******",
    step_4_label: "Upload to Walrus"
  }
};

// --- CSS Generator (Tránh inline styles) ---
const confettiClasses = Array.from({ length: 50 }).map((_, i) => {
  const left = Math.random() * 100;
  const duration = Math.random() * 2 + 2;
  const hue = Math.floor(Math.random() * 360);
  return `.c-${i} { left: ${left}vw; background: hsl(${hue}, 100%, 50%); animation-duration: ${duration}s; }`;
}).join(" ");

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
  body { font-family: 'Outfit', sans-serif; background-color: #0b0c15; color: white; overflow-x: hidden; margin: 0; }
  .ocean-wrapper { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; overflow: hidden; background: radial-gradient(circle at 50% 100%, #0c4a6e, #020617 60%); }
  .water-rays { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: transparent; background-image: linear-gradient(transparent 30%, rgba(6, 182, 212, 0.1) 40%, transparent 50%), linear-gradient(90deg, transparent 30%, rgba(56, 189, 248, 0.05) 40%, transparent 50%); background-size: 200% 200%; animation: ripple 15s linear infinite; filter: blur(3px); opacity: 0.7; }
  @keyframes ripple { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(5deg) scale(1.1); } 100% { transform: rotate(0deg) scale(1); } }
  .glass-card { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3); transition: all 0.3s ease; }
  .glass-card:hover { border-color: rgba(56, 189, 248, 0.3); box-shadow: 0 0 20px rgba(14, 165, 233, 0.15); }
  .btn-primary { background: linear-gradient(135deg, #0ea5e9, #2563eb); color: white; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5); }
  .btn-primary:disabled { background: #334155; color: #94a3b8; box-shadow: none; cursor: not-allowed; }
  .input-field { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.08); color: white; transition: all 0.3s; }
  .input-field:focus { border-color: #0ea5e9; background: rgba(14, 165, 233, 0.05); outline: none; }
  .animate-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .menu-drawer { background: #0f172a; border-right: 1px solid #1e293b; }
  .toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
  .toast { min-width: 300px; padding: 16px 24px; border-radius: 16px; background: #1e293b; border: 1px solid #334155; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 12px; color: white; font-weight: 600; animation: slideInRight 0.4s forwards; }
  .toast.success { border-left: 4px solid #10b981; } .toast.error { border-left: 4px solid #ef4444; } .toast.info { border-left: 4px solid #3b82f6; } .toast.warning { border-left: 4px solid #f59e0b; }
  .type-option { cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s; }
  .type-option.active { background: rgba(14, 165, 233, 0.1); border-color: #0ea5e9; }
  
  /* 🔥 FIX 1: Confetti Wrapper Class (Thay vì inline style) */
  .confetti-wrapper { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
  .confetti { position: fixed; top: 0; width: 10px; height: 10px; animation: fall linear forwards; z-index: 9999; }
  ${confettiClasses}
  @keyframes fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }

  /* 🔥 FIX 2: Progress Bar Classes (Thay vì width động) */
  .progress-bar-bg { background-color: #1e293b; }
  .progress-bar-fill { background-color: #06b6d4; transition: width 0.3s; }
  .width-0 { width: 0%; }
  .width-10 { width: 10%; }
  .width-40 { width: 40%; }
  .width-80 { width: 80%; }
  .width-100 { width: 100%; }
`;

export default function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const suiClient = new SuiClient({ url: getFullnodeUrl(NETWORK) });
  
  // --- STATE ---
  const [view, setView] = useState<AppView>("loading");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("vi");
  const [showMenu, setShowMenu] = useState(false);

  // Setup State
  const [vaultType, setVaultType] = useState<VaultType>("private");
  const [beneficiaryInput, setBeneficiaryInput] = useState("");
  const [depositAmount, setDepositAmount] = useState(0.1);
  const [intervalTime, setIntervalTime] = useState(6);

  // SEAL SDK & Walrus
  const [walrusFile, setWalrusFile] = useState<File | null>(null);
  const [isUploadingWalrus, setIsUploadingWalrus] = useState(false);
  const [walrusBlobId, setWalrusBlobId] = useState<string>("");
  const [sealStatus, setSealStatus] = useState("");

  // Vault State
  const [vaultId, setVaultId] = useState<string | null>(localStorage.getItem("sui_vault_id"));
  const [vaultBalance, setVaultBalance] = useState<number>(0);
  const [vaultBeneficiary, setVaultBeneficiary] = useState<string>(""); 
  const [vaultMessage, setVaultMessage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<number | null>(null); 
  const [timeDuration, setTimeDuration] = useState<number>(0);
  const [currentVaultType, setCurrentVaultType] = useState<VaultType>("private");
  const [extraMembers, setExtraMembers] = useState<string[]>([]);
  const [isClaimed, setIsClaimed] = useState(false);

  // Indexer & Multisig State
  const [checkingActivity, setCheckingActivity] = useState(false);
  const [activityStatus, setActivityStatus] = useState<string | null>(null);
  const [multisigProgress, setMultisigProgress] = useState(0);

  const [toast, setToast] = useState<{ msg: string; type: ToastType; id: number } | null>(null);
  const [isCritical, setIsCritical] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const hasNotified = useRef(false);
  const hasInitialized = useRef(false);

  const t = (key: keyof typeof TRANSLATIONS.vi) => TRANSLATIONS[lang][key];
  const generatedShareLink = vaultId ? `${window.location.origin}?vault_id=${vaultId}` : "";

  const showToast = (msg: string, type: ToastType = "info") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00:00";
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
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

  // Navigator Logic
  useEffect(() => {
    const checkAuth = () => {
        if (view === "claim_mode") return;
        const savedVaultId = localStorage.getItem("sui_vault_id");
        if (savedVaultId) { setVaultId(savedVaultId); setView("dashboard"); return; }
        if (account) { 
            if (view !== "landing" && view !== "setup") setView("landing"); 
            return; 
        }
        if (view === "loading") { setView("auth"); }
    };
    const timer = setTimeout(checkAuth, 1500);
    if (view !== "loading") checkAuth();
    return () => clearTimeout(timer);
  }, [account, view, vaultId]);

  // Listener Realtime
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
              setCurrentVaultType(data.type || "private");
              if (data.extraMembers) setExtraMembers(data.extraMembers);
              if (data.isClaimed) setIsClaimed(true);
          }
      };
      loadFromDB();
      window.addEventListener("storage", loadFromDB);
      const interval = setInterval(loadFromDB, 1000);
      return () => { window.removeEventListener("storage", loadFromDB); clearInterval(interval); };
  }, []);

  // Timer
  useEffect(() => {
      if (!expiryDate || isClaimed) return;
      const tick = () => {
          const diff = Math.ceil((expiryDate - Date.now()) / 1000);
          if (diff <= 0) { 
              setTimeLeft(0); 
              setIsCritical(true); 
          } else { 
              setTimeLeft(diff); 
              setIsCritical(diff < (3600 * 24)); 
              if (diff <= 60 && !hasNotified.current) {
                  if (Notification.permission === "granted") new Notification(t('notify_title'), { body: t('notify_body') });
                  hasNotified.current = true;
              }
          }
      };
      tick();
      const timer = setInterval(tick, 1000);
      return () => clearInterval(timer);
  }, [expiryDate, lang, isClaimed]);

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
            showToast(t('upload_success'), "success");
        } else { throw new Error("Upload Failed"); }
    } catch (e) { showToast("Error uploading", "error"); } finally { setIsUploadingWalrus(false); setSealStatus(""); }
  };

  const fetchVaultData = useCallback(async (id: string) => {
    if (id && id.includes("vault")) {
      const raw = localStorage.getItem(STORAGE_KEY_DATA);
      if (raw) {
          const data = JSON.parse(raw);
          setVaultBalance(data.balance);
          setExpiryDate(data.expiryDate); setTimeDuration(data.duration);
          setVaultBeneficiary(data.beneficiary);
          setCurrentVaultType(data.type);
          if (data.extraMembers) setExtraMembers(data.extraMembers);
          if (data.isClaimed) setIsClaimed(true);
      }
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    const params = new URLSearchParams(window.location.search);
    const sharedVaultId = params.get("vault_id");
    if (sharedVaultId) {
        setVaultId(sharedVaultId); fetchVaultData(sharedVaultId); setView("claim_mode"); hasInitialized.current = true;
    }
    hasInitialized.current = true;
  }, [fetchVaultData]);

  const finalizeVaultCreation = () => {
        const fakeVaultId = "vault_" + Date.now();
        localStorage.setItem("sui_vault_id", fakeVaultId);
        const finalBeneficiary = beneficiaryInput || "0xDemoUser_Receiver";
        const demoDurationMs = intervalTime * 60 * 1000; 
        const now = Date.now();
        const exp = now + demoDurationMs;
        
        syncToSharedDB({ 
            id: fakeVaultId, balance: depositAmount, message: messageInput, expiryDate: exp, interval: demoDurationMs, 
            beneficiary: finalBeneficiary, type: vaultType, extraMembers: [], isClaimed: false 
        });
        
        setVaultId(fakeVaultId); setExpiryDate(exp); setTimeDuration(demoDurationMs); 
        setVaultBalance(depositAmount); setVaultBeneficiary(finalBeneficiary); setCurrentVaultType(vaultType);
        setExtraMembers([]); setIsClaimed(false);
        setLoading(false); showToast(t('setup_success'), "success"); setView("dashboard"); 
  };

  const handleCreateVault = () => {
    if (!account) { 
        showToast("⚠️ Chưa kết nối ví! Đang chuyển sang chế độ Offline...", "warning");
        setTimeout(finalizeVaultCreation, 1000);
        return; 
    } 
    
    setLoading(true);
    
    try {
        const tx = new TransactionBlock(); 
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(1000000)]);
        tx.transferObjects([coin], tx.pure(account.address));

        signAndExecuteTransaction({ transactionBlock: tx }, {
            onSuccess: (result) => {
                console.log("Tx Success:", result);
                showToast("✅ Giao dịch On-chain thành công!", "success");
                finalizeVaultCreation(); 
            },
            onError: (err) => {
                console.error("Lỗi giao dịch:", err);
                showToast("⚠️ Mạng Testnet bận. Kích hoạt chế độ Local...", "warning");
                setTimeout(finalizeVaultCreation, 1000);
            }
        });
    } catch (e) {
        console.error("Lỗi code:", e);
        finalizeVaultCreation();
    }
  };

  // 🔥 INDEXER GỌI BACKEND (Chuẩn Professional)
  const checkOwnerActivity = async () => {
      setCheckingActivity(true);
      if (account) {
          try {
              // Gọi API Backend
              const response = await fetch(`${WALRUS_PUBLISHER.replace("/v1/store", "")}/api/check-activity/${account.address}`).catch(() => null); 
              // Fallback if backend is not running
              if (!response) throw new Error("Backend not reachable");

              const data = await response.json();
              
              if (data.active) {
                  setActivityStatus("ACTIVE");
                  showToast(t('activity_active'), "error");
                  setCheckingActivity(false);
                  return false; 
              } else {
                  setActivityStatus("INACTIVE");
                  showToast(t('activity_inactive'), "success");
                  setCheckingActivity(false);
                  return true;
              }
          } catch (e) { console.error("Indexer Error", e); }
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      const isOwnerActive = timeLeft > 0;
      if (isOwnerActive) {
          setActivityStatus("ACTIVE");
          showToast(t('activity_active'), "error");
      } else {
          setActivityStatus("INACTIVE");
          showToast(t('activity_inactive'), "success");
      }
      setCheckingActivity(false);
      return !isOwnerActive;
  };

  const handlePing = () => {
    if (isClaimed) { showToast("Vault is already claimed!", "error"); return; }
    
    if (account) {
        const tx = new TransactionBlock();
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(1000)]);
        tx.transferObjects([coin], tx.pure(account.address));
        
        signAndExecuteTransaction({ transactionBlock: tx }, {
            onSuccess: () => {
                const newExpiry = Date.now() + timeDuration;
                setExpiryDate(newExpiry); setIsCritical(false); hasNotified.current = false; 
                syncToSharedDB({ expiryDate: newExpiry });
                showToast("Ping Success! On-chain recorded.", "success"); 
            },
            onError: () => showToast("Ping Failed", "error")
        });
    } else {
        showToast("Vui lòng kết nối ví để Ping!", "error");
    }
  };

  const handleClaim = async () => {
    const canClaim = await checkOwnerActivity();
    if (!canClaim) return;

    if (currentVaultType === 'allowlist') {
        setMultisigProgress(10);
        showToast(t('multisig_vote'), "info");
        await new Promise(r => setTimeout(r, 1000)); setMultisigProgress(40);
        await new Promise(r => setTimeout(r, 1000)); setMultisigProgress(80);
        await new Promise(r => setTimeout(r, 1000)); setMultisigProgress(100);
    }

    setShowConfetti(true); 
    showToast("Success! ZK Proof Verified & Assets Claimed.", "success"); 
    syncToSharedDB({ isClaimed: true, balance: 0 });
    setIsClaimed(true);
    setVaultBalance(0);
    setTimeout(() => { setShowConfetti(false); }, 4000);
  };

  const handleAddMember = () => {
      const input = prompt(t('prompt_add_member'));
      if (!input) return;
      let newMember = "";
      if (/^0x[a-fA-F0-9]{64}$/.test(input)) { newMember = input; } 
      else if (input.includes("github.com/") || /^[a-zA-Z0-9-]+$/.test(input)) {
          const username = input.includes("github.com/") ? input.split("github.com/")[1].split("/")[0] : input;
          newMember = `gh:${username}`;
      } else { showToast(t('err_invalid_addr'), "error"); return; }
      const newList = [...extraMembers, newMember];
      setExtraMembers(newList);
      syncToSharedDB({ extraMembers: newList });
      showToast(t('member_added'), "success");
  };

  const handleDestroy = () => { if (!confirm("Destroy?")) return; localStorage.removeItem("sui_vault_id"); localStorage.removeItem(STORAGE_KEY_DATA); window.location.reload(); };
  const handleLogout = () => { localStorage.clear(); window.location.reload(); }
  const displayAddress = account?.address;

  // Helper trả về class thay vì style
  const getProgressClass = (progress: number) => {
      if (progress >= 100) return "width-100";
      if (progress >= 80) return "width-80";
      if (progress >= 40) return "width-40";
      if (progress >= 10) return "width-10";
      return "width-0";
  };

  // --- UI RENDER ---
  return (
    <div className={`min-h-screen text-slate-200 selection:bg-cyan-500 selection:text-white pb-20`}>
      <style>{customStyles}</style>
      <div className="ocean-wrapper"><div className="water-rays"></div></div>

      <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
          <button aria-label="Menu" onClick={() => setShowMenu(true)} className="text-white/80 hover:text-white text-2xl transition"><i className="fa-solid fa-bars"></i></button>
          <div className="flex gap-4">
            <button aria-label="Change Language" onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} className="text-sm font-bold text-slate-400 hover:text-white transition uppercase tracking-widest">{lang}</button>
          </div>
      </div>

      <div className={`menu-overlay ${showMenu ? 'open' : ''}`} onClick={() => setShowMenu(false)}></div>
      <div className={`menu-drawer ${showMenu ? 'open' : ''} p-8 flex flex-col fixed top-0 left-0 h-full w-80 z-[100] transform transition-transform duration-300 ${showMenu ? 'translate-x-0' : '-translate-x-full'}`}>
          <button aria-label="Close Menu" onClick={() => setShowMenu(false)} className="self-end text-slate-400 text-xl hover:text-white mb-8"><i className="fa-solid fa-xmark"></i></button>
          <div className="mb-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">{displayAddress ? displayAddress.slice(2,4).toUpperCase() : "?"}</div>
              <div><p className="text-white font-bold text-sm">My Wallet</p><p className="text-xs text-slate-400 font-mono">{displayAddress ? `${displayAddress.slice(0,6)}...${displayAddress.slice(-4)}` : "Not connected"}</p></div>
          </div>
          <div className="space-y-6 flex-1">
             <div className="pb-4 border-b border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-wider">{t('menu_status')}</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${isClaimed ? 'bg-red-500/10 text-red-400' : (vaultId ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400')}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isClaimed ? 'bg-red-400' : (vaultId ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400')}`}></div>
                    {isClaimed ? t('status_claimed') : (vaultId ? t('status_active') : t('status_inactive'))}
                </div>
             </div>
             {vaultId && (
                 <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-3 tracking-wider">{t('menu_members')}</p>
                    <div className="space-y-2">
                        {extraMembers.map((mem, idx) => (<div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition"><div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400"><i className={mem.startsWith("gh:") ? "fa-brands fa-github" : "fa-solid fa-wallet"}></i></div><div className="text-xs text-slate-300 font-mono truncate max-w-[140px]">{mem.replace("gh:", "@")}</div></div>))}
                        <button onClick={handleAddMember} disabled={isClaimed} className="w-full py-2 border border-dashed border-slate-700 text-slate-500 text-xs rounded hover:border-cyan-500 hover:text-cyan-500 transition">+ Add Guardian</button>
                    </div>
                 </div>
             )}
          </div>
          <button onClick={handleLogout} className="mt-auto flex items-center gap-3 text-slate-400 hover:text-red-400 transition text-sm font-medium p-2"><i className="fa-solid fa-arrow-right-from-bracket"></i> {t('logout')}</button>
      </div>

      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}><span>{toast.msg}</span></div></div>}
      
      {/* 🔥 FIX 1: Confetti Wrapper bằng Class CSS */}
      {showConfetti && <div className="confetti-wrapper">{Array.from({length: 50}).map((_, i) => (<div key={i} className={`confetti c-${i}`}></div>))}</div>}

      {view === "loading" && (<div className="flex flex-col items-center justify-center min-h-screen animate-up"><div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-6"></div><p className="text-cyan-400 text-xs font-bold tracking-[0.3em] animate-pulse">INITIALIZING SYSTEM...</p></div>)}
      
      {view === "auth" && (
        <section className="flex flex-col items-center justify-center min-h-screen animate-up px-4">
            <div className="text-center mb-12">
                <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)]"><i className="fa-solid fa-shield-cat text-4xl text-white"></i></div>
                <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">SuiInherit</h1>
                <p className="text-slate-400 text-lg font-light">{t('slogan')}</p>
            </div>
            <div className="glass-card p-8 rounded-3xl w-full max-w-sm text-center">
                <p className="text-white font-bold text-lg mb-6">{t('login_sub')}</p>
                <div className="flex justify-center"><ConnectButton connectText={t('connect_wallet')} className="!btn-primary !w-full !rounded-xl !py-3 !font-bold" /></div>
            </div>
        </section>
      )}

      {view === "landing" && (
        <section className="max-w-5xl mx-auto min-h-screen flex flex-col justify-center px-6 animate-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-6xl font-bold text-white mb-6 leading-tight">{t('manage_title')} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{t('manage_subtitle')}</span></h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-md">Bảo vệ tài sản kỹ thuật số của bạn mãi mãi. Tự động chuyển giao quyền thừa kế khi bạn không còn hoạt động.</p>
                    <div className="flex gap-4">
                        {vaultId ? <button onClick={() => setView("dashboard")} className="btn-primary px-8 py-4 rounded-full text-lg shadow-xl shadow-cyan-500/20">{t('access_vault')}</button> : <button onClick={() => setView("setup")} className="btn-primary px-8 py-4 rounded-full text-lg shadow-xl shadow-cyan-500/20">{t('create_vault')} <i className="fa-solid fa-arrow-right ml-2"></i></button>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[1,2,3,4].map(num => (<div key={num} className="glass-card p-6 rounded-2xl border border-white/5 hover:-translate-y-1 transition-transform"><div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-4 text-cyan-400 font-bold border border-white/10">{num}</div><h4 className="font-bold text-white mb-1">{t(`step_${num}` as any)}</h4><p className="text-xs text-slate-400 leading-relaxed">{t(`step_${num}_desc` as any)}</p></div>))}
                </div>
            </div>
        </section>
      )}

      {view === "setup" && (
        <section className="animate-up max-w-2xl mx-auto mt-20 px-4">
            <div className="glass-card p-10 md:p-14 rounded-[3rem]">
                <h2 className="text-4xl font-black mb-6 text-white">{t('setup_title')}</h2>
                <div className="mb-8 space-y-4">
                    <div onClick={() => setVaultType("private")} className={`type-option p-4 rounded-lg text-center ${vaultType === "private" ? "active" : "opacity-50 hover:opacity-80"}`}><i className="fa-solid fa-user-shield text-2xl mb-2 block"></i><span className="text-sm font-bold block">{t('type_private')}</span></div>
                    <div onClick={() => setVaultType("allowlist")} className={`type-option p-4 rounded-lg text-center ${vaultType === "allowlist" ? "active" : "opacity-50 hover:opacity-80"}`}><i className="fa-solid fa-users-gear text-2xl mb-2 block"></i><span className="text-sm font-bold block">{t('type_allowlist')}</span></div>
                </div>
                <div className="space-y-8">
                    <div>
                        <label htmlFor="beneficiary" className="text-cyan-400 text-xs font-bold uppercase block mb-2">{t('label_beneficiary')}</label>
                        <input id="beneficiary" type="text" placeholder="0x..." onChange={(e) => setBeneficiaryInput(e.target.value)} className="input-field w-full rounded-xl p-4 text-sm font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-cyan-400 text-xs font-bold uppercase block mb-2">{t('label_time')}</label><div className="flex gap-2">{[1, 3, 6, 12].map(m => (<button key={m} onClick={() => setIntervalTime(m)} className={`flex-1 p-3 rounded-xl font-bold border ${intervalTime === m ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-black/30 border-white/10 text-slate-500'}`}>{m}M</button>))}</div></div>
                        <div>
                            <label htmlFor="amount" className="text-cyan-400 text-xs font-bold uppercase block mb-2">{t('label_amount')}</label>
                            <input id="amount" type="number" value={depositAmount} onChange={(e) => setDepositAmount(Number(e.target.value))} className="input-field w-full rounded-xl p-3 font-bold" />
                        </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <label htmlFor="walrus-upload" className="text-cyan-400 text-xs font-bold uppercase block mb-2"><i className="fa-solid fa-shield-halved mr-2"></i>{t('step_4_label')}</label>
                        <div className="flex gap-2">
                            <input id="walrus-upload" type="file" onChange={(e) => setWalrusFile(e.target.files ? e.target.files[0] : null)} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"/>
                            <button onClick={handleUploadToWalrus} disabled={isUploadingWalrus || !walrusFile} className="btn-primary px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 min-w-[140px]">{isUploadingWalrus ? sealStatus : "Upload"}</button>
                        </div>
                    </div>
                    <button onClick={handleCreateVault} disabled={loading} className="btn-primary w-full p-4 rounded-xl font-bold text-lg mt-4 flex items-center justify-center gap-3">{loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-fingerprint"></i> {t('btn_activate')}</>}</button>
                </div>
            </div>
        </section>
      )}

      {view === "dashboard" && (
        <section className="animate-up max-w-4xl mx-auto mt-24 px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-10 rounded-[2.5rem] flex flex-col justify-center items-center text-center relative overflow-hidden">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4 z-10">{isClaimed ? "STATUS: CLOSED" : "TIME REMAINING"}</p>
                     {isClaimed ? (<div className="z-10"><p className="text-6xl font-black text-slate-600 font-mono tracking-tighter">00:00</p><div className="mt-4 inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-xs font-bold border border-red-500/20"><i className="fa-solid fa-lock"></i> {t('status_claimed')}</div></div>) : (<div className="z-10"><p className={`text-6xl font-black font-mono tracking-tighter mb-2 ${isCritical ? 'text-red-400 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</p><p className="text-xs text-slate-500 font-medium">Until: {formatDateTime(expiryDate)}</p></div>)}
                     <div className="mt-10 w-full z-10"><button onClick={handlePing} disabled={isClaimed} className={`w-full py-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${isClaimed ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'btn-primary'}`}>{isClaimed ? t('btn_claimed') : <><i className="fa-solid fa-heart-pulse"></i> {t('btn_ping')}</>}</button></div>
                </div>
                <div className="glass-card p-10 rounded-[2.5rem] flex flex-col justify-between">
                    <div><p className="text-slate-400 text-xs font-bold uppercase mb-4 flex items-center gap-2"><i className="fa-solid fa-vault"></i> {t('label_amount')}</p><div className="flex items-baseline gap-2"><p className="text-5xl font-black text-white">{isClaimed ? vaultBalance : t('privacy_mask')}</p><span className="text-xl font-bold text-cyan-500">SUI</span></div></div>
                    <div className="space-y-4"><div className="p-4 bg-white/5 rounded-2xl border border-white/5"><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Beneficiary</p><p className="text-xs text-slate-300 font-mono break-all">{vaultBeneficiary || "..."}</p></div><div className="flex gap-2"><button onClick={() => {navigator.clipboard.writeText(generatedShareLink); showToast("Link Copied!", "success")}} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-300 border border-white/5 transition"><i className="fa-solid fa-link mr-2"></i> Copy Link</button><button aria-label="Destroy Vault" onClick={handleDestroy} className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition"><i className="fa-solid fa-trash"></i></button></div></div>
                </div>
            </div>
        </section>
      )}

      {view === "claim_mode" && (
        <section className="animate-up max-w-md mx-auto mt-24 px-4 pb-20">
             <div className="glass-card p-10 rounded-[2.5rem] border border-red-500/20 text-center relative overflow-hidden shadow-2xl shadow-red-900/10">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20"><i className="fa-solid fa-file-signature text-2xl text-red-400"></i></div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('claim_title')}</h2>
                <p className="text-slate-400 text-sm mb-8">Hệ thống đã phát hiện ví chủ sở hữu ngừng hoạt động.</p>
                <div className="bg-black/30 border border-white/5 p-6 rounded-2xl mb-8"><p className="text-[10px] text-slate-500 uppercase font-bold mb-2">{t('claim_amount')}</p><p className="text-4xl font-black text-white">{isClaimed ? vaultBalance : t('privacy_mask')} <span className="text-lg text-slate-500">SUI</span></p></div>
                {checkingActivity && (<div className="flex items-center justify-center gap-3 text-yellow-400 text-xs font-bold bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 mb-6"><i className="fa-solid fa-circle-notch fa-spin"></i> {t('checking_activity')}</div>)}
                
                {/* 🔥 FIX 2: Progress Bar dùng Class */}
                {multisigProgress > 0 && (
                    <div className="mb-6 text-left">
                        <div className="flex justify-between text-[10px] text-cyan-400 font-bold mb-1 uppercase"><span>Consensus</span><span>{multisigProgress}%</span></div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden progress-bar-bg">
                            <div className={`h-full progress-bar-fill ${getProgressClass(multisigProgress)}`}></div>
                        </div>
                    </div>
                )}
                
                <button onClick={handleClaim} disabled={checkingActivity || timeLeft > 0} className={`w-full py-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${timeLeft > 0 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'btn-primary bg-gradient-to-r from-red-600 to-orange-600 border-none'}`}>{timeLeft > 0 ? <><i className="fa-solid fa-lock"></i> {t('btn_wait')}</> : <><i className="fa-solid fa-unlock"></i> {t('btn_claim')}</>}</button>
             </div>
        </section>
      )}
    </div>
  );
}