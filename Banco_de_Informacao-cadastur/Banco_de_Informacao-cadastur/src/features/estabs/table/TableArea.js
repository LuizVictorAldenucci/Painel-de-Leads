import Table from './Table';
import FilterTableInput from './FilterTableInput';
import { useSelector } from 'react-redux';
import { selectUf, selectCidade, selectBairro, selectAssociados, selectSouabrasel, selectDarkMode, selectPageSize, selectOrigem, selectGroupby } from '../../queryParams/queryParamsSlice';
import { useGetEstabsQuery } from '../estabsSlice';
import { useEffect, useState } from 'react';
import TableInputsAxios from './TableInputsAxios';

const TableArea = () => {
    const uf = useSelector(selectUf)
    const cidade = useSelector(selectCidade)
    const groupby = useSelector(selectGroupby)
    const bairro = useSelector(selectBairro)
    const origem = useSelector(selectOrigem)
    const associados = useSelector(selectAssociados)
    const souabrasel = useSelector(selectSouabrasel)
    const pageSize = useSelector(selectPageSize)
    const darkMode = useSelector(selectDarkMode)
    const [skipFetch, setSkipFetch] = useState(true)

    const { data: estabsData, isLoading, isSuccess, isError, error, isFetching, refetch } = useGetEstabsQuery({
        uf, cidade, bairro, associados, souabrasel, pageSize, origem
    }, { skip: skipFetch });

    useEffect(() => {
        if (uf === '' || cidade === '') {
            setSkipFetch(true)
        } else if (cidade && groupby === 'bairro') {
            setSkipFetch(false)
        }
    }, [cidade, bairro, associados, souabrasel, origem, uf])

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

    return (
        <div className={`border-[1px] rounded ${darkMode ? 'border-azul_4 bg-gray-900' : 'bg-azul_0'}`}>
            <>
                <div className={`flex justify-between items-center px-4 py-2 text-white ${darkMode ? 'bg-azul_4' : 'bg-azul_0'}`}>
                    <h3 className={`text-[20px] md:text-[25px] ${darkMode ? 'text-gray-900' : 'text-white'}`}>Lista de estabelecimentos</h3>
                    <TableInputsAxios />
                </div>
                <>
                    <FilterTableInput
                        estabsData={estabsData}
                    />
                    <div className={` overflow-auto h-75 flex flex-col justify-between items-strech w-[100%]  ${darkMode ? 'scrollbar:bg-transparent' : ''}`}>
                        <Table
                            estabsData={estabsData}
                            isLoading={isLoading}
                            isFetching={isFetching}
                            isError={isError}
                            error={error}
                            refetch={refetch}
                        />
                    </div>
                </>
            </>
        </div>
    );
}

export default TableArea