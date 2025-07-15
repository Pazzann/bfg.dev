<script lang="ts">

</script>


<div class="flex projects-page">
    <section class="section-with-bg engineering-bg">
        <div>
            <div class="section-bg"></div>
            <div class="section-content flex flex-col justify-center align-center">
                <h1>Engineering</h1>
                <p>Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.v
                    Here you can find some of my projects, both personal and professional.Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.

                    Here you can find some of my projects, both personal and professional.Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.vv
                    vv
                    Here you can find some of my projects, both personal and professional.Here you can find some of my projects, both personal and professional.
                </p>
            </div>
        </div>

    </section>
    <div class="section-divider" ></div>
    <section class="section-with-bg programming-bg">
        <div>
            <div class="section-bg"></div>
            <div class="section-content flex flex-col justify-center align-center">
                <h1>Programming</h1>
                <p>Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.v
                    Here you can find some of my projects, both personal and professional.Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.

                    Here you can find some of my projects, both personal and professional.Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.
                    Here you can find some of my projects, both personal and professional.vv
                    vv
                    Here you can find some of my projects, both personal and professional.Here you can find some of my projects, both personal and professional.

                </p>
            </div>
        </div>


    </section>
</div>
<style>
    .projects-page> section {
        display: flex;
        flex: 1;
        position: relative;
        overflow: hidden;
        transition: flex 0.3s ease-in-out;
        /*z-index: 1;*/

    }
    .projects-page> section>div>div>h1 {
        font-family: 'Courier Prime', monospace;
        font-size: 6rem;
        text-align: center;

    }
    .projects-page>section>div{
        background: black;
        padding-top: 100px;
        /*z-index: 3;*/
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .section-content{
        width: 40vw;
    }
    .projects-page > section:hover {
        flex: 1.8;
        /*z-index: 3;*/
    }
    .projects-page > section:hover::after, .projects-page > section:hover::before {
        /*background: linear-gradient(45deg,*/
        /*#ffff00, #00ff00, #0099ff, #001aff, #a200ff, #ff0055, #ff0000,*/
        /*#ff0055, #ff0000, #ffff00, #00ff00, #0099ff, #001aff, #a200ff*/
        /*);*/
        background: linear-gradient(45deg,
        #ffffff, #696969);
        background-size: 300%;
        animation: border 12s linear infinite;
        /*z-index: 2;*/

    }
    .projects-page > section:hover::after {
        filter: blur(100px);
    }
    .programming-bg::before,
    .programming-bg::after {

        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 80%;
        height: 80%;
        /*background: linear-gradient(45deg,*/
        /*#ffff00, #00ff00, #0099ff, #001aff, #a200ff, #ff0055, #ff0000,*/
        /*#ff0055, #ff0000, #ffff00, #00ff00, #0099ff, #001aff, #a200ff*/
        /*);*/
        background: linear-gradient(45deg,
        #ffffff, #939393);
        transition: all 640ms;
        filter: blur(0px);
        z-index: 10;
    }

    @keyframes border {
        0%, 100% {
            background-position: 0 0;
        }
        50% {
            background-position: 250%;
        }
    }
    .projects-page{
        height: 100%;
        min-height: 80vh;
    }

    .section-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 60%;
        background-size: cover;
        background-position: top center;
        /*z-index: 4;*/
        opacity: 0.85;
        pointer-events: none;
        object-fit: contain;
        mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0) 100%);
       /*// -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0) 100%);*/
    }
    .engineering-bg .section-bg {
        background-image: url('/src/lib/images/engineering.png');
    }

    .programming-bg .section-bg {
        background-image: url('/src/lib/images/programming.png');
    }
    .section-divider {
        width: 2px;
        background: white;
        min-height: 100%;
        align-self: stretch;
        padding-top: 20px;
    }
    .section-content{
        /*z-index: 5;*/
    }
</style>


