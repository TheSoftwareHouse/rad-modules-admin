import axios from "axios";
import { FORBIDDEN, UNAUTHORIZED } from "http-status-codes";

class HttpClient {
  constructor() {
    this.appUrl = new URL(process.env.PUBLIC_URL, window.location.href);

    this.httpClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URL,
    });

    this.httpClient.interceptors.request.use(
      async config => {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return Promise.resolve(config);
      },
      error => Promise.reject(error),
    );

    this.httpClient.interceptors.response.use(
      async response => Promise.resolve(response.data),
      async error => {
        const originalRequest = error.config;
        if (!error.response || originalRequest._retry) {
          return Promise.reject(error);
        }
        const status = error.response.status;
        if (status !== UNAUTHORIZED) return Promise.reject(error);

        originalRequest._retry = true;

        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) return;

        return axios
          .post(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/refresh-token`, {
            accessToken,
            refreshToken,
          })
          .then(result => {
            const { accessToken, refreshToken } = result.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          });
      },
    );
  }

  handleError(error) {
    if (error.response) {
      if (error.response.data.error?.joi) {
        const joiAllErrorMessages = error.response.data.error.joi.details.map(joiError => joiError.message).join("\n");
        throw new Error(joiAllErrorMessages);
      }
      throw new Error(error.response.data.error);
    }
    throw error;
  }

  login(username, password) {
    return axios
      .post(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/login`, {
        username,
        password,
      })
      .then(result => {
        const { accessToken, refreshToken } = result.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        return {
          username,
          accessToken,
          refreshToken,
        };
      });
  }

  loginOauth(provider, code, redirectUrl) {
    switch (provider) {
      case "google":
        return this.loginGoogle(code, `${this.appUrl.origin}/login-callback/google`);
      case "facebook":
        return this.loginFacebook(code, `${this.appUrl.origin}/login-callback/facebook`);
      case "microsoft":
        return this.loginMicrosoft(code, `${this.appUrl.origin}/login-callback/microsoft`);
      default:
        throw new Error("Unknown provider");
    }
  }

  loginGoogle(code, redirectUrl) {
    return axios
      .get(
        `${process.env.REACT_APP_SECURITY_API_URL}/api/users/oauth-redirect/google?code=${code}&redirectUrl=${redirectUrl}`,
      )
      .then(res => res.data);
  }

  loginFacebook(code, redirectUrl) {
    return axios
      .get(
        `${process.env.REACT_APP_SECURITY_API_URL}/api/users/oauth-redirect/facebook?code=${code}&redirectUrl=${redirectUrl}`,
      )
      .then(res => res.data);
  }

  loginMicrosoft(code, redirectUrl) {
    return axios
      .get(
        `${process.env.REACT_APP_SECURITY_API_URL}/api/users/oauth-redirect/microsoft?code=${code}&redirectUrl=${redirectUrl}`,
      )
      .then(res => res.data);
  }

  isAuthenticated() {
    const token = localStorage.getItem("accessToken");
    if (!token) return Promise.resolve(false);
    return axios
      .get(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/is-authenticated`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(result => result.data.isAuthenticated);
  }

  async hasAccess() {
    let hasAccess = false;
    const token = localStorage.getItem("accessToken");
    if (!token) return hasAccess;

    try {
      const authResponse = await axios.post(
        `${process.env.REACT_APP_SECURITY_API_URL}/api/users/has-access`,
        { resources: ["admin-panel/access"] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      hasAccess = authResponse.data.hasAccess;
    } catch (err) {
      const { response } = err;

      if ((response.status === FORBIDDEN || response.status === UNAUTHORIZED) && response.data.hasAccess) {
        hasAccess = false;
      }

      throw response.data;
    } finally {
      return hasAccess;
    }
  }

  isAuthenticatedWithRetry() {
    return this.isAuthenticated().then(result => {
      if (result) return result;
      return this.refreshToken().then(this.isAuthenticated);
    });
  }

  refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return Promise.resolve();
    return axios
      .post(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/refresh-token`, {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      })
      .then(result => {
        const { accessToken, refreshToken } = result.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      });
  }

  getUsers(page, limit, filter = "", order = "") {
    return this.httpClient
      .get(
        `${process.env.REACT_APP_SECURITY_API_URL}/api/users?page=${page}&limit=${limit}${
          filter === "" ? filter : "&" + filter
        }${order === "" ? order : "&" + order}`,
      )
      .catch(this.handleError);
  }

  getAttributes(page, limit, filter = "", order = "") {
    return this.httpClient
      .get(
        `${process.env.REACT_APP_SECURITY_API_URL}/api/attributes?page=${encodeURIComponent(
          page,
        )}&limit=${encodeURIComponent(limit)}${filter === "" ? filter : "&" + filter}${
          order === "" ? order : "&" + order
        }`,
      )
      .catch(this.handleError);
  }

  getUsersByPolicy(page, limit, resourceName) {
    return this.httpClient
      .get(
        `${process.env.REACT_APP_SECURITY_API_URL}/api/users/get-users-by-resource?resource=${encodeURIComponent(
          resourceName,
        )}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
      )
      .catch(this.handleError);
  }

  getUser(userId) {
    return this.httpClient
      .get(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/get-user/${userId}`)
      .catch(this.handleError);
  }

  addUser(username, password, attributes) {
    return this.httpClient
      .post(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/add-user`, {
        username,
        password,
        attributes,
      })
      .catch(this.handleError);
  }

  deleteUser(userId) {
    return this.httpClient
      .delete(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/delete-user?userId=${encodeURIComponent(userId)}`)
      .catch(this.handleError);
  }

  setNewUserPassword(username, newPassword) {
    return this.httpClient
      .post(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/set-password`, {
        username,
        newPassword,
      })
      .catch(this.handleError);
  }

  addUserAttribute(userId, newAttribute) {
    return this.httpClient
      .post(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/add-attribute`, {
        userId,
        attributes: [newAttribute],
      })
      .catch(this.handleError);
  }

  deleteUserAttribute(userId, attribute) {
    return this.httpClient
      .delete(
        `${process.env.REACT_APP_SECURITY_API_URL}/api/users/remove-attribute?userId=${userId}&attributes=${attribute}`,
      )
      .catch(this.handleError);
  }

  deactivateUser(userId) {
    return this.httpClient
      .post(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/deactivate-user`, {
        userId,
      })
      .catch(this.handleError);
  }

  activateUser(activationToken) {
    return this.httpClient
      .post(`${process.env.REACT_APP_SECURITY_API_URL}/api/users/activate-user/${activationToken}`)
      .catch(this.handleError);
  }

  getPolicies(page = 0, limit = 25, filter = "", order = "") {
    return this.httpClient
      .get(
        `${process.env.REACT_APP_SECURITY_API_URL}/api/policy/get-policies?page=${page}&limit=${limit}${
          filter === "" ? filter : "&" + filter
        }${order === "" ? order : "&" + order}`,
      )
      .catch(this.handleError);
  }

  addPolicy(attribute, resource) {
    return this.httpClient
      .post(`${process.env.REACT_APP_SECURITY_API_URL}/api/policy/add-policy`, {
        attribute,
        resource,
      })
      .catch(this.handleError);
  }

  deletePolicy(id) {
    return this.httpClient
      .delete(`${process.env.REACT_APP_SECURITY_API_URL}/api/policy/remove-policy?id=${id}`)
      .catch(this.handleError);
  }

  getAccessKeys(page = 0, limit = 25) {
    return this.httpClient
      .get(`${process.env.REACT_APP_SECURITY_API_URL}/api/tokens/get-access-keys?page=${page}&limit=${limit}`)
      .catch(this.handleError);
  }

  deleteAccessKey(apiKey) {
    return this.httpClient
      .delete(`${process.env.REACT_APP_SECURITY_API_URL}/api/tokens/remove-access-key/${apiKey}`)
      .catch(this.handleError);
  }

  addAccessKey() {
    return this.httpClient
      .post(`${process.env.REACT_APP_SECURITY_API_URL}/api/tokens/create-access-key`)
      .catch(this.handleError);
  }
  getSchedulerJobs(page = 0, limit = 25, filter, order = "") {
    return this.httpClient
      .get(
        `${process.env.REACT_APP_SCHEDULER_API_URL}/api/scheduling/get-jobs?page=${page}&limit=${limit}${
          filter === "" ? filter : "&" + filter
        }${order === "" ? order : "&" + order}`,
      )
      .catch(this.handleError);
  }

  getSchedulerServices() {
    return this.httpClient
      .get(`${process.env.REACT_APP_SCHEDULER_API_URL}/api/scheduling/get-services`)
      .catch(this.handleError);
  }

  scheduleJob(name, service, action, jobOptions, payload) {
    return this.httpClient
      .post(`${process.env.REACT_APP_SCHEDULER_API_URL}/api/scheduling/schedule-job`, {
        name,
        service,
        action,
        jobOptions,
        payload,
      })
      .catch(this.handleError);
  }

  jobCancel(jobId) {
    return this.httpClient
      .delete(`${process.env.REACT_APP_SCHEDULER_API_URL}/api/scheduling/cancel-job?jobId=${jobId}`)
      .catch(this.handleError);
  }

  getNotifications(page = 0, limit = 25, filter, order = "") {
    return this.httpClient
      .get(
        `${
          process.env.REACT_APP_NOTIFICATIONS_API_URL
        }/api/notifications/get-notifications?page=${page}&limit=${limit}${filter === "" ? filter : "&" + filter}${
          order === "" ? order : "&" + order
        }`,
      )
      .catch(this.handleError);
  }
}

export default new HttpClient();
