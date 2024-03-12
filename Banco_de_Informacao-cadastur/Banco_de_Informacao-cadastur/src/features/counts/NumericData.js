import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useGetCountsQuery } from "./countsSlice"
import { selectUf, selectCidade, selectBairro, selectAssociados, selectSouabrasel, selectDarkMode, selectOrigem } from "../queryParams/queryParamsSlice";
import { AiOutlineReload } from "react-icons/ai";


const NumericData = () => {
    const uf = useSelector(selectUf)
    const cidade = useSelector(selectCidade)
    const bairro = useSelector(selectBairro)
    const associados = useSelector(selectAssociados)
    const souabrasel = useSelector(selectSouabrasel)
    const darkMode = useSelector(selectDarkMode)
    const origem = useSelector(selectOrigem)
    const [locName, setLocName] = useState('')
    const { data: numData, isLoading, isSuccess, isError, error, isFetching, refetch } = useGetCountsQuery({
        uf, cidade, bairro, associados, souabrasel, origem
    });
    const [filtrosAtivos, setFiltrosAtivos] = useState('')


    useEffect(() => {
        if (bairro && bairro.length > 0) {
            setLocName('neste(s) bairro(s):')
        } else if (cidade) {
            setLocName('nesta cidade:')
        } else if (uf) {
            setLocName('neste estado:')
        } else {
            setLocName('')
        }
    }, [bairro, cidade, uf])


    useEffect(() => {
        if (uf || cidade || bairro || associados || souabrasel || origem) {
            setFiltrosAtivos(`${origem && origem.length > 0 ? `Origem: ${origem.map(origem => origem.label).join(', ')}` : ''}${uf ? ` | Estado: ${uf}` : ''}${cidade ? ` | Cidade: ${cidade}` : ''}${bairro && bairro.length > 0 ? ` | Bairro(s): ${bairro.join(', ')}` : ''}${associados ? ` | Associados: ${associados}` : ''}${souabrasel ? ` | SouAbrasel: ${souabrasel}` : ''}`)
        }
    }, [uf, cidade, bairro, associados, souabrasel, origem])

    let content

    if (isError) {
        content = (
            < >
                <div className={` rounded h-[calc(50%-10px)] flex flex-col justify-center items-center  ${darkMode ? 'bg-gray-900 text-white border-azul_4 border-[1px]' : 'bg-white'}`} >
                    <p className="text-red-500 text-md text-center">Erro ao carregar os dados.</p>
                    <button
                        onClick={refetch}
                        title="Recarregar"
                        className={`hover:text-azul_3 underline font-medium transition-all duration-300 rounded ${darkMode ? 'text-azul_4' : 'text-azul_0 '}`}
                    >Recarregar</button>
                </div>
                <div className={`h-[calc(50%-10px)] rounded flex flex-col justify-center items-center ${darkMode ? 'bg-gray-900 text-white border-azul_4 border-[1px]' : 'bg-white'}`} >
                    <h4 className={`mt-[20px] text-[20px]  ${darkMode ? 'text-white text-center' : 'text-black text-center'}`}>Filtros ativos:</h4>
                    {/* <p className='text-red-500'> --- </p> */}
                    {/* <p className={darkMode ? 'text-azul_4 text-center p-2' : 'text-azul_0 text-center  p-2'}> */}
                    <p className='text-red-500 text-center p-2'>
                        {filtrosAtivos}
                    </p>
                </div>
            </>
        )
    }

    if (isLoading || isFetching) {
        content = (
            < >
                <div className={` rounded h-[calc(50%-10px)] flex flex-col justify-center items-center  ${darkMode ? 'bg-gray-900 text-white border-azul_4 border-[1px]' : 'bg-white'}`} >
                    <h2 className="text-center md:text-[20px] text-[20px] p-2 pt-4">Total de estabelecimentos</h2>
                    <PuffLoader color={`${darkMode ? `#0EC6CB` : `#011559`}`} loading={isLoading || isFetching} size={100} />
                </div>
                <div className={`h-[calc(50%-10px)] rounded flex flex-col justify-center items-center ${darkMode ? 'bg-gray-900 text-white border-azul_4 border-[1px]' : 'bg-white'}`} >
                    <h4 className={`mt-[20px] text-[20px]  ${darkMode ? 'text-white text-center' : 'text-black text-center'}`}>Filtros ativos:</h4>
                    <p className={darkMode ? 'text-azul_4 text-center p-2' : 'text-azul_0 text-center  p-2'}>
                        {filtrosAtivos}
                    </p>
                    {/* <p className={darkMode ? 'text-azul_4 text-center' : 'text-azul_0 text-center'}>
                        <PuffLoader color={`${darkMode ? `#0EC6CB` : `#011559`}`} loading={isLoading || isFetching} size={100} />
                    </p> */}
                </div>
            </>
        )
    }

    if (!isLoading && !isFetching && isSuccess) {
        content = (
            < >
                <div className={` rounded h-[calc(50%-10px)] flex flex-col justify-center items-center  ${darkMode ? 'bg-gray-900 text-white border-azul_4 border-[1px]' : 'bg-white'}`} >
                    <h2 className="text-center md:text-[20px] text-[20px] p-2 pt-4">Total de estabelecimentos {locName}</h2>
                    <h1 className={`text-[35px] ${darkMode ? 'text-azul_4 text-center' : 'text-azul_0 text-center'}`}>{Object.values(numData[0]).toLocaleString('pt-BR')}</h1>
                </div>
                <div className={`h-[calc(50%-10px)] rounded flex flex-col justify-center items-center ${darkMode ? 'bg-gray-900 text-white border-azul_4 border-[1px]' : 'bg-white'}`} >
                    <h4 className={`mt-[20px] text-[20px]  ${darkMode ? 'text-white text-center' : 'text-black text-center'}`}>Filtros ativos:</h4>
                    <p className={darkMode ? 'text-azul_4 text-center p-2' : 'text-azul_0 text-center  p-2'}>
                        {filtrosAtivos}
                    </p>
                </div>
            </>
        )
    }

    return (
        content

    )
}

export default NumericData