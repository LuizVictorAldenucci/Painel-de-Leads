import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { utils, write } from 'xlsx';
import { useDispatch } from 'react-redux';
import { selectDarkMode, selectUf, selectCidade, selectBairro, selectAssociados, selectSouabrasel, selectOrigem, changeUf, changeCidade, changeBairro, changeSouabrasel, changeOrigem, changeAssociados, changeGroupby, changeBairros, changeOrigens, changePageSize, selectPageSize } from '../features/queryParams/queryParamsSlice';


const DownloadButton = () => {
    let location = useLocation()
    const dispatch = useDispatch()
    const [search, setSearch] = useSearchParams()
    const uf = useSelector(selectUf)
    const cidade = useSelector(selectCidade)
    const bairro = useSelector(selectBairro)
    const origem = useSelector(selectOrigem)
    const associados = useSelector(selectAssociados)
    const souabrasel = useSelector(selectSouabrasel)
    const pageSize = useSelector(selectPageSize)
    const darkMode = useSelector(selectDarkMode)
    const controller = new AbortController();
    const [loadingDownload, setLoadingDownload] = useState(false);

    const searchParamsObject = {};
    for (const [key, value] of search.entries()) {
        searchParamsObject[key] = value;
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const uf = searchParams.get('uf');
        const cidade = searchParams.get('cidade');
        const associados = searchParams.get('associados');
        const souabrasel = searchParams.get('souabrasel');
        const bairro = searchParams.get('bairro');
        const origem = searchParams.get('origem');
        const pageSize = searchParams.get('pageSize');

        if (uf) {
            const ufInput = uf.toUpperCase()
            dispatch(changeUf(ufInput));
            dispatch(changeGroupby('cidade'))
        }
        if (cidade) {
            const cidadeInput = limpaPalavra(cidade)
            dispatch(changeCidade(cidadeInput));
            dispatch(changeGroupby('bairro'))
        }

        if (bairro && bairro.length > 0) {
            const bairroArray = bairro.split(',')
            dispatch(changeBairros(bairroArray));
        }

        if (origem && origem.length > 0) {
            const origemArray = origem.split(',')

            const origensFormatedArray = origemArray.map(origem => {
                if (!origem) return
                if (origem === 'benvisavale') {
                    return (
                        {
                            value: 'benvisavale',
                            label: 'Ben Visa Vale',
                            key: 'benvisavale'
                        }
                    )
                }
                return (
                    {
                        value: origem,
                        label: limpaPalavra(origem),
                        key: origem
                    }
                )
            })
            dispatch(changeOrigens(origensFormatedArray));
        }

        if (associados) {
            const associadosInput = limpaPalavra(associados)
            dispatch(changeAssociados(associadosInput));
        }
        if (souabrasel) {
            const souabraselInput = limpaPalavra(souabrasel)
            dispatch(changeSouabrasel(souabraselInput));
        }

        if (pageSize) {
            dispatch(changePageSize(pageSize));
        }
    }, [])


    const limpaPalavra = (palavra) => {
        if (!palavra || typeof palavra !== 'string') return '';
        palavra = palavra.trim().toLowerCase();
        palavra = palavra.replace(/-/g, ' '); // Replace all hyphens with spaces
        palavra = palavra
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        return palavra;
    };

    const preparedUrl = useMemo(() => {
        const baseUrl = `https://ec252.abrasel.com.br:8443/api/leads/v1/estabelecimentos`
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParamsObject)) {
            params.set(key, value);
        }
        return `${baseUrl}?${params.toString()}`;
    }, [searchParamsObject])

    const fetchAllData = useCallback(async (url, controller) => {
        try {
            const res = await axios.get(url, {
                signal: controller.signal
            })
            if (!res) return

            const permitedData = res.data
                .filter((estab) => estab.CNPJ !== null)
                .map(estab => {
                    return {
                        'CNPJ': estab.CNPJ,
                        'Nome fantasia': estab.NOME_FANTASIA ?? estab.RAZAO_SOCIAL_RFB,
                        'Municipio': estab.CIDADE,
                        'Bairro': estab.BAIRRO,
                        'Endereco': estab.ENDERECO,
                        'Telefone': estab.TELEFONE ? estab.TELEFONE : estab.TELEFONE_RFB,
                        'E-mail': estab.EMAIL,
                        'Origens': estab.ORIGEM.filter(origem => origem !== '').join(', '),
                        'Associados Abrasel?': returnYesOrNo(estab.ASSOCIADO),
                        'Tem Sou Abrasel?': returnYesOrNo(estab.SOU_ABRASEL),
                        'Pesquisar no Google': `https://www.google.com/search?q=${removeSpaces(estab.NOME_FANTASIA ?? estab.RAZAO_SOCIAL_RFB)}+${removeSpaces(estab.CIDADE)}+${removeSpaces(estab.BAIRRO)}`,
                        'Pesquisar no Google Maps': `https://www.google.com/maps/search/${removeSpaces(estab.NOME_FANTASIA ?? estab.RAZAO_SOCIAL_RFB)}+${removeSpaces(estab.CIDADE)}+${removeSpaces(estab.BAIRRO)}`
                    }
                })
            return permitedData
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingDownload(false)
        }
    }, [])

    const returnYesOrNo = (value) => {
        if (value === 1) {
            return 'SIM'
        } else if (value === 0) {
            return 'NAO'
        } else if (value === null) {
            return '---'
        } else if (value === "CANCELADO") {
            return "CANCELADO"
        } else {
            return value
        }
    }

    const removeSpaces = (palavra) => {
        if (!palavra) return ""
        return palavra.replaceAll(" ", '+')
    }

    const prepareCsvData = useCallback((data) => {
        const headers = ["CNPJ", "Nome fantasia", "Municipio", "Bairro", "Endereco", "Telefone", "E-mail", "Origens", "Associados Abrasel?", "Tem Sou Abrasel?", "Pesquisar no Google", "Pesquisar no Google Maps"];
        if (!data) return
        const treatedData = data.map(row => {
            const treatedValues = Object.values(row).map((cell, index) => {
                if (cell === null) {
                    return cell = '---'
                }
                return cell
            })
            return treatedValues
        })

        const csvContent = [headers.join(";")]
            .concat(treatedData.map(row => row.map(cell => `"${cell}"`).join(";")))
            .join("\n");

        return csvContent
    }, [])


    const handleDownloadCsv = useCallback(async () => {
        if (!cidade) {
            alert('Selecione uma cidade')
            return
        }
        setLoadingDownload(true)

        const permitedData = await fetchAllData(preparedUrl, controller)

        if (permitedData) {
            const csvContent = prepareCsvData(permitedData)
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const blobUrl = URL.createObjectURL(blob);

            link.setAttribute("href", blobUrl);
            link.setAttribute("download", "table.csv");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [cidade, preparedUrl, controller])


    const handleDownloadXlsx = useCallback(async () => {
        if (!cidade) {
            alert('Selecione uma cidade')
            return
        }
        setLoadingDownload(true)
        const permitedData = await fetchAllData(preparedUrl, controller)

        if (permitedData) {
            const sheetName = 'Sheet1';

            const ws = utils.json_to_sheet(permitedData);

            // Create workbook and add worksheet
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, sheetName);

            // Convert workbook to XLSX file
            const wbout = write(wb, { bookType: 'xlsx', type: 'binary' });

            // Download file
            const fileName = 'table.xlsx';
            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            const blobUrl = URL.createObjectURL(blob);

            link.setAttribute('href', blobUrl);
            link.setAttribute('download', fileName);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [cidade, preparedUrl, controller])

    // Helper function to convert binary string to ArrayBuffer
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
    };

    let origensArray = []
    if (origem && origem.length > 0) {
        origensArray = origem.map(origem => origem.value)
    }

    let bairrosArray = []
    if (bairro && bairro.length > 0) {
        bairrosArray = bairro
    }

    return (
        <div className={`p-10 min-h-[100%] flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <button className={`p-[22px] text-lg w-[250px] m-auto mt-2 rounded  transition-all duration-300 ${darkMode ? 'hover:bg-azul_3 bg-azul_4 text-black' : ' bg-azul_0 hover:bg-azul_3 text-white'} `} onClick={handleDownloadXlsx}> Fazer download em XLSX</button>
            <button className={`p-[22px] text-lg w-[250px] m-auto mt-4 rounded  transition-all duration-300 ${darkMode ? 'hover:bg-azul_3 bg-azul_4 text-black' : ' bg-azul_0 hover:bg-azul_3 text-white'} `} onClick={handleDownloadCsv}> Fazer download em CSV</button>
            <div className={`p-10 text-lg min-h-[40vh] ${darkMode ? ' text-white' : '  text-black'}`}>
                {(uf || cidade || bairro || origem || associados || souabrasel) &&
                    <h1 className='p-4 text-center'>Filtros ativos</h1>
                }
                {uf && <p>Estado: {uf}</p>}
                {cidade && <p>Cidade: {cidade}</p>}
                {bairrosArray.length > 0 && (
                    <p>
                        Bairros: {bairrosArray.map(bairro => limpaPalavra(bairro)).join(', ')}
                    </p>
                )}
                {origensArray.length > 0 && (
                    <p>
                        Origens: {origensArray.map(origem => limpaPalavra(origem)).join(', ')}
                    </p>
                )}
                {associados && <p>Associado: {associados}</p>}
                {souabrasel && <p>Souabrasel: {souabrasel}</p>}
                {pageSize && <p>Número de estabelecimentos: {pageSize.toLocaleString('pt-BR')}</p>}
                {(!uf && !cidade && !bairro && !origem && !associados && !souabrasel) &&
                    <h4>Nenhum filtro selecionado</h4>
                }
            </div>
        </div>
    )
}

export default DownloadButton