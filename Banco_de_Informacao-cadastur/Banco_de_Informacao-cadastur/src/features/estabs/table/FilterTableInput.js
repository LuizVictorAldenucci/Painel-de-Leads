import React, { useMemo } from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDarkMode } from '../../queryParams/queryParamsSlice';
import useDebounce from '../../../hooks/useDebounce';
import { changeFilteredResults, resetFilteredResults } from '../../locationOptions/locationArraySlice';
import { selectFilteredResults } from '../../locationOptions/locationArraySlice';

const FilterTableInput = ({ estabsData }) => {
    const dispatch = useDispatch()
    const darkMode = useSelector(selectDarkMode);
    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, 500)
    const filteredResults2 = useSelector(selectFilteredResults)

    const filteredResults = useMemo(() => {
        if (estabsData && estabsData.length > 0) {
            try {
                return estabsData.filter((estab) => {
                    const updatedEstab = {
                        ...estab,
                        BAIRRO: estab.BAIRRO ? estab.BAIRRO : '',
                        CIDADE: estab.CIDADE ? estab.CIDADE : '',
                        ENDERECO: estab.ENDERECO ? estab.ENDERECO : '',
                        CEP: estab.CEP ? estab.CEP.toString() : '',
                        NOME_FANTASIA: estab.NOME_FANTASIA ? estab.NOME_FANTASIA : '',
                        TELEFONE: estab.TELEFONE ? estab.TELEFONE.toString() : (estab.TELEFONE_RFB ? estab.TELEFONE_RFB.toString() : ''),
                        EMAIL: estab.EMAIL ? estab.EMAIL : '',
                        ORIGEM: estab.ORIGEM ? estab.ORIGEM : '',
                    };
                    return (
                        updatedEstab.BAIRRO.toLowerCase().includes(search.toLowerCase()) ||
                        updatedEstab.CIDADE.toLowerCase().includes(search.toLowerCase()) ||
                        updatedEstab.ENDERECO.toLowerCase().includes(search.toLowerCase()) ||
                        updatedEstab.CEP.toLowerCase().includes(search.toLowerCase()) ||
                        updatedEstab.NOME_FANTASIA.toLowerCase().includes(search.toLowerCase()) ||
                        updatedEstab.TELEFONE.includes(search.toLowerCase()) ||
                        updatedEstab.EMAIL.includes(search.toLowerCase()) ||
                        updatedEstab.ORIGEM.includes(search.toLowerCase())
                    );
                });
            } catch (err) {
                console.log(err)
            }
        } else {
            return []
        }
    }, [debounceSearch, estabsData])

    useEffect(() => {
        if (estabsData && estabsData.length > 0) {
            dispatch(resetFilteredResults())
            dispatch(changeFilteredResults(filteredResults))
        } else {
            dispatch(changeFilteredResults([]))
        }
    }, [estabsData, debounceSearch]);

    return (
        <nav >
            <form className="searchForm " onSubmit={(e) => e.preventDefault()}>
                <label className='sr-only' htmlFor="keyword-input">Pesquisar na tabela</label>
                <input
                    type="text"
                    id="keyword-input"
                    placeholder="Pesquisar na tabela"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full py-2 pl-6 sticky ${darkMode ? 'bg-gray-900 text-white border-azul_4' : 'bg-white border-y-2 border-azul_0'}`}
                />
            </form>
        </nav>)
}

export default FilterTableInput