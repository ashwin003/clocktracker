<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold font-dumbledor text-center">
      Maintenance in Progress
    </h1>
    <img src="/img/role/engineer.png" class="w-[300px] h-[300px]" />
    <p class="text-lg">The site is currently down for maintenance.</p>
    <p class="text-lg">Please check back later.</p>
  </div>
</template>

<script setup lang="ts">
const featureFlags = useFeatureFlags();
const router = useRouter();

onMounted(() => {
  if (!featureFlags.isEnabled("maintenance")) {
    router.push("/");
  }
});
</script>
