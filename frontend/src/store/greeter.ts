import { ref, watch } from "vue";
import { Greeter } from "../../../contracts/typechain/Greeter";
import useConfig from "@/config";
import useMetaMask from "@/composables/metamask";

const { isDev } = useConfig();
const { hasSetupWallet } = useMetaMask();

export interface GreeterData {
  address: string;
  greeter: Greeter;
  greeting: string;
}

const greeters = ref<GreeterData[]>([]);

const addGreeter = (_greeter: GreeterData) => {
  if (isDev) console.log("add greeter", _greeter);
  greeters.value.push(_greeter);
};

const updateGreeting = (address: string, greeting: string) => {
  if (isDev) console.log("update greeting", address, greeting);
  for (let i = 0; i < greeters.value.length; i++) {
    if (greeters.value[i].address === address) {
      greeters.value[i].greeting = greeting;
    }
  }
};

const clearGreeters = () => {
  if (isDev) console.log("clear all greeters");
  greeters.value = [];
};

// if reset wallet, clear greeters state
watch(hasSetupWallet, val => {
  if (val) {
    clearGreeters();
  }
});

export default function useGreeterStore() {
  return {
    greeters,
    addGreeter,
    updateGreeting,
  };
}
