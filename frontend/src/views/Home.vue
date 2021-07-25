<script lang="ts">
import { defineComponent, ref } from "vue";
import useMetaMask from "../composables/metamask";
import {
  useGetGreeting,
  useGreeterContract,
  useSetGreeting,
} from "../composables/greeter";

export default defineComponent({
  name: "Home",
  setup() {
    const { etherBalance, connectError } = useMetaMask();
    const { greeter, greeting: greetingStore } = useGreeterContract();
    const { setGreeting, errMsg, isPending } = useSetGreeting();
    const { getGreeting, greeting } = useGetGreeting();

    const greetInput = ref("");

    const setGreetingBtn = async () => {
      await setGreeting(greeter.value!, greetInput.value);
      greetInput.value = "";
      await getGreeting(greeter.value!);
      greetingStore.value = greeting.value;
    };

    return {
      errMsg,
      greeting: greetingStore,
      greetInput,
      etherBalance,
      connectError,
      isPending,
      setGreetingBtn,
    };
  },
});
</script>

<template>
  <div class="text-center text-gray-600">
    <p class="text-red-600">{{ connectError }}</p>
    <p class="text-2xl">Greeter</p>
    <p>ETH: {{ etherBalance }}</p>
    <p>Greeting: {{ greeting }}</p>

  </div>

  <div class="grid place-items-center">
    <div class="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
      <div class="flex justify-between gap-3">
        <span class="w-full">
          <label
            for="Greeting"
            class="block text-xs font-semibold text-gray-600 uppercase"
          >Greeting</label>
          <input
            id="Greeting"
            name="Greeting"
            placeholder="Hello World"
            @keyup.enter="setGreetingBtn()"
            v-model="greetInput"
            type="text"
            class="block w-full p-3 mt-2 text-gray-700 bg-gray-100 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            required
          >
        </span>
      </div>
      <button
        @click="setGreetingBtn()"
        class="btn w-full my-4"
        :disabled="isPending"
      >{{ isPending ? "pending" : "setGreeting" }}</button>
    </div>
  </div>
  <p class="p-10 text-center text-red-600"> {{ errMsg }} </p>

</template>