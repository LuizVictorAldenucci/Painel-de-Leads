import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AiOutlineReload } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { selectEstadosArray, selectCidadesArray, selectBairrosArray, selectIsLoadingLocArray, selectIsLocError } from '../locationOptions/locationArraySlice';
import { useEffect, useMemo, useState } from 'react';
import { selectUf, selectCidade, selectBairro, selectAssociados, selectSouabrasel, selectGroupby, selectOrigem, resetPageSize, changeUf, changeCidade, changeBairro, resetBairro, selectDarkMode, changeGroupby } from "../queryParams/queryParamsSlice";
import { useGetCountsQuery } from "./countsSlice"
import { PuffLoader } from 'react-spinners';

const ChartsData = () => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const dispatch = useDispatch()
    const uf = useSelector(selectUf)
    const cidade = useSelector(selectCidade)
    const origem = useSelector(selectOrigem)
    const bairro = useSelector(selectBairro)
    const associados = useSelector(selectAssociados)
    const souabrasel = useSelector(selectSouabrasel)
    const darkMode = useSelector(selectDarkMode)
    const groupby = useSelector(selectGroupby)
    const isLocError = useSelector(selectIsLocError)

    const [locName, setLocName] = useState('estados')

    const estadosArray = useSelector(selectEstadosArray)
    const cidadesArray = useSelector(selectCidadesArray)
    const bairrosArray = useSelector(selectBairrosArray)
    const isLoadingLocArray = useSelector(selectIsLoadingLocArray)
    // const teste = useSelector(selectLocOptionsResult)

    const [skipFetch, setSkipFetch] = useState(true)
    const { data: chartsData, isLoading, isSuccess, isError, error, isFetching, refetch } = useGetCountsQuery({
        uf, cidade, associados, souabrasel, groupby, origem
    }, { skip: skipFetch });

    useEffect(() => {
        if (cidade) {
            setLocName('bairros')
        } else if (uf) {
            setLocName('cidades')
        } else {
            setLocName('estados')
        }
    }, [cidade, uf])

    useEffect(() => {
        if (associados || souabrasel) {
            setSkipFetch(false)
        } else {
            setSkipFetch(true)
        }
    }, [associados, souabrasel])

    // CASO NÃO SELECIONOU ASSOCIADOS OU SOUABRASEL 
    const dataArray = useMemo(() => {
        if (bairrosArray && bairrosArray.length > 0 && groupby === 'bairro') {
            return bairrosArray.slice(0, 10)
        } else if (cidadesArray && cidadesArray.length > 0 && groupby === 'cidade') {
            return cidadesArray.slice(0, 10)
        } else if (estadosArray && estadosArray.length > 0 && groupby === 'uf') {
            return estadosArray.slice(0, 10)
        } else {
            return
        }
    }, [bairrosArray, cidadesArray, estadosArray, groupby])

    const labels = useMemo(() => {
        if (dataArray && dataArray.length > 0) {
            return dataArray.map(data => Object.values(data)[0])
        }
    }, [dataArray])

    const dataNums = useMemo(() => {
        if (dataArray && dataArray.length > 0) {
            return dataArray.map(data => data.TOTAL)
        }
    }, [dataArray])

    const data = {
        labels: labels,
        datasets: [
            {
                label: '',
                data: dataNums,
                backgroundColor: [
                    'rgba(25, 41, 92, 0.9)',    /* --penn-blue */
                    'rgba(26, 53, 97, 0.9)',    /* --royal-blue-traditional */
                    'rgba(29, 61, 102, 0.9)',   /* --resolution-blue */
                    'rgba(32, 70, 106, 0.9)',   /* --egyptian-blue */
                    'rgba(35, 77, 110, 0.9)',   /* --cobalt-blue */
                    'rgba(53, 105, 140, 0.9)',  /* --azul */
                    'rgba(76, 146, 178, 0.9)',  /* --picton-blue */
                    'rgba(84, 134, 152, 0.9)',  /* --aero */
                    'rgba(87, 154, 171, 0.9)',  /* --robin-egg-blue */
                    'rgba(87, 132, 148, 0.9)' /* --robin-egg-blue-2 */
                ],
                borderColor: 'white',
            },
        ],
    };

    // CASO SELECIONOU ASSOCIADOS OU SOUABRASEL   
    const labelsAbrasel = useMemo(() => {
        if (!chartsData || chartsData && chartsData.length == 0) return
        return chartsData.map(data => Object.values(data)[0]).slice(0, 10)
    }, [chartsData])

    const dataNumsAbrasel = useMemo(() => {
        if (!chartsData || (chartsData && chartsData.length == 0)) return
        return chartsData.map(data => data.TOTAL).slice(0, 10)
    }, [chartsData])


    const dataAbrasel = {
        labels: labelsAbrasel,
        datasets: [
            {
                label: '',
                data: dataNumsAbrasel,
                backgroundColor: [
                    'rgba(25, 41, 92, 0.9)',    /* --penn-blue */
                    'rgba(26, 53, 97, 0.9)',    /* --royal-blue-traditional */
                    'rgba(29, 61, 102, 0.9)',   /* --resolution-blue */
                    'rgba(32, 70, 106, 0.9)',   /* --egyptian-blue */
                    'rgba(35, 77, 110, 0.9)',   /* --cobalt-blue */
                    'rgba(53, 105, 140, 0.9)',  /* --azul */
                    'rgba(76, 146, 178, 0.9)',  /* --picton-blue */
                    'rgba(84, 134, 152, 0.9)',  /* --aero */
                    'rgba(87, 154, 171, 0.9)',  /* --robin-egg-blue */
                    'rgba(87, 132, 148, 0.9)' /* --robin-egg-blue-2 */
                ],
                borderColor: 'white',
            },
        ],
    };

    const options = {
        onClick: (e, activeEls) => {
            if (activeEls.length == 0) return
            if (!dataArray) return
            const type = dataArray[0].type
            const dataIndex = activeEls[0].index;
            const label = e.chart.data.labels[dataIndex];
            dispatch(resetPageSize())

            // if (label.length == 2 || (estadosArray && estadosArray.length == 0)) {
            //     dispatch(changeGroupby('cidade'))
            //     dispatch(changeUf())
            // }
            //  if (uf === '') {
            if (type === 'estado' && uf === '') {
                dispatch(changeGroupby('cidade'))
                dispatch(changeUf(label))
            } else if (type === 'estado') {
                dispatch(changeGroupby('cidade'))
                dispatch(changeUf(label))
            } else if (type === 'cidade') {
                dispatch(changeGroupby('bairro'))
                dispatch(changeCidade(label))
                // } else if (cidade !== '') {
            } else if (type === 'bairro') {
                dispatch(resetBairro())
                dispatch(changeBairro(label))
            }
        },
        indexAxis: 'x',
        maintainAspectRatio: false,
        datasets: {
            bar: {
                barThickness: 20, // Adjust the value to make bars longer
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: darkMode ? '#666767' : '#E1E2DE',
                    borderColor: darkMode ? '#666767' : '#E1E2DE',
                    tickColor: darkMode ? '#666767' : '#E1E2DE'
                }
            },
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 41,
                    minRotation: 41
                },
                grid: {
                    color: darkMode ? '#666767' : '#E1E2DE',
                    borderColor: darkMode ? '#666767' : '#E1E2DE',
                    tickColor: darkMode ? '#666767' : '#E1E2DE'
                }
            },
        },
        plugins: {
            legend: {
                display: false, // Show the legend
            },
            colors: {
                forceOverride: true
            }
        }
    };

    let content

    // useEffect(() => {
    //     let counter = 0;
    //     if (isError) {
    //         const fetchData = async () => {
    //             while (counter < 20) {
    //                 await refetch();
    //                 counter++;
    //             }
    //         };
    //         fetchData();
    //     }
    // }, [isError, refetch]);

    if (isError) {
        content = (
            <div className={`rounded flex flex-col justify-center items-center overflow-auto p-2 w-full h-full scrollbar:w-[7px] scrollbar-thumb:h-[7px] scrollbar-thumb:rounded ${darkMode ? 'bg-gray-900 text-white border-green-light border-[1px] scrollbar:bg-gray-900 scrollbar-thumb:bg-azul_3 ' : 'bg-white scrollbar:bg-white scrollbar-thumb:bg-azul_3'}`}>
                <h4 className='text-center sticky mt-8'>Top 10 {locName ? locName : ''} com mais estabelecimentos</h4>
                <div className='h-100 w-100 flex justify-center items-center'>
                    <div className='w-full overflow-auto h-full flex justify-center items-center flex-col'>
                        <p className="text-red-500 text-md text-center">Erro ao carregar os dados.</p>
                        <button
                            onClick={refetch}
                            title="Recarregar"
                            className={`hover:text-azul_3 underline font-medium transition-all duration-300 rounded ${darkMode ? 'text-azul_4' : 'text-azul_0 '}`}
                        >Recarregar</button>
                    </div>
                </div>
            </div>
        )
    }

    if (!isError && (isLoading || isFetching || isLoadingLocArray)) {
        return content = (
            <div className={`rounded flex flex-col justify-center items-center overflow-auto p-2 w-full h-full scrollbar:w-[7px] scrollbar-thumb:h-[7px] scrollbar-thumb:rounded ${darkMode ? 'bg-gray-900 text-white border-green-light border-[1px] scrollbar:bg-gray-900 scrollbar-thumb:bg-azul_3 ' : 'bg-white scrollbar:bg-white scrollbar-thumb:bg-azul_3'}`}>
                <h4 className='text-center sticky mt-8'>Top 10 {locName ? locName : ''} com mais estabelecimentos</h4>
                <div className='h-100 w-100 flex justify-center items-center'>
                    <div className='w-full overflow-auto h-full flex justify-center items-center'>
                        <PuffLoader color={`${darkMode ? `#0EC6CB` : `#011559`}`} loading={isLoading || isFetching || isLoadingLocArray} size={100} />
                    </div>
                </div>
            </div>
        )
    } else if ((!isLoading && !isFetching && !isLoadingLocArray && !isError) && (estadosArray && estadosArray.length > 0) || (cidadesArray && cidadesArray.length > 0) || (bairrosArray && bairrosArray.length > 0)) {
        if (!associados && !souabrasel && data) {
            content = (
                <div className={`rounded flex flex-col justify-center items-center overflow-auto p-2 w-full h-full scrollbar:w-[7px] scrollbar-thumb:h-[7px] scrollbar-thumb:rounded ${darkMode ? 'bg-gray-900 text-white border-green-light border-[1px] scrollbar:bg-gray-900 scrollbar-thumb:bg-azul_3 border-azul_4' : 'bg-white scrollbar:bg-white scrollbar-thumb:bg-azul_3'}`}>
                    <h4 className='text-center sticky mt-8'>Top 10 {locName ? locName : ''} com mais estabelecimentos</h4>
                    <div className='h-100 w-100 flex justify-center items-center'>
                        <div className='w-full overflow-auto h-full flex justify-center items-center'>
                            <Bar

                                options={options}
                                data={data}
                            />
                        </div>
                    </div>
                </div>
            )
        } else if ((!isLoading && !isFetching && !isLoadingLocArray && !isError) && (chartsData && dataAbrasel)) {
            content = (
                <div className={`rounded flex flex-col justify-center items-center overflow-auto p-2 w-full h-full scrollbar:w-[7px] scrollbar-thumb:h-[7px] scrollbar-thumb:rounded ${darkMode ? 'bg-gray-900 text-white border-green-light border-[1px] scrollbar:bg-gray-900 scrollbar-thumb:bg-azul_3 ' : 'bg-white scrollbar:bg-white scrollbar-thumb:bg-azul_3'}`}>
                    <h4 className='text-center sticky mt-8'>Top 10 {locName ? locName : ''} com mais estabelecimentos</h4>
                    <div className='h-100 w-100 flex justify-center items-center'>
                        <div className='w-full overflow-auto h-full flex justify-center items-center'>
                            <Bar

                                options={options}
                                data={dataAbrasel}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            content = (
                <div className={`rounded flex flex-col justify-center items-center overflow-auto p-2 w-full h-full scrollbar:w-[7px] scrollbar-thumb:h-[7px] scrollbar-thumb:rounded ${darkMode ? 'bg-gray-900 text-white border-green-light border-[1px] scrollbar:bg-gray-900 scrollbar-thumb:bg-azul_3 ' : 'bg-white scrollbar:bg-white scrollbar-thumb:bg-azul_3'}`}>
                    <h4 className='text-center sticky mt-8'>Top 10 {locName ? locName : ''} com mais estabelecimentos</h4>
                    <div className='h-100 w-100 flex justify-center items-center'>
                        <div className='w-full overflow-auto h-full flex justify-center items-center flex-col'>
                            <p className="text-red-500 text-md text-center">Erro ao carregar os dados.</p>
                            <button
                                onClick={refetch}
                                title="Recarregar"
                                className={`hover:text-azul_3 underline font-medium transition-all duration-300 rounded ${darkMode ? 'text-azul_4' : 'text-azul_0 '}`}
                            >Recarregar</button>
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        content = (
            <div className={`rounded flex flex-col justify-center items-center overflow-auto p-2 w-full h-full scrollbar:w-[7px] scrollbar-thumb:h-[7px] scrollbar-thumb:rounded ${darkMode ? 'bg-gray-900 text-white border-green-light border-[1px] scrollbar:bg-gray-900 scrollbar-thumb:bg-azul_3 ' : 'bg-white scrollbar:bg-white scrollbar-thumb:bg-azul_3'}`}>
                <div className='h-100 w-100 flex justify-center items-center'>
                    <div className='w-full overflow-auto h-full flex justify-center items-center flex-col'>
                        <p className="text-red-500 p-8 text-md text-center">Erro ao carregar os dados. Por favor, tente novamente mais tarde.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        content
    )
}

export default ChartsData
