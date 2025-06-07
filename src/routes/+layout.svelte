<script>
  let { children } = $props();
  import "../app.css";
</script>

<div class="flex flex-col font-pixel h-screen">
  <h1 class="bg-orange-500 text-white px-2">Socket.IO + Sveltekit Test</h1>

  {@render children()}
</div>
