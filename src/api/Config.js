

const Constants = {
    URL: {
        root: import.meta.env.DEV
            ? import.meta.env.VITE_ROOT_DEV
            : import.meta.env.VITE_ROOT_PROD,

        api_url: import.meta.env.DEV
            ? import.meta.env.VITE_API_URL_DEV
            : import.meta.env.VITE_API_URL_PROD,

        server_url: import.meta.env.DEV
            ? import.meta.env.VITE_SERVER_URL_DEV
            : import.meta.env.VITE_SERVER_URL_PROD,
    },

    API_KEY: import.meta.env.VITE_API_KEY
};

export default Constants;