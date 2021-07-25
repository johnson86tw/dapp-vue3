<script lang="ts">
import { computed, defineComponent } from "vue";
import useMetaMask from "../composables/metamask";
import NETWORK from "../constants";

const navigation = [
  { name: "Deploy", href: "/deploy" },
  { name: "Contract", href: "/contract" },
];

export default defineComponent({
  name: "LayoutHeader",
  setup() {
    const {
      userAddress,
      connectWallet,
      chainId,
      isConnected,
      isSupportedNetwork,
      hasSetupWallet,
    } = useMetaMask();

    const displayUserAddress = computed(() => {
      return (
        userAddress.value.slice(0, 6) + "..." + userAddress.value.slice(-4)
      );
    });

    return {
      displayUserAddress,
      isSupportedNetwork,
      chainName: computed(() => NETWORK(chainId.value)?.name), // note: must use computed
      connectWallet,
      isConnected,
      hasSetupWallet,
      navigation,
    };
  },
});
</script>

<template>
  <header class="bg-white">
    <nav
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Top"
    >
      <div class="py-4 flex items-center justify-between border-b border-gray-300">
        <div class="flex space-x-4 items-center">
          <div class="">
            <router-link to="/">
              <img
                class="h-10 min-w-10"
                src="../assets/logo.png"
                alt="logo"
              />
            </router-link>
          </div>
          <router-link
            v-for="link in navigation"
            :key="link.name"
            :to="link.href"
            active-class="font-bold"
            exact
            class="font-medium text-gray-500 hover:text-gray-900"
          >
            {{ link.name }}
          </router-link>

        </div>

        <div class="flex space-x-4">
          <div
            v-if="!isSupportedNetwork"
            class="flex items-center"
          >
            <div class="text-gray-500"> <span class="uppercase">{{ chainName }}</span> is unsupported network</div>
          </div>
          <div
            v-else-if="isConnected() && hasSetupWallet"
            class="flex items-center"
          >
            <div class="uppercase mr-4 py-3 px-4 rounded inline-block bg-light-blue-100 text-gray-600">{{ chainName }}</div>
            <div class="py-3 px-4 rounded inline-block bg-gray-100 text-gray-600">{{ displayUserAddress }}</div>
          </div>
          <button
            v-else
            @click="connectWallet"
            class="ml-2 p-2 sm:text-xl sm:px-6 sm:py-3 rounded inline-block bg-blue-100 text-gray-600 cursor-pointer hover:bg-blue-200 focus:outline-none"
          >Connect Wallet</button>
        </div>
      </div>
      <div class="py-4 flex flex-wrap justify-center space-x-6">
      </div>
    </nav>

    <!-- <nav class="bg-white shadow-lg">
      <div class="md:flex items-center justify-between py-2 px-8 md:px-12">
        <div class="flex justify-between items-center">
          <div class="text-2xl font-bold text-gray-800 md:text-3xl">
            <a href="#">Brand</a>
          </div>
          <div class="md:hidden">
            <button
              type="button"
              class="block text-gray-800 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
            >
              <svg
                class="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path
                  class="hidden"
                  d="M16.24 14.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 0 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12l2.83 2.83z"
                />
                <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex flex-col md:flex-row hidden md:block -mx-2">
          <a
            href="#"
            class="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2"
          >Home</a>
          <a
            href="#"
            class="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2"
          >About</a>
          <a
            href="#"
            class="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2"
          >Contact</a>
        </div>
      </div>
    </nav> -->
  </header>
</template>

