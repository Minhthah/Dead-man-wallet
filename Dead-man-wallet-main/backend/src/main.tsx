import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "./index.css"; // File chứa Tailwind của bạn

import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

// Cấu hình mạng Testnet
const { networkConfig } = createNetworkConfig({
	testnet: { url: getFullnodeUrl("testnet") },
	mainnet: { url: getFullnodeUrl("mainnet") },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			{/* Quan trọng: Bọc App trong SuiClientProvider và WalletProvider */}
			<SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
				<WalletProvider>
					<App />
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);