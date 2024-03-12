import React from 'react'
import ChartsData from '../features/counts/ChartsData';
import NumericData from '../features/counts/NumericData';
import Selectors from '../features/counts//selectors/Selectors';
import TableArea from '../features/estabs/table/TableArea';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../features/queryParams/queryParamsSlice';

const Main = () => {
    const darkMode = useSelector(selectDarkMode)
    return (
        <div className={darkMode ? 'bg-gray-900' : 'bg-gray-100'}>
            <div className={`px-10 pb-10 flex flex-col justify-between  ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <Selectors />
            </div>
            <div className='md:h-[375px] flex justify-between items-stretch flex-wrap px-10 gap-10'>
                <div className={`flex-1 md:h-full h-[365px] rounded sm:pt-2 w-full flex flex-col justify-between md:w-[calc(50%-10px)]`}>
                    <NumericData />
                </div>
                <div className={`h-[365px] md:h-full overflow-auto rounded  sm:pt-2 w-full flex flex-col justify-start items-strech md:w-[calc(50%-10px)]`}>
                    <ChartsData />
                </div>
            </div>
            <div className={`p-[40px]`}>
                <TableArea />
            </div>
        </div>
    )
}

export default Main