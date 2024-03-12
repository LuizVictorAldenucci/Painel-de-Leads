import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    uf: '',
    cidade: '',
    bairro: [],
    associados: '',
    souabrasel: '',
    origem: [
        { value: 'cadastur', label: 'Cadastur', key: 'cadastur' },
    ],
    page: 1,
    pageSize: 50,
    groupby: 'uf',
    orderby: 'bairro',
    darkMode: false
}

const queryParamsSlice = createSlice({
    name: 'queryParams',
    initialState,
    reducers: {
        changeUf: (state, action) => {
            state.uf = action.payload
        },
        changeCidade: (state, action) => {
            state.cidade = action.payload
        },
        changeBairro: (state, action) => {
            state.bairro = [...state.bairro, action.payload];
        },
        changeBairros: (state, action) => {
            state.bairro = action.payload;
        },
        removeBairro: (state, action) => {
            state.bairro = state.bairro.filter((bairro) => bairro !== action.payload);
        },
        resetBairro: (state) => {
            state.bairro = []
        },
        changeAssociados: (state, action) => {
            state.associados = action.payload
        },
        changeSouabrasel: (state, action) => {
            state.souabrasel = action.payload
        },
        changeGroupby: (state, action) => {
            state.groupby = action.payload
        },
        changeOrigem: (state, action) => {
            state.origem = [...state.origem, action.payload];
        },
        changeOrigens: (state, action) => {
            state.origem = action.payload;
        },
        resetOrigem: (state) => {
            state.origem = [
                { value: 'cadastur', label: 'Cadastur', key: 'cadastur' },
            ]
        },
        changePageSize: (state, action) => {
            state.pageSize = action.payload
        },
        incremenetPageSize: (state, action) => {
            state.pageSize = state.pageSize + action.payload
        },
        resetPageSize: (state) => {
            state.pageSize = 50
        },
        changeDarkMode: (state, action) => {
            state.darkMode = action.payload
        }
    },
})

export const selectAllQueryParams = (state) => state.queryParams;
export const selectUf = (state) => state.queryParams.uf;
export const selectCidade = (state) => state.queryParams.cidade;
export const selectBairro = (state) => state.queryParams.bairro;
export const selectAssociados = (state) => state.queryParams.associados;
export const selectSouabrasel = (state) => state.queryParams.souabrasel;
export const selectOrigem = (state) => state.queryParams.origem;
export const selectPageSize = (state) => state.queryParams.pageSize;
export const selectGroupby = (state) => state.queryParams.groupby;
export const selectDarkMode = (state) => state.queryParams.darkMode;
export const selectCsvHref = (state) => state.queryParams.csvHref;
export const selectXlsxHref = (state) => state.queryParams.xlsxHref;

export const { changeUf, changeCidade, changeBairro, resetBairro, changeAssociados, changeSouabrasel, changeGroupby, changeOrigem, changePageSize, changeDarkMode, resetPageSize, removeBairro, changeBairros, changeOrigens, resetOrigem, incremenetPageSize, changeCsvHref, changeXlsxHref } = queryParamsSlice.actions

export default queryParamsSlice.reducer