import { markRaw, watch, ref, computed } from "vue";
import { ethers } from "ethers";
import { JsonRpcSigner } from "../utils/ethers";
import contractData from "@dapp-vue3/contracts/artifacts/contracts/Greeter.sol/Greeter.json";
import { Greeter } from "@dapp-vue3/contracts/typechain/Greeter";
import useMetaMask from "./metamask";
import NETWORK from "../constants";
import { isAddress } from "ethers/lib/utils";
import useConfig from "@/config";

const { supportedChainIds } = useConfig();
const { getBalance, hasSetupWallet, signer, chainId } = useMetaMask();

const greeterAddress: Readonly<Record<string, string>> = {
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  rinkeby: "0xBdeC61D40CEA359f92BaC3AEE54F3148e05Ec88B",
  goerli: "0xa1c2109014EB3093cdcE1896e1c2A2cB082Ea97a",
};

const greeter = ref<Greeter>();
const greeting = ref("");

function clearState() {
  greeter.value = undefined;
  greeting.value = "";
}

// if reset wallet, recreate the Greeter contract
watch(hasSetupWallet, async hasSetupWallet => {
  clearState();

  if (hasSetupWallet && signer.value && chainId.value) {
    if (supportedChainIds.includes(chainId.value)) {
      console.log("createContract when setting up new wallet");
      createContract(signer.value, chainId.value);
      const { getGreeting, greeting: g } = useGetGreeting();
      await getGreeting(greeter.value!);
      greeting.value = g.value;
    }
  }
});

// reactive with useMetaMask
function createContract(signer: JsonRpcSigner, chainId: number) {
  if (supportedChainIds.includes(chainId)) {
    const contractAddress = greeterAddress[NETWORK(chainId)!.name];
    const _contract = new ethers.Contract(contractAddress, contractData.abi, signer) as Greeter;
    greeter.value = markRaw(_contract);
  } else {
    throw new Error("createContract: unsupported chainId");
  }
}

function connectContractAt(address: string) {
  let contract;
  if (!isAddress(address)) throw new Error("address is invalid");
  if (hasSetupWallet.value && signer.value && chainId.value) {
    // @issue: throw Error can't be handled when address is not valid.
    contract = new ethers.Contract(address, contractData.abi, signer.value) as Greeter;
  }
  return contract;
}

export function useGreeterContract() {
  return {
    greeter,
    greeting,
    contractData,
    greeterAddress: computed(() => greeter.value?.address),
    createContract,
    connectContractAt,
  };
}

// ============================ Contract Methods ============================

// note: what if combine useGetGreeting and useSetGreeting as useGreeting?

export function useGetGreeting() {
  const greeting = ref("");
  const isLoading = ref(false);
  const errMsg = ref("");

  const getGreeting = async (greeter: Greeter) => {
    errMsg.value = "";

    if (!greeter) {
      errMsg.value = "getGreeting: contract doesn't set up";
      return;
    }

    try {
      isLoading.value = true;
      greeting.value = await greeter.greet();
    } catch (e) {
      errMsg.value = e;
    } finally {
      isLoading.value = false;
    }
  };

  return { greeting, isLoading, errMsg, getGreeting };
}

export function useSetGreeting() {
  const isLoading = ref(false);
  const isPending = ref(false);
  const errMsg = ref("");

  const setGreeting = async (greeter: Greeter, greeting: string) => {
    errMsg.value = "";

    if (!greeter) {
      errMsg.value = "setGreeting: contract doesn't set up";
      return;
    }

    try {
      isLoading.value = true;
      const tx = await greeter.setGreeting(greeting);

      isPending.value = true;
      await tx.wait();
      isPending.value = false;
    } catch (e) {
      errMsg.value = e;
    } finally {
      isLoading.value = false;
    }
    getBalance();
  };

  return { isLoading, isPending, errMsg, setGreeting };
}
