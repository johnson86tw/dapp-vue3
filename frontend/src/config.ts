import { ref } from "vue";

const isDev = import.meta.env.DEV;

// chain IDs supported by this app
const supportedChainIds = isDev ? [4, 5, 31337] : [4, 5]; // rinkeby, goerli

export default function useConfig() {
  return {
    isDev,
    supportedChainIds,
  };
}
