import {
  bscTestnet,
  bsc,
  polygonAmoy,
  polygon,
  avalanche,
  avalancheFuji,
  sonic,
  sonicBlazeTestnet,
} from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  trustWallet,
  binanceWallet,
  rainbowWallet,
  phantomWallet,
  rabbyWallet,
  ledgerWallet,
  okxWallet,
  braveWallet,
  argentWallet,
  uniswapWallet,
  safepalWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const getNetwork = () => {
  const chainId = import.meta.env.VITE_APP_APPKIT_CHAIN_ID;
  switch (chainId) {
    case "bsc":
      return bsc;
    case "bscTestnet":
      return bscTestnet;
    case "polygon":
      return polygon;
    case "polygonAmoy":
      return polygonAmoy;
    case "avax":
      return avalanche;
    case "avaxFuji":
      return avalancheFuji;
    case "sonic":
      return sonic;
    case "sonicTestnet":
      return sonicBlazeTestnet;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

export const getWalletSymbol = () => {
  const chainId = import.meta.env.VITE_APP_APPKIT_CHAIN_ID;
  const chainIdMap: Record<string, string> = {
    bsc: "BNB",
    bscTestnet: "BNB",
    polygon: "POL",
    polygonAmoy: "POL",
    avax: "AVAX",
    avaxFuji: "AVAX",
    sonic: "S",
    sonicTestnet: "S",
  };
  if (chainId in chainIdMap) {
    return chainIdMap[chainId];
  }
  throw new Error(`Unsupported chain ID: ${chainId}`);
};

export const getWalletChainId = () => {
  const chainId = import.meta.env.VITE_APP_APPKIT_CHAIN_ID;
  const chainIdMap: Record<string, number> = {
    bsc: 56,
    bscTestnet: 97,
    polygon: 137,
    polygonAmoy: 80002,
    avax: 43114,
    avaxFuji: 43113,
    sonic: 146,
    sonicTestnet: 57054,
  };
  if (chainId in chainIdMap) {
    return chainIdMap[chainId];
  }
  throw new Error(`Unsupported chain ID: ${chainId}`);
};

export const walletConfig = getDefaultConfig({
  appName: import.meta.env.VITE_APP_TITLE || "",
  projectId: import.meta.env.VITE_APP_APPKIT_PROJECT_ID || "",
  chains: [getNetwork()],
  transports: {
    [getNetwork().id]: http(import.meta.env.VITE_APP_INFURA_API_URL),
  },
  ssr: true,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        trustWallet,
        walletConnectWallet,
        coinbaseWallet,
      ],
    },
    {
      groupName: "Others",
      wallets: [
        binanceWallet,
        rainbowWallet,
        phantomWallet,
        rabbyWallet,
        ledgerWallet,
        okxWallet,
        braveWallet,
        argentWallet,
        uniswapWallet,
        safepalWallet,
      ],
    },
  ],
});
