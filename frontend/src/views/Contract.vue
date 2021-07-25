<script lang="ts">
import { defineComponent, ref } from "vue";
import useMetaMask from "../composables/metamask";
import { useGetGreeting, useGreeterContract } from "../composables/greeter";
import { Greeter as IGreeter } from "@dapp-vue3/contracts/typechain/Greeter";
import useGreeterStore from "../store/greeter";
import Greeter from "../components/Greeter.vue";

export default defineComponent({
  components: { Greeter },
  name: "Contract",
  setup() {
    const { etherBalance, connectError } = useMetaMask();
    const { connectContractAt } = useGreeterContract();
    const { greeting, getGreeting } = useGetGreeting();
    const { greeters, addGreeter } = useGreeterStore();

    const greeter = ref<IGreeter>();

    const addressInput = ref("");
    const errMsg = ref("");
    const deployPending = ref(false);

    const connectContractBtn = async () => {
      errMsg.value = "";

      try {
        deployPending.value = true;
        const _greeter = connectContractAt(addressInput.value);
        await _greeter?.deployed();
        await getGreeting(_greeter!);
        addGreeter({
          address: _greeter!.address,
          greeter: _greeter!,
          greeting: greeting.value!,
        });
      } catch (e) {
        errMsg.value = e.message;
      } finally {
        deployPending.value = false;
      }
    };

    return {
      etherBalance,
      connectError,
      addressInput,
      greeter,
      greeting,
      greeters,
      errMsg,
      deployPending,
      connectContractBtn,
    };
  },
});
</script>

<template>
  <div class="text-center text-warm-gray-600">
    <p class="text-red-600">{{ connectError }}</p>
    <p class="text-xl">Connect to your own Greeter contract</p>
    <p>ETH: {{ etherBalance }}</p>
  </div>

  <div class="flex justify-center">
    <div class="p-8 pb-4 sm:w-8/12 md:w-1/2 lg:w-5/12">
      <label
        for="ContractAddress"
        class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
      >Contract Address</label>
      <div class="flex justify-between">
        <input
          v-model="addressInput"
          id="ContractAddress"
          type="ContractAddress"
          name="ContractAddress"
          placeholder="0x..."
          autocomplete="ContractAddress"
          class="w-full p-3 mt-2 mr-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        />
        <button
          @click="connectContractBtn()"
          class="btn mt-2"
        >Connect</button>
      </div>
    </div>
  </div>
  <p class="p-4 text-center text-red-600"> {{ errMsg }} </p>

  <!-- Greeter Contracts -->
  <div
    v-for="(greeter, i) in greeters"
    :key="i"
  >
    <greeter :greeterData="greeter" />
  </div>
</template>