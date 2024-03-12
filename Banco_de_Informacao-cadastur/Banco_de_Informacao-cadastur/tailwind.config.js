module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'media',
    theme: {
        extend: {
            fontSize: {
                xxs: '0.625rem',
                xs: '0.75rem',
                sm: '0.8rem',
                base: '1rem',
                xl: '1.25rem',
                '2xl': '1.563rem',
                '3xl': '1.953rem',
                '4xl': '2.441rem',
                '5xl': '3.052rem',
            },
            colors: {
                azul_0: '#011559',
                azul_1: '#012578',
                azul_2: '#04070d',
                azul_3: '#39A9F1',
                azul_4: '#0EC6CB',
                black: '#000000',
            },
            maxHeight: {
                '75': '75vh',
                '18': '18vh',
                '45': '45vh',
                '65': '65vh',
            },
            minHeight: {
                '75': '75vh',
                '18': '18vh',
                '40': '40vh',
            },
            screens: {
                'xxxs': '320px',// => @media (min-width: 320px) { ... }
                'xxs': '375px', // => @media (min-width: 375px) { ... }
                'xs': '414px', // => @media (min-width: 414px) { ... }
                'sm': '640px',
                'md': '768px',
                'lg': '1024px'
            },
        },
    },
    plugins: [
        // https://github.com/tailwindlabs/tailwindcss.com/blob/ceb07ba4d7694ef48e108e66598a20ae31cced19/tailwind.config.js#L280-L284
        function ({ addVariant }) {
            addVariant(
                'supports-backdrop-blur',
                '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))',
            );
            addVariant('supports-scrollbars', '@supports selector(::-webkit-scrollbar)');
            addVariant('children', '& > *');
            addVariant('scrollbar', '&::-webkit-scrollbar');
            addVariant('scrollbar-track', '&::-webkit-scrollbar-track');
            addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb');
        },
    ],
}