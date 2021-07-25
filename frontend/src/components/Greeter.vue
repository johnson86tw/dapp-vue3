<script lang="ts">
import { defineComponent, ref } from "vue";
import { useGetGreeting, useSetGreeting } from "../composables/greeter";
import useGreeterStore, { GreeterData } from "../store/greeter";

export default defineComponent({
  props: {
    greeterData: {
      type: Object as () => GreeterData,
    },
  },
  setup(props) {
    const { getGreeting, greeting } = useGetGreeting();
    const { setGreeting, errMsg, isPending } = useSetGreeting();
    const { updateGreeting } = useGreeterStore();

    const greetingInput = ref("");

    async function setGreetingBtn() {
      await setGreeting(props.greeterData?.greeter!, greetingInput.value);
      greetingInput.value = "";
      await getGreeting(props.greeterData?.greeter!);
      updateGreeting(props.greeterData?.address!, greeting.value);
    }

    const displayAddress = (address: string) => {
      return address ? address.slice(0, 6) + "..." + address.slice(-4) : "";
    };
    return { greetingInput, isPending, errMsg, setGreetingBtn, displayAddress };
  },
});
</script>


<template>
  <div class="grid place-items-center">
    <div class="w-full border shadow p-8 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
      <div class="text-center p-2">
        {{ displayAddress(greeterData.address) }}
        <p>Greeting: {{ greeterData.greeting }}</p>
      </div>

      <div class="flex justify-between gap-3">
        <span class="w-full">
          <label
            :for="greeterData.address"
            class="block text-xs font-semibold text-gray-600 uppercase"
          >Greeting</label>
          <input
            :id="greeterData.address"
            name="Greeting"
            placeholder="Hello World"
            v-model="greetingInput"
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

    <p class="p-4 text-center text-red-600"> {{ errMsg }} </p>
  </div>
</template>