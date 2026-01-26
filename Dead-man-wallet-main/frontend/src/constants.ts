// src/constants.ts

// --- 1. CẤU HÌNH BLOCKCHAIN ---
export const NETWORK = "testnet";
export const WALRUS_PUBLISHER = "https://publisher.walrus-testnet.walrus.space/v1/store";
export const STORAGE_KEY_DATA = "sui_demo_data";

// ⚠️ QUAN TRỌNG: Thay thế bằng Package ID bạn nhận được khi publish thành công
export const PACKAGE_ID = "0x98f792617bdbf022716ef8a3b56f541824595444f9199b4470ccc0075ff824a3";

// ⚠️ QUAN TRỌNG: Tên này phải trùng khớp với tên module trong file Move (sui_inherit.move)
export const MODULE_NAME = "sui_inherit"; 

// --- 2. CẤU HÌNH BACKEND ---
// Đang trỏ về Local (Máy tính). Nếu muốn dùng bản trên mạng (Render) thì đổi dòng này.
export const BACKEND_API = "http://localhost:3000/api"; 
// export const BACKEND_API = "https://sui-inherit-backend.onrender.com/api"; // Link Render dự phòng

// --- 3. NGÔN NGỮ & TEXT (Giao diện) ---
export const TRANSLATIONS = {
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

// --- 4. CSS STYLES (Ocean Theme) ---
export const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
  
  body { 
    font-family: 'Outfit', sans-serif; 
    background-color: #0b0c15; 
    color: white; 
    overflow-x: hidden; 
    margin: 0; 
  }

  .ocean-wrapper { 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100vw; 
    height: 100vh; 
    z-index: -1; 
    overflow: hidden; 
    background: radial-gradient(circle at 50% 100%, #0c4a6e, #020617 60%); 
  }

  .water-rays { 
    position: absolute; 
    top: -50%; 
    left: -50%; 
    width: 200%; 
    height: 200%; 
    background: transparent; 
    background-image: linear-gradient(transparent 30%, rgba(6, 182, 212, 0.1) 40%, transparent 50%), 
                      linear-gradient(90deg, transparent 30%, rgba(56, 189, 248, 0.05) 40%, transparent 50%); 
    background-size: 200% 200%; 
    animation: ripple 15s linear infinite; 
    filter: blur(3px); 
    opacity: 0.7; 
  }

  @keyframes ripple { 
    0% { transform: rotate(0deg) scale(1); } 
    50% { transform: rotate(5deg) scale(1.1); } 
    100% { transform: rotate(0deg) scale(1); } 
  }

  .glass-card { 
    background: rgba(15, 23, 42, 0.6); 
    backdrop-filter: blur(24px); 
    -webkit-backdrop-filter: blur(24px); 
    border: 1px solid rgba(255, 255, 255, 0.08); 
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3); 
    transition: all 0.3s ease; 
  }

  .glass-card:hover { 
    border-color: rgba(56, 189, 248, 0.3); 
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.15); 
  }

  .btn-primary { 
    background: linear-gradient(135deg, #0ea5e9, #2563eb); 
    color: white; 
    font-weight: 600; 
    transition: all 0.3s; 
    box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); 
  }

  .btn-primary:hover { 
    transform: translateY(-1px); 
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5); 
  }

  .btn-primary:disabled { 
    background: #334155; 
    color: #94a3b8; 
    box-shadow: none; 
    cursor: not-allowed; 
  }

  .input-field { 
    background: rgba(0, 0, 0, 0.2); 
    border: 1px solid rgba(255, 255, 255, 0.08); 
    color: white; 
    transition: all 0.3s; 
  }

  .input-field:focus { 
    border-color: #0ea5e9; 
    background: rgba(14, 165, 233, 0.05); 
    outline: none; 
  }

  .animate-up { 
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
  }

  @keyframes fadeInUp { 
    from { opacity: 0; transform: translateY(30px); } 
    to { opacity: 1; transform: translateY(0); } 
  }

  .menu-drawer { 
    background: #0f172a; 
    border-right: 1px solid #1e293b; 
  }

  .toast-container { 
    position: fixed; 
    top: 20px; 
    right: 20px; 
    z-index: 9999; 
    display: flex; 
    flex-direction: column; 
    gap: 10px; 
  }

  .toast { 
    min-width: 300px; 
    padding: 16px 24px; 
    border-radius: 16px; 
    background: #1e293b; 
    border: 1px solid #334155; 
    box-shadow: 0 10px 40px rgba(0,0,0,0.5); 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    color: white; 
    font-weight: 600; 
    animation: slideInRight 0.4s forwards; 
  }

  .toast.success { border-left: 4px solid #10b981; } 
  .toast.error { border-left: 4px solid #ef4444; } 
  .toast.info { border-left: 4px solid #3b82f6; } 
  .toast.warning { border-left: 4px solid #f59e0b; }

  .type-option { 
    cursor: pointer; 
    border: 1px solid rgba(255,255,255,0.1); 
    transition: all 0.3s; 
  }

  .type-option.active { 
    background: rgba(14, 165, 233, 0.1); 
    border-color: #0ea5e9; 
  }

  .confetti { 
    position: fixed; 
    top: 0; 
    left: var(--c-left); 
    width: 10px; 
    height: 10px; 
    background: var(--c-bg); 
    animation: fall linear forwards; 
    animation-duration: var(--c-dur); 
    z-index: 9999; 
  }

  @keyframes fall { 
    to { transform: translateY(100vh) rotate(720deg); opacity: 0; } 
  }

  .progress-bar-bg { background-color: #1e293b; }
  .progress-bar-fill { background-color: #06b6d4; transition: width 0.3s; width: var(--p-width); }
`;