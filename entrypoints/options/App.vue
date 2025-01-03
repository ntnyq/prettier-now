<template>
  <main class="h-screen min-w-720px flex flex-col">
    <Navbar class="h-$h-header" />
    <RouterView class="h-[calc(100vh-var(--h-header))]" />
  </main>
</template>
