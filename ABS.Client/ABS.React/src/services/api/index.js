import axios from 'axios';

const mainInstance = axios.create({
    baseURL: 'http://ash-aff-absops:20200',
    // baseURL = `http://${window.location.hostname}:${window._env_.GATEWAY_PORT}`,
    headers: {
        common: {
            Authorization: "Bearer xvvsrvrearhfmndgaerfaegaeagdsfsd"
        },
        // 'Accept': 'application/json',
        // 'Content-Type': 'application/json'
    }
});

const makeRequest = instance => (method, url, ...params) => {
    instance.interceptors.response.use(
        response => {
            return response;
        }, error => {
            if (error && error.response && error.response.status === 401) {

            }
            return Promise.reject(error)
        }
    );
    return instance[method](url, ...params);
};

const makeApiRequest = (method, url, ...params) =>
    makeRequest(mainInstance)(method, url, ...params);

export {
    makeApiRequest
}
