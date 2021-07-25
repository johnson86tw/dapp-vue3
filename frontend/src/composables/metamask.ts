import { ref, computed, markRaw } from "vue";
import { JsonRpcProvider, JsonRpcSigner, Web3Provider, Network } from "@ethersproject/providers";
import { BigNumber, ethers, utils } from "ethers";
import useConfig from "@/config";
const { supportedChainIds } = useConfig();

declare global {
  interface Window {
    ethereum?: MetaMaskProvider; // must use "?" for browser without metamask
  }
}

interface MetaMaskProvider {
  isMetaMask: boolean;
  isConnected: () => boolean;
  request: (request: { method: string; params?: any[] | undefined }) => Promise<any>;
  on: (event: string, callback: (param: any) => void) => void;
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

let initailized = false;

// states
const provider = ref<JsonRpcProvider | Web3Provider>();
const signer = ref<JsonRpcSigner>();
const userAddress = ref("");
const network = ref<Network>();
const balance = ref<BigNumber>();

// watch this so that you can detect signer and chainId changed
const hasSetupWallet = ref(false);

const connectError = ref<string>();

function clearState() {
  provider.value = undefined;
  signer.value = undefined;
  userAddress.value = "";
  network.value = undefined;
  balance.value = undefined;

  hasSetupWallet.value = false;
}

// execute every time while component using
export default function useMetaMask() {
  // @todo this will setup even though user don't want to use metamask
  // init useMetaMask just once while creating this app
  if (!initailized && window.ethereum && window.ethereum.isMetaMask) {
    window.ethereum.on("chainChanged", chainId => {
      console.log("chain changed");
      clearState();
      connectWallet();
    });

    // note: it will emit when metamask locking or unlocking
    window.ethereum.on("accountsChanged", accounts => {
      console.log("accounts changed");
      clearState();
      connectWallet();
    });

    // note: it will emit while changing into unavailable localhost network
    window.ethereum.on("disconnect", error => {
      console.log("disconnect");
      clearState();
      connectError.value = "disconnect";
    });
    initailized = true;
  }

  function isConnected() {
    return window.ethereum && window.ethereum.isConnected();
  }

  // should get the eth balance with specific chainId and account
  async function connectWallet() {
    connectError.value = "";

    if (window.ethereum && window.ethereum.isMetaMask) {
      hasSetupWallet.value = false;
      console.log("connecting wallet...");

      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      const _signer = _provider.getSigner();

      try {
        // @todo add time restriction
        // @todo connect wallet loading
        // @bug when change from rinkeby to hardhat which is not set up, it will
        // stuck on this code, and when you change back to rinkeby, then it have error of fail to connect wallet below...weird...
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (e) {
        clearState();
        connectError.value = "fail to request MetaMask";
        return;
      }

      // get provider and signer first
      provider.value = markRaw(_provider);
      signer.value = markRaw(_signer);

      try {
        // and then get network
        network.value = await _provider.getNetwork();

        // check network is supported
        if (!supportedChainIds.includes(network.value.chainId)) {
          console.log("unsupported network");
          return;
        }

        userAddress.value = await _signer.getAddress();
        balance.value = await _signer.getBalance();
      } catch (e) {
        // clearState is important here, let us check if the wallet is set up in component.
        // otherwise, it's hard to detect error in connectWallet.
        clearState();
        connectError.value = "fail to connect wallet";
        return;
      }

      hasSetupWallet.value = true;
      console.log("has set up wallet with signer and network: ", await signer.value.getAddress(), network.value.name);
    } else {
      connectError.value = "Please install MetaMask!";
    }
  }

  async function getBalance() {
    balance.value = await signer.value?.getBalance();
  }

  // computed
  const etherBalance = computed(() => {
    if (balance.value) {
      return utils.formatEther(balance.value);
    }
    return "0.0";
  });

  // assume valid if we have no network information
  const isSupportedNetwork = computed(() => (network.value ? supportedChainIds.includes(network.value.chainId) : true));

  return {
    hasSetupWallet,
    isSupportedNetwork,
    userAddress,
    provider,
    signer,
    chainId: computed(() => network.value?.chainId),
    balance,
    etherBalance,
    connectError,
    connectWallet,
    getBalance,
    isConnected,
  };
}
