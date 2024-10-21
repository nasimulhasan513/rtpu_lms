<template>
  <AppContainer class="py-12 min-h-[76vh]">
    <Card class="max-w-3xl p-6 mx-auto shadow-md rounded-xl">
      <div
        class="flex flex-col items-center gap-4 mb-6 sm:flex-row sm:items-start"
      >
        <ClientOnly>
          <AuthProfilePic />
        </ClientOnly>
        <div
          class="flex flex-col items-center flex-1 gap-1 text-center sm:items-start sm:text-left"
        >
          <div class="text-2xl font-bold">{{ user.name }}</div>
          <div class="text-muted-foreground">{{ user.phone }}</div>
          <div class="text-sm text-muted-foreground">
            <Icon
              v-if="user.google_id"
              name="logos:google-icon"
              class="inline-block mr-1"
            />
            {{ user.email }}
          </div>
        </div>
      </div>
      <div class="grid gap-4">
        <div class="grid gap-1">
          <div class="text-sm font-medium">Phone</div>
          <div class="text-muted-foreground">{{ user.phone }}</div>
        </div>
        <div class="grid gap-1">
          <div class="text-sm font-medium">HSC Batch</div>
          <div class="text-muted-foreground">{{ user.hsc_batch }}</div>
        </div>
        <div class="grid gap-1">
          <div class="text-sm font-medium">Email</div>
          <div class="text-muted-foreground">{{ user.email }}</div>
        </div>
      </div>

      <div class="grid gap-4">
        <div class="grid gap-1">
          <div class="text-sm font-medium">Institute</div>
          <div class="text-muted-foreground">{{ user.institute }}</div>
        </div>
        <div class="grid gap-1">
          <div class="text-sm font-medium">HSC Batch</div>
          <div class="text-muted-foreground">{{ user.hsc_batch }}</div>
        </div>
      </div>
    </Card>
  </AppContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "protected",
});

const user = useUser();

const refreshUser = async () => {
  const data = await useRequestFetch()("/api/user");
  if (data) {
    user.value = data;
  }
};
</script>

<style scoped>
/* You can add scoped CSS here if necessary */
</style>
