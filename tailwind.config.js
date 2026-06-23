/** @type {import('tailwindcss').Config} */
export default {
  	content: [
    	"./index.html",
    	"./src/**/*.{js,ts,jsx,tsx}",
  	],
  	important: '#root',
  	theme: {
    	extend: {
      		fontFamily: {
        		sans: ['Inter', 'sans-serif'],
      		},
    	},
		container: {
			center: true,
			padding: '1rem',

			screens: {
				sm: '640px',
				md: '768px',
				lg: '100%',
				xl: '100%',
				'2xl': '1440px',
			},
		}
  	},
  	plugins: [],
}