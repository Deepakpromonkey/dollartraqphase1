import ConfigApi from "./ConfigApi";
import Constants from './Config';

var Api = new ConfigApi({
    url: Constants.URL.root,
    api_url: Constants.URL.api_url,
    server_url: Constants.URL.server_url,
    queryStringAuth: true,
    api_key: Constants.API_KEY
});

export default Api;
