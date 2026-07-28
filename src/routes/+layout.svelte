<script lang="ts">
    import '../app.css';

    let {children} = $props();
</script>

<div class="app">
    <main>
        {@render children()}
    </main>

    <footer>
        <p>
            :3
        </p>
    </footer>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
    }
</style>
