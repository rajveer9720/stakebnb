import { getWalletSymbol } from "../utils/ProviderUtils";

export interface CardData {
  id: string;
  title: string;
  value: string;
  unit: string;
  iconClass: string;
}

interface ContractData {
  depositAmount: number;
  totalUsers: number;
  totalStaked: number;
  contractBalance: number;
}

export const getCardDataContractData = (data: ContractData): CardData[] => {
  const symbol = getWalletSymbol(); 
  return [
    {
      id: "deposited",
      title: "Total Staked",
      value: (data?.totalStaked)?.toFixed(4) || "0.000",
      unit: ` ${symbol}`,
      iconClass: "bi bi-wallet2 fs-3 text-primary",
    },
    {
      id: "users",
      title: "Users",
      value: data?.totalUsers.toString() || "0",
      unit: "",
      iconClass: "bi bi-person-circle fs-3 text-primary",
    },
    {
      id: "deposited2",
      title: "Deposit",
      value: (data?.depositAmount)?.toFixed(4) || "0.000",
      unit: `${symbol}`,
      iconClass: "bi bi-arrow-down-circle fs-3 text-primary",
    },
    {
      id: "contractBalance",
      title: "Contract Balance",
      value: (data?.contractBalance)?.toFixed(4) || "0.000",
      unit: ` ${symbol}`,
      iconClass: "bi bi-bank fs-3 text-primary",
    },
  ];
};
