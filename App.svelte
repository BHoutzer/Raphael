<script>
  import Exercise from "./components/Exercise.svelte";
  import { window_size } from "./components/Pointer_Store.js";

  const resize = () => {
    $window_size.width = window.innerWidth;
    $window_size.height = window.innerHeight;
  };

  resize();

  window.addEventListener("resize", resize);
</script>

<main>
  <Exercise />
</main>
