<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">


<script lang="ts">
    import '../app.css';

    let {children} = $props();
</script>

<div class="app">

    <header class="flex justify-between flex-row">
        <h1 class="header-title">
            <a href="/">
                <svg width="300" height="50" viewBox="0 0 300 50">
                    <defs>
                        <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#ff0080">
                                <animate attributeName="stop-color" values="#ff0080;#7928ca;#007cf0;#00dfd8;#ff0080" dur="4s" repeatCount="indefinite"/>
                            </stop>
                            <stop offset="100%" stop-color="#00dfd8">
                                <animate attributeName="stop-color" values="#00dfd8;#ff0080;#7928ca;#007cf0;#00dfd8" dur="4s" repeatCount="indefinite"/>
                            </stop>
                        </linearGradient>
                    </defs>
                    <text x="0" y="35" font-family="'Courier Prime', monospace" font-size="36" font-weight="700"
                          fill="none" stroke="url(#rainbow-gradient)" stroke-width="4">
                        bfg.dev
                    </text>
                    <text x="0" y="35" font-family="'Courier Prime', monospace" font-size="36" font-weight="700"
                          fill="white"  >
                        bfg.dev
                    </text>
                </svg>
            </a>
        </h1>

        <div class="flex flex-row gap-5">
            <a href="/cv">Download CV</a>
            <a href="/contact">Contact</a>
            <a href="/projects">Projects</a>
        </div>
    </header>


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
    /*    //max-width: 64rem;*/
        margin: 0 auto;
        box-sizing: border-box;
    }
    header{
        height: 50px;
        border-bottom: 2px solid white;
        font-size: 28px;
        padding: 0 1rem;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
    }

    header>div>a {
        font-weight: lighter;
        padding: 0 12px;
        transition: background 0.3s, color 0.3s;
    }
    header>div>a:hover {

        background: white;
        color: black;
    }

    .header-title {
        font-family: 'Courier Prime', monospace;
        font-weight: 700;
        font-size: 36px;
    }

</style>
