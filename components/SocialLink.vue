<template>
  <div class="flex gap-1 items-center">
    <component :is="icon" class="w-6 h-6" :class="iconClass" />
    <a :href="url" :class="linkClass" target="_blank" rel="noopener noreferrer">
      <slot />
    </a>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  href: string;
  linkClass?: string;
  iconClass?: string;
}>();

const url = computed(() =>
  props.href.match(/^https?:\/\//) ? props.href : `https://${props.href}`
);

const github = resolveComponent("Github");
const twitter = resolveComponent("Twitter");
const twitch = resolveComponent("Twitch");
const youtube = resolveComponent("YouTube");
const discord = resolveComponent("Discord");
const facebook = resolveComponent("Facebook");
const bluesky = resolveComponent("Bluesky");
const link = resolveComponent("Website");

const icon = computed(() => {
  const href = props.href;
  if (href.includes("github.com")) return github;
  if (href.includes("twitter.com") || href.includes("x.com")) return twitter;
  if (href.includes("twitch.tv")) return twitch;
  if (href.includes("youtube.com")) return youtube;
  if (href.includes("discord.gg")) return discord;
  if (href.includes("bsky.app")) return bluesky;
  if (href.includes("facebook.com")) return facebook;
  return link;
});
</script>
