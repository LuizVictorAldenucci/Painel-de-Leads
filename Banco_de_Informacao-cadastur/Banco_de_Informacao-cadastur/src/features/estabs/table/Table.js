import { BiSearch } from 'react-icons/bi';
import { FiMapPin } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { selectUf, selectCidade, selectBairro, selectAssociados, selectSouabrasel, selectDarkMode, selectPageSize, changePageSize, selectOrigem, incremenetPageSize } from '../../queryParams/queryParamsSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetCountsQuery } from '../../counts/countsSlice';
import { PuffLoader } from 'react-spinners';
import { selectFilteredResults } from '../../locationOptions/locationArraySlice';

const Table = ({ isLoading, isFetching, isError, error, refetch }) => {
    const dispatch = useDispatch()

    const uf = useSelector(selectUf)
    const cidade = useSelector(selectCidade)
    const bairro = useSelector(selectBairro)
    const origem = useSelector(selectOrigem)
    const associados = useSelector(selectAssociados)
    const souabrasel = useSelector(selectSouabrasel)
    const pageSize = useSelector(selectPageSize)
    const darkMode = useSelector(selectDarkMode)
    const [skipFetch, setSkipFetch] = useState(true)
    const filteredResults = useSelector(selectFilteredResults)
    const { data: numData } = useGetCountsQuery({
        uf, cidade, bairro, associados, souabrasel, origem
    });
    const [hasLoadedAll, setHasLoadedAll] = useState(false)
    const [shownEstabs, setShownEstabs] = useState(0)

    const numEstabs = useMemo(() => {
        if (!numData) return
        return numData[0].TOTAL.toLocaleString('pt-BR')
    }, [numData])

    useEffect(() => {
        if (cidade) {
            setSkipFetch(false)
        } else {
            setSkipFetch(true)
        }
    }, [cidade])
    useEffect(() => {
        if (!pageSize) return
        if (!numData) return
        const checkIfHasLoadedAll = () => {
            if (pageSize >= 5000 && numData[0].TOTAL >= 5000) {
                setHasLoadedAll(true);
                setShownEstabs(5000)
                return
            }
            if (numData[0].TOTAL <= pageSize) {
                setHasLoadedAll(true);
                setShownEstabs(numData[0].TOTAL)
            } else {
                setHasLoadedAll(false);
                setShownEstabs(pageSize)
            }
        }
        checkIfHasLoadedAll();
    }, [numData, pageSize])

    const addUpperLowerCase = useCallback((palavra) => {
        if (typeof palavra !== 'string') return palavra;
        palavra = palavra.split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
        return palavra;
    }, [])

    const returnYesOrNo = useCallback((value) => {
        if (value === 1) {
            return 'Sim'
        } else if (value === 0) {
            return 'Não'
        } else {
            return value
        }
    }, [])

    const searchOnGoogle = useCallback(
        (estab) => {
            window.open(`https://www.google.com/search?q=${estab.NOME_FANTASIA}+${estab.UF}+${estab.CIDADE}+${estab.BAIRRO}`, "_blank");
        }, [],)

    const searchOnGoogleMaps = useCallback(
        (estab) => {
            window.open(`https://www.google.com/maps/search/${estab.NOME_FANTASIA}+${estab.UF}+${estab.CIDADE}+${estab.BAIRRO}`, "_blank");
        }, [],)

    const loadFiftyEstabs = useCallback(() => {
        dispatch(incremenetPageSize(50))
    }, [])

    const loadAllEstabs = useCallback(() => {
        if (numData[0].TOTAL >= 5000) {
            alert("Limite máximo de 5.000 estabelecimentos atingido. Para ver todos os estabelecimentos, por favor faça o download da tabela.")
            setHasLoadedAll(true)
            dispatch(changePageSize(5000))
            return
        }
        dispatch(changePageSize(numData[0].TOTAL))
    }, [numData])

    let content

    if (uf === "" || cidade === "") {
        content = (
            <div className="flex items-stretch align-stretch flex-col justify-start">
                <p className={darkMode ? 'bg-gray-900 text-white p-4' : 'bg-white p-4'}>Escolha um estado e uma cidade para começar.</p>
            </div>
        )
    } else if (isLoading || isFetching) {
        content = (
            <div className={`flex items-center justify-center h-72 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <PuffLoader color={`${darkMode ? `#0EC6CB` : `#011559`}`} loading={isLoading || isFetching} size={100} />
            </div>
        )
    } else if (filteredResults && filteredResults.length === 0) {
        content = (
            <div className="flex items-stretch align-stretch flex-col justify-start">
                <p className={darkMode ? 'bg-gray-900 text-white p-4' : 'bg-white p-4'}>Não há resultados válidos para essa pesquisa.</p>
            </div>
        )
    } else if (isError) {
        if (error === 'canceled') {
            content = (
                <div className={`flex items-center justify-center flex-col h-72 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                    <p className='text-lg'>Carregando...</p>
                    <p>Fazer muitas requisições ao mesmo tempo pode deixar o servidor lento.</p>
                </div>
            )
        } else {
            content = (
                <div className={`flex flex-col items-center justify-center h-72 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <p className="text-red-500 text-md text-center">Erro ao carregar os dados.</p>
                    <button
                        onClick={refetch}
                        title="Recarregar"
                        className={`hover:text-azul_3 underline font-medium transition-all duration-300 rounded ${darkMode ? 'text-azul_4' : 'text-azul_0 '}`}
                    >Recarregar</button>
                </div>
            )
        }
    } else if (filteredResults && filteredResults.length > 0) {
        content = (
            <div className="inline-flex items-stretch align-stretch flex-col justify-start ">
                <div className={`table-container  scrollbar-thumb:rounded scrollbar:w-[7px] scrollbar:h-[7px] ${darkMode ? 'scrollbar:bg-gray-900 scrollbar-thumb:bg-azul_3 ' : 'scrollbar:bg-white scrollbar-thumb:bg-azul_3'}`} >
                    <table >
                        <thead className="sticky top-0">
                            <tr className="sticky top-0 w-[100%]">
                                <th className={`p-2 sticky min-w-[100px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>Pesquisar</th>
                                <th className={`p-2 sticky min-w-[100px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>CNPJ</th>
                                <th className={`p-2 sticky min-w-[150px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>Nome fantasia</th>
                                <th className={`p-2 sticky min-w-[100px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>Município</th>
                                <th className={`p-2 sticky min-w-[100px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>Bairro</th>
                                <th className={`p-2 sticky min-w-[250px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>Endereço</th>
                                {/* <th className={`p-2 sticky min-w-[150px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>Telefone</th> */}
                                <th className={`p-2 sticky min-w-[150px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>Telefone</th>
                                <th className={`p-2 sticky min-w-[100px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>E-mail</th>
                                {/* <th className={`p-2 sticky min-w-[100px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>Aceita Ticket?</th> */}
                                <th className={`p-2 sticky min-w-[100px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>Origem</th>
                                <th className={`p-2 sticky min-w-[100px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>É associados Abrasel?</th>
                                <th className={`p-2 sticky min-w-[100px] text-center top-0 ${darkMode ? 'text-white bg-gray-900 border-y-2 border-azul_4' : 'bg-white text-black'}`}>Tem Sou Abrasel?</th>
                            </tr>
                        </thead>
                        <tbody >
                            <>
                                {filteredResults && filteredResults.length > 0 &&
                                    filteredResults
                                        .filter((estab, index, self) => {
                                            return (
                                                estab.CNPJ !== null
                                                && (estab.NOME_FANTASIA !== null || estab.RAZAO_SOCIAL_RFB !== null)
                                                && self.findIndex((e) => e.CNPJ === estab.CNPJ) === index
                                            )
                                        })
                                        .map((estab, index) => (
                                            <tr
                                                key={estab.CNPJ}
                                                className={darkMode ? `text-white ${index % 2 === 0 ? 'bg-gray-900 ' : 'bg-gray-800'}` : `${index % 2 === 0 ? 'bg-gray-100 ' : 'bg-white'}`}
                                            >
                                                <td className="p-3 text-center ">
                                                    <div className=' flex h-100'>
                                                        {<BiSearch className='cursor-pointer h-full text-lg text-center m-auto' title='Pesquisar no Google' onClick={() => searchOnGoogle(estab)} />}
                                                        {<FiMapPin className='cursor-pointer h-full text-lg text-center m-auto' title='Pesquisar no GoogleMaps' onClick={() => searchOnGoogleMaps(estab)} />}
                                                    </div>
                                                </td>
                                                <td className="p-2 text-center ">{addUpperLowerCase(estab.CNPJ)}</td>
                                                <td className="p-2 text-center">{addUpperLowerCase(estab.NOME_FANTASIA ?? estab.RAZAO_SOCIAL_RFB)}</td>
                                                <td className="p-2 text-center">{addUpperLowerCase(estab.CIDADE)}</td>
                                                <td className="p-2 text-center">{addUpperLowerCase(estab.BAIRRO)}</td>
                                                <td className="p-2 text-center">{addUpperLowerCase(estab.ENDERECO)}</td>
                                                {/* <td className="p-2 text-center">{addUpperLowerCase(estab.TELEFONE_TICKET)}</td> */}
                                                <td className="p-2 text-center">{estab.TELEFONE ? estab.TELEFONE : estab.TELEFONE_RFB}</td>
                                                <td className="p-2 text-center">{addUpperLowerCase(estab.EMAIL)}</td>
                                                <td className="p-2 text-center">{estab.ORIGEM.filter(origem => origem !== '').join(', ')}</td>
                                                <td className="p-2 text-center">{returnYesOrNo(estab.ASSOCIADO)}</td>
                                                <td className="p-2 text-center">{returnYesOrNo(estab.SOU_ABRASEL)}</td>
                                            </tr>
                                        ))}
                            </>
                        </tbody>
                    </table>
                </div>
                {/* {showButtons && ( */}
                <div className='index-10 flex sticky right-0 left-0 bottom-0 transition-all duration-100 '>
                    <button className={`w-full p-2  ${darkMode ? 'hover:bg-azul_3 bg-azul_4 transition-all duration-300 text-black ' : 'text-white transition-all duration-300 bg-azul_0 hover:bg-azul_3'} ${hasLoadedAll ? ' disabled:bg-gray-700 text-gray-100 disabled:cursor-not-allowed' : null}`} disabled={hasLoadedAll} onClick={loadFiftyEstabs}>Carregar mais (mostrando {shownEstabs.toLocaleString('pt-BR')} de {numEstabs})</button >
                    <button className={`w-full p-2   ${darkMode ? 'hover:bg-azul_3 bg-azul_4 transition-all duration-300 text-black' : 'text-white transition-all duration-300 bg-azul_0 hover:bg-azul_3'} ${hasLoadedAll ? ' disabled:bg-gray-700 text-gray-100 disabled:cursor-not-allowed' : null}`} disabled={hasLoadedAll} onClick={loadAllEstabs}>Carregar tudo (máximo 5.000)</button >
                </div>
                {/* )} */}
            </div>
        )
    }

    return content
}

export default Table