<script>
  import { enhance } from "$app/forms";
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<form use:enhance method="POST">
  <button>Submit</button>
</form>
