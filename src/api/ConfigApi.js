'use strict';

function ConfigApi(opt) {
	if (!(this instanceof ConfigApi)) {
		return new ConfigApi(opt);
	}

	opt = opt || {};

	if (!(opt.url)) {
		throw new Error('url is required');
	}

	this.classVersion = '1.0.0';
	this._setDefaultsOptions(opt);
}

ConfigApi.prototype._setDefaultsOptions = function (opt) {
	this.url = opt.url;
	this.api_url = opt.api_url;
	this.server_url = opt.server_url;
	this.isSsl = /^https/i.test(this.url);
	this.encoding = opt.encoding || 'utf8';
	this.queryStringAuth = opt.queryStringAuth || false;
	this.port = opt.port || '';
	this.timeout = opt.timeout;
	this.api_key = opt.api_key;
};

ConfigApi.prototype._request = function (method, endpoint, formData, callback) {

	var requestUrl = this._getUrl(endpoint);
	var api_key = this.api_key;

	if(method == 'POST'){

		try {

			fetch(
				requestUrl,
				{
					method: 'POST', // or 'PUT'
					body: formData,
					headers: {
						'Accept': 'application/json',
						'X-API-KEY': api_key,
						'Authorization': 'Bearer ' + localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN)
					}
				}
			).then(function (response) {
				return response.json();
	
			}).then((responseData) => {
				if (typeof callback == 'function') {

					if(responseData.hasOwnProperty('code') && responseData.code === 'no_account'){

						// window.location = this.server_url + 'logout/1';
					}

					callback(responseData);
				}

				return responseData;
			}).catch(function(error) {
				console.log('error network -', error);
				// ADD THIS THROW error
				throw error;
			});

		} catch (error) {

			console.log(error);
		}
	}else{

		try {

			if(formData){
				requestUrl += '&' + this.join(formData, '&');
			}
			return fetch(requestUrl,
			{
				headers: {
					'Cache-Control': 'no-cache'
				}
			})
			.then((response) => {
				return response.json()
			})
			.then((responseData) => {
				if (typeof callback == 'function') {

					if(responseData.hasOwnProperty('code') && responseData.code === 'no_account'){

						window.location = this.server_url + 'logout/1';
					}
					
					callback(responseData);
				}
				return responseData
			})
			.catch((error, responseData) => {
					console.log('error network -', error, responseData);
				}
			);
		} catch (error) {

			console.log(error);
		}
	}
};

ConfigApi.prototype.post = function (endpoint, formData, callback) {
	return this._request('POST', endpoint, formData, callback);
};

ConfigApi.prototype.get = function (endpoint, formData, callback) {
	return this._request('GET', endpoint, formData, callback);
};

ConfigApi.prototype.join = function (obj, separator) {
	var arr = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			arr.push(key + '=' + obj[key]);
		}
	}
	;
	return arr.join(separator);
}

ConfigApi.prototype._getUrl = function (endpoint) {
	var url = '/' === this.api_url.slice(-1) ? this.api_url : this.api_url + '/';

	url = url + endpoint;

	// Include port.
	if ('' !== this.port) {
		var hostname = url; //_url.parse(url, true).hostname;
		url = url.replace(hostname, hostname + ':' + this.port);
	}

	// if (!this.isSsl) {
	// 	return this._normalizeQueryString(url);
	// }

	return url;
};

export default ConfigApi;