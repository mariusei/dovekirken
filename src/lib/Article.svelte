
<main class="flex flex-wrap justify-center flex-auto w-full">
    <div class="w-full">
		<div class="mx-2">
            <slot name="hero">
                <p>No image</p>
            </slot>
        </div>
    </div>
    <div class="w-full lg:w-4/5 lg:my-2">
        <div class="mx-2 px-2">
            <div class="font-light text-black
            bg-dkext-6
            -mt-6
            lg:-ml-4
            mb-6
            rounded-md
            p-4 pb-6
            
            ">
                <p class="text-sm">
                    Du er her: 
                    <a class="underline" href="/">Døvekirken</a> >
                </p>
                <h1 class="text-5xl">
                <slot name="heading">
                    Den norske kirke på tegnspråk
                </slot>
                </h1>
            </div>
            <div class="flex flex-col text-xl text-black 
                mx-4 lg:mx-0
                space-y-8
            "
            >
                <slot name="content">
                </slot>
            </div>
        </div>
    </div>
</main>