<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { ContractFactory } from "ethers";
import useMetaMask from "../composables/metamask";
import { useGreeterContract } from "../composables/greeter";
import { Greeter } from "@dapp-vue3/contracts/typechain/Greeter";
import { GreeterFactory } from "@dapp-vue3/contracts/typechain/GreeterFactory";

export default defineComponent({
  setup() {
    const { signer } = useMetaMask();
    const { contractData } = useGreeterContract();

    const param1 = ref("");
    const contractAddress = ref("");
    const errMsg = ref("");
    const txPending = ref(false);

    const deploy = async () => {
      errMsg.value = "";

      try {
        txPending.value = true;
        const greeterFactory = new ContractFactory(
          contractData.abi,
          contractData.bytecode,
          signer.value
        ) as GreeterFactory;
        const greeter = (await greeterFactory.deploy(param1.value)) as Greeter;
        await greeter.deployed();

        contractAddress.value = greeter.address;
        param1.value = "";
      } catch (e) {
        errMsg.value = e.message;
      } finally {
        txPending.value = false;
      }
    };
    return {
      param1,
      contractAddress,
      errMsg,
      txPending,
      deploy,
    };
  },
});
</script>


<template>
  <div class="text-center text-gray-600">
    <p class="text-xl">Deploy your own Greeter contract</p>
    <p v-if="contractAddress">Success!</p>
    <p>{{ contractAddress }}</p>
  </div>

  <div class="grid place-items-center">
    <form
      action="#"
      class="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12"
    >
      <div class="flex justify-between gap-3">
        <span class="w-full">
          <label
            for="Greeting"
            class="block text-xs font-semibold text-gray-600 uppercase"
          >Greeting</label>
          <input
            v-model="param1"
            id="Greeting"
            type="text"
            name="Greeting"
            placeholder="Hello World"
            class="block w-full p-3 mt-2 text-gray-700 bg-gray-100 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          />
        </span>
        <!-- <span class="w-1/2">
          <label
            for="param_2"
            class="block text-xs font-semibold text-gray-600 uppercase"
          >param_2</label>
          <input
            id="param_2"
            type="text"
            name="param_2"
            placeholder="Doe"
            class="block w-full p-3 mt-2 text-gray-700 bg-gray-100 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            required
          />
        </span> -->
      </div>
      <!-- <label
          for="email"
          class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
        >E-mail</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="john.doe@company.com"
          autocomplete="email"
          class="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        />
        <label
          for="password"
          class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
        >Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="********"
          autocomplete="new-password"
          class="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        />
        <label
          for="password-confirm"
          class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
        >Confirm password</label>
        <input
          id="password-confirm"
          type="password"
          name="password-confirm"
          placeholder="********"
          autocomplete="new-password"
          class="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        /> -->
      <button
        @click="deploy"
        class="btn w-full my-4"
        :disabled="txPending"
      >
        {{txPending? "pending": "Deploy"}}
      </button>
    </form>

    <div class="text-red-600">
      {{ errMsg }}
    </div>
  </div>
</template>