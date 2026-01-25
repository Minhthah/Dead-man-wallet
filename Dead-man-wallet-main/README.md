# 🏺 SuiInherit Protocol
**SuiInherit** là một giải pháp di chúc số (Dead Man's Switch) thông minh trên hệ sinh thái Sui, giúp bảo mật và tự động hóa việc chuyển giao tài sản cho người thừa kế.

## 🚀 Tính năng chính
- **Vault Security:** Tài sản được khóa trong Smart Contract an toàn.
- **Dead Man's Switch:** Cơ chế đếm ngược thời gian thực trên On-chain.
- **Heartbeat (Ping):** Chủ sở hữu chỉ cần 1 click để gia hạn thời gian di chúc.
- **Emergency Withdrawal Protection:** Timelock 24h cho việc rút tiền khẩn cấp.
- **Automatic Claim:** Người thừa kế có thể rút tài sản khi quá hạn mà không cần sự can thiệp của bên thứ ba.
- **Cancel Emergency:** Chủ sở hữu có thể hủy yêu cầu rút tiền khẩn cấp bất kỳ lúc nào.

## ⛓️ Thông tin Deployment (Testnet)
- **Package ID:** `0xba04a004bd0e13846af8e7f5238276d513ba02a015a3da6ed6eb19b90be807b5`
- **Network:** Sui Testnet
- **Contract Language:** Move (Edition 2024)

## 🛠 Hướng dẫn cho Developer
### Yêu cầu:
- Sui CLI installed
- Move 2024 compiler

### Build & Test:
```bash
sui move build
sui move test
```

### Smart Contract Functions:
- `create_vault()` - Tạo vault mới với beneficiary và time interval
- `ping()` - Gia hạn thời gian (heartbeat)
- `request_emergency_withdrawal()` - Yêu cầu rút tiền khẩn cấp
- `execute_emergency_withdrawal()` - Thực hiện rút sau 24h timelock
- `cancel_emergency_withdrawal()` - Hủy yêu cầu rút tiền khẩn cấp
- `claim()` - Beneficiary nhận thừa kế sau khi quá hạn

## 🖥️ Full Stack Implementation

### Backend API (Node.js/TypeScript)
- **Location:** `backend/` folder
- **Framework:** Express.js with TypeScript
- **Features:**
  - RESTful API cho tất cả vault operations
  - Wallet signature verification
  - Sui blockchain integration
  - CORS support
  - Input validation với Joi
  - Winston logging

#### Setup Backend:
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your package ID
npm run dev
```

### Frontend (Vanilla JS + HTML/CSS)
- **Location:** `ASSETS/test2.html`
- **Features:**
  - Modern UI với Tailwind CSS
  - Sui Wallet Kit integration
  - Real-time vault status
  - Emergency withdrawal interface
  - Responsive design
  - Toast notifications

#### Chạy Frontend:
```bash
# Sử dụng local server
npx serve ASSETS/

# Hoặc mở trực tiếp trong browser
# file:///path/to/Dead-man-wallet-main/ASSETS/test2.html
```

## 🔧 Development Setup

1. **Clone repository**
2. **Setup Smart Contract:**
   ```bash
   sui move build
   sui move test
   sui client publish --gas-budget 10000000
   ```
3. **Setup Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. **Setup Frontend:**
   - Mở `ASSETS/test2.html` trong browser
   - Kết nối Sui wallet
   - Test các tính năng

## 📡 API Reference

### Base URL: `http://localhost:3001`

#### Health Check
```http
GET /health
```

#### Vault Management
```http
POST /api/vault/create
POST /api/vault/ping
POST /api/vault/claim
POST /api/vault/emergency/request
POST /api/vault/emergency/execute
GET  /api/vault/:vaultId
```

Xem chi tiết tại `backend/README.md`

## 🧪 Testing

### Smart Contract Tests:
```bash
sui move test
```

### API Tests:
```bash
# Health check
curl http://localhost:3001/health

# Create vault (requires wallet signature)
curl -X POST http://localhost:3001/api/vault/create \
  -H "Content-Type: application/json" \
  -d '{"beneficiary": "0x...", "timeInterval": 15552000, ...}'
```

## 🔒 Security Features

- **Wallet Signature Verification:** Tất cả API calls đều yêu cầu signature
- **Input Validation:** Comprehensive validation với Joi
- **CORS Protection:** Configured CORS policies
- **Rate Limiting:** Ready for implementation
- **Timelock Protection:** 24h emergency withdrawal delay
- **Owner Authorization:** Only vault owner can perform sensitive operations

## 🚨 Important Notes

- **Devnet Only:** Hiện tại chỉ hoạt động trên Sui Devnet
- **Demo Keys:** Private keys trong code chỉ dành cho demo
- **Database:** Cần database để track OwnerCap objects trong production
- **Gas Fees:** Users cần có đủ SUI để trả gas fees

## 📖 Documentation

- **Setup Guide:** `SETUP_GUIDE.md`
- **Backend API:** `backend/README.md`
- **Smart Contract:** Comments trong `sources/vault.move`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend  
npx serve ASSETS/

# Mở browser: http://localhost:5000/test2.html




set up 
# SuiInherit Setup Guide

## Tổng quan

SuiInherit là một giao thức di chúc số trên blockchain Sui, cho phép người dùng bảo vệ tài sản của mình thông qua cơ chế "dead man's switch".

## Cấu trúc Project

```
Dead-man-wallet-main/
├── sources/                 # Smart contracts (Move)
├── tests/                   # Unit tests cho smart contracts
├── backend/                 # Backend API (Node.js/TypeScript)
├── ASSETS/                  # Frontend files
├── Move.toml               # Sui package config
└── README.md
```

## Setup Instructions

### 1. Smart Contract Setup

#### Cài đặt Sui CLI
```bash
# Windows (PowerShell)
irm get.sui.io | iex
```

#### Kiểm tra cài đặt
```bash
sui --version
```

#### Build và test smart contract
```bash
sui move build
sui move test
```

#### Deploy contract (Devnet)
```bash
sui client publish --gas-budget 10000000
```
Lưu lại `package_id` từ kết quả deploy để dùng cho backend.

### 2. Backend Setup

#### Cài đặt dependencies
```bash
cd backend
npm install
```

#### Cấu hình environment
```bash
cp env.example .env
```

Chỉnh sửa `.env`:
```env
SUI_NETWORK=devnet
SUI_PACKAGE_ID=your_deployed_package_id_here
PORT=3001
NODE_ENV=development
```

#### Chạy backend
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Backend sẽ chạy tại `http://localhost:3001`

### 3. Frontend Setup

#### Mở file HTML
Mở `ASSETS/test2.html` trong browser hoặc serve với local server:

```bash
# Nếu có Python
python -m http.server 8000

# Nếu có Node.js
npx serve ASSETS/
```

#### Kết nối wallet
1. Mở file HTML trong browser
2. Click "Connect Sui Wallet"
3. Chọn ví Sui và approve connection
4. Tạo vault mới hoặc sử dụng vault hiện có

## API Endpoints

### Health Check
```
GET /health
```

### Vault Operations
```
POST /api/vault/create      # Tạo vault mới
POST /api/vault/ping        # Ping để reset timer
POST /api/vault/claim       # Claim inheritance
POST /api/vault/emergency/request   # Request emergency withdrawal
POST /api/vault/emergency/execute   # Execute emergency withdrawal
GET  /api/vault/:vaultId    # Lấy thông tin vault
```

## Testing

### Unit Tests (Smart Contract)
```bash
sui move test
```

### API Testing
```bash
# Health check
curl http://localhost:3001/health

# Tạo vault (cần wallet signature)
curl -X POST http://localhost:3001/api/vault/create \
  -H "Content-Type: application/json" \
  -d '{
    "beneficiary": "0x...",
    "timeInterval": 15552000,
    "initialAmount": "1000000000",
    "signature": "...",
    "message": "...",
    "address": "..."
  }'
```

## Development Notes

### Smart Contract
- Code ở `sources/vault.move`
- Tests ở `tests/vault_tests.move`
- Sử dụng Sui Move language

### Backend
- TypeScript + Express
- Sui SDK cho blockchain interaction
- Wallet signature verification
- RESTful API design

### Frontend
- Vanilla JavaScript + HTML/CSS
- Tailwind CSS cho styling
- Sui Wallet Kit cho wallet connection
- Responsive design

## Security Considerations

1. **Private Keys**: Không bao giờ lưu private keys trong code
2. **Signatures**: Tất cả transactions cần wallet signature
3. **Rate Limiting**: Thêm rate limiting cho production
4. **Input Validation**: Validate tất cả inputs
5. **CORS**: Configure CORS properly

## Troubleshooting

### Backend không start được
- Kiểm tra PORT có bị chiếm không
- Kiểm tra .env file
- Kiểm tra dependencies đã install chưa

### Wallet không kết nối được
- Đảm bảo có Sui wallet extension
- Kiểm tra network (Devnet)
- Refresh page và thử lại

### Smart contract lỗi
- Chạy `sui move build` để check syntax
- Đảm bảo có đủ gas budget
- Kiểm tra network connection

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License
