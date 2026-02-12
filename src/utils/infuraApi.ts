import { ethers } from "ethers";
import { INFURA_API_URL, CONTRACT_ADDRESS, ABI } from "./constants";

interface ContractData {
  contractBalance: number;
  totalStaked: number;
  totalUsers: number;
  totalRefReward: number;

  checkpoint?: number;
  referrer?: string;
  directedReferralsCount?: number;
  qualifiedReferralsCount?: number;
  userDownlineCount?: number[];

  userAvailable?: number;
  userAvailableROI?: number;
  userAvailableRewards?: number;
  userReferralBonus?: number;
  userReferralTotalBonus?: number;
  userReferralWithdrawn?: number;
  userDepositBonus?: number;
  userTotalDepositBonus?: number;
  userGiveawayBonus?: number;
  userTotalGiveawayBonus?: number;

  userLockedROI?: number;
  userTotalDeposits: number;
  UserActualDividends?: number;
  userProfit: number;
  referralLink: string;

  totalROIWithdrawn?: number;
  totalRewardsWithdrawn?: number;
}

const getProviderAndContract = () => {
  const provider = new ethers.JsonRpcProvider(INFURA_API_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  return { provider, contract };
};

export const fetchContractData = async (
  address?: string
): Promise<ContractData> => {
  try {
    const { contract } = getProviderAndContract();

    const [contractBalance, totalStaked, totalUsers, totalRefBonus] = await Promise.all([
      contract.getContractBalance(),
      contract.totalStaked(),
      contract.getTotalUsers(),
      contract.totalRefBonus(),
    ]);

    let referralLink = "";

    const data: ContractData = {
      contractBalance: Number(ethers.formatEther(contractBalance)),
      totalStaked: Number(ethers.formatEther(totalStaked)),
      totalUsers: Number(totalUsers.toString()),
      totalRefReward: Number(ethers.formatEther(totalRefBonus)),
      userTotalDeposits: 0,
      userProfit: 0,
      referralLink: "",
      userLockedROI: 0,
    };

    if (address) {
      try {
        const [
          checkpoint,
          referrer,
          directedReferralsCount,
          qualifiedReferralsCount,
          userTotalDeposits,
        ] = await Promise.all([
          contract.getUserCheckpoint(address),
          contract.getUserReferrer(address),
          contract.getUserDirectReferralsCount(address),
          contract.getQualifiedDirects(address),
          contract.getUserTotalDeposits(address),
        ]);

        data.checkpoint = Number(checkpoint.toString());
        data.referrer = String(referrer);
        data.directedReferralsCount = Number(directedReferralsCount.toString());
        data.qualifiedReferralsCount = Number(qualifiedReferralsCount.toString());
        data.userTotalDeposits = Number(ethers.formatEther(userTotalDeposits));
      } catch {}

      try {
        const [
          userAvailable,
          userAvailableROI,
          userAvailableRewards,
          UserActualDividends,
        ] = await Promise.all([
          contract.getUserAvailable(address),
          contract.getUserAvailableROI(address),
          contract.getUserAvailableRewards(address),
          contract.getUserActualDividends(address),
        ]);

        data.userAvailable = Number(ethers.formatEther(userAvailable));
        data.userAvailableROI = Number(ethers.formatEther(userAvailableROI));
        data.userAvailableRewards = Number(
          ethers.formatEther(userAvailableRewards)
        );
        data.UserActualDividends = Number(ethers.formatEther(UserActualDividends));
      } catch {}

      try {
        const [
          userReferralBonus,
          userReferralTotalBonus,
          userReferralWithdrawn,
        ] = await Promise.all([
          contract.getUserReferralBonus(address),
          contract.getUserReferralTotalBonus(address),
          contract.getUserReferralWithdrawn(address),
        ]);

        data.userReferralBonus = Number(ethers.formatEther(userReferralBonus));
        data.userReferralTotalBonus = Number(
          ethers.formatEther(userReferralTotalBonus)
        );
        data.userReferralWithdrawn = Number(
          ethers.formatEther(userReferralWithdrawn)
        );
      } catch {}

      try {
        const [userDepositBonus, userTotalDepositBonus] = await Promise.all([
          contract.getUserDepositBonus(address),
          contract.getUserTotalDepositBonus(address),
        ]);

        data.userDepositBonus = Number(ethers.formatEther(userDepositBonus));
        data.userTotalDepositBonus = Number(
          ethers.formatEther(userTotalDepositBonus)
        );
      } catch {}

      try {
        const [userGiveawayBonus, userTotalGiveawayBonus] = await Promise.all([
          contract.getUserGiveawayBonus(address),
          contract.getUserTotalGiveawayBonus(address),
        ]);

        data.userGiveawayBonus = Number(ethers.formatEther(userGiveawayBonus));
        data.userTotalGiveawayBonus = Number(
          ethers.formatEther(userTotalGiveawayBonus)
        );
      } catch {}

      try {
        const [totalROIWithdrawn, totalRewardsWithdrawn] = await Promise.all([
          contract.getTotalROIWithdrawn(address),
          contract.getTotalRewardsWithdrawn(address),
        ]);

        data.totalROIWithdrawn = Number(ethers.formatEther(totalROIWithdrawn));
        data.totalRewardsWithdrawn = Number(
          ethers.formatEther(totalRewardsWithdrawn)
        );
      } catch {}

      try {
        const downlineCount = await contract.getUserDownlineCount(address);
        data.userDownlineCount = downlineCount.map((count: bigint) =>
          Number(count.toString())
        );
      } catch {}

      referralLink = `${window.location.origin}/?ref=${address}`;
    }

    const userProfit =
      data.userTotalDeposits > 0 && data.UserActualDividends
        ? Number(((data.UserActualDividends / data.userTotalDeposits) * 100).toFixed(2))
        : 0;

    data.userProfit = userProfit;
    data.referralLink = referralLink;
    const totalLockedROI = (data.UserActualDividends ?? 0) - (data.userAvailableROI ?? 0);
    data.userLockedROI = Number(totalLockedROI.toFixed(4));

    return data;
  } catch (error) {
    console.error("Error fetching contract data:", error);
    throw error;
  }
};

export const investInPlan = async (
  referrer: string,
  plan: number,
  amountInEther: string,
  signer: ethers.Signer
) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const amount = ethers.parseEther(amountInEther);

    const tx = await contract.invest(referrer, plan, {
      value: amount,
    });

    return tx;
  } catch (error) {
    console.error("Error investing:", error);
    throw error;
  }
};
