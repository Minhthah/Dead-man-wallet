// Ví dụ cấu trúc dữ liệu mới trong Move (Sui)

struct WillConfig has key, store {
    id: UID,
    owner: address,
    lawyer: address, // Địa chỉ ví của Luật sư
    is_approved: bool, // Mặc định là false, Law ký xong mới thành true
    
    // Danh sách người thừa kế và tỷ lệ
    beneficiaries: vector<address>, 
    percentages: vector<u64>, // Ví dụ: [50, 30, 20]
    
    unlock_time: u64,
    balance: Balance<SUI>
}

// Hàm 1: User tạo di chúc (Chưa có hiệu lực)
public fun create_will(ctx: &mut TxContext, lawyer_addr: address, ...) {
    // ... tạo WillConfig với is_approved = false
}

// Hàm 2: Lawyer phê duyệt (Chỉ Lawyer mới gọi được)
public fun approve_will(will: &mut WillConfig, ctx: &mut TxContext) {
    assert!(sender(ctx) == will.lawyer, ENotLawyer); // Kiểm tra đúng là luật sư
    will.is_approved = true; // Kích hoạt di chúc
}

// Hàm 3: Rút tiền (Chỉ chạy khi is_approved = true và hết thời gian)
public fun distribute(will: &mut WillConfig, ctx: &mut TxContext) {
    assert!(will.is_approved, ENotApproved);
    // ... logic chia tiền 50/30/20
}