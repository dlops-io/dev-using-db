import { BASE_API_URL } from "./Common";

const axios = require('axios');

const DataService = {
    Init: function () {
        // Any application initialization logic comes here
    },
    GetTodos: async function () {
        return await axios.get(BASE_API_URL + "/todos");
    },
    GetTodo: async function (id) {
        return await axios.get(BASE_API_URL + "/todos/" + id);
    },
    CreateTodo: async function (obj) {
        return await axios.post(BASE_API_URL + "/todos", obj);
    },
    UpdateTodo: async function (obj) {
        return await axios.put(BASE_API_URL + "/todos", obj);
    },
}

export default DataService;