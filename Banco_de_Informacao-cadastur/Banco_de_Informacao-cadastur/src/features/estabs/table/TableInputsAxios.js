
import { useCallback, useMemo, useState, useEffect } from "react";
import { Dropdown } from 'react-bootstrap';
import axios from "axios";
import { utils, write } from 'xlsx';
import { PuffLoader } from 'react-spinners';
import { useDispatch, useSelector } from "react-redux";
import { selectUf, selectCidade, selectBairro, selectAssociados, selectSouabrasel, selectOrigem, changeCsvHref, changeXlsxHref, selectCsvHref, selectXlsxHref } from "../../queryParams/queryParamsSlice";
import { useGetCountsQuery } from "../../counts/countsSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineWhatsApp } from 'react-icons/ai'
import { BiExport } from "react-icons/bi";

const TableInputsAxios = () => {
    const [search, setSearch] = useSearchParams()
    const uf = useSelector(selectUf)
    const cidade = useSelector(selectCidade)
    const bairro = useSelector(selectBairro)
    const associados = useSelector(selectAssociados)
    const souabrasel = useSelector(selectSouabrasel)
    const origem = useSelector(selectOrigem)
    const [loadingDownload, setLoadingDownload] = useState(false);
    const controller = new AbortController();
    const [showMenuWhatsapp, setShowMenuWhatsapp] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const [showMenuExport, setShowMenuExport] = useState(false);
    const { data: numData, isLoading, isFetching } = useGetCountsQuery({
        uf, cidade, bairro, associados, souabrasel, origem
    });

    const numEstabs = useMemo(() => {
        if (!numData) return
        return numData[0].TOTAL
    }, [numData])

    const handleToggleWhatsapp = () => {
        setShowMenuWhatsapp(!showMenuWhatsapp);
    };
    const handleToggleExport = () => {
        setShowMenuExport(!showMenuExport);
    };

    const preparedUrl = useMemo(() => {
        const baseUrl = `https://ec252.abrasel.com.br:8443/api/leads/v1/estabelecimentos`
        const params = new URLSearchParams();
        params.set('page', 0);
        params.set('pageSize', numEstabs);

        if (uf && uf !== '') {
            params.set('uf', uf);
        }
        if (cidade && cidade !== '') {
            params.set('cidade', cidade);
        }
        if (bairro && bairro.length > 0) {
            params.set('bairro', bairro);
        }
        if (associados && associados !== '') {
            params.set('associados', associados);
        }
        if (souabrasel && souabrasel !== '') {
            params.set('souabrasel', souabrasel);
        }
        if (origem && origem !== '') {
            const origensValue = origem.map(origem => origem.value)
            params.set('origem', origensValue);
        }
        return `${baseUrl}?${params.toString()}`;
    }, [uf, cidade, bairro, associados, souabrasel, numEstabs, origem])

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
                        'Origem': estab.ORIGEM.filter(origem => origem !== '').join(', '),
                        'Associados Abrasel?': returnYesOrNo(estab.ASSOCIADO),
                        'Tem Sou Abrasel?': returnYesOrNo(estab.SOU_ABRASEL),
                        'Pesquisar no Google': `https://www.google.com/search?q=${removeSpaces(estab.NOME_FANTASIA ?? estab.RAZAO_SOCIAL_RFB)}+${removeSpaces(estab.UF)}+${removeSpaces(estab.CIDADE)}+${removeSpaces(estab.BAIRRO)}`,
                        'Pesquisar no Google Maps': `https://www.google.com/maps/search/${removeSpaces(estab.NOME_FANTASIA ?? estab.RAZAO_SOCIAL_RFB)}+${removeSpaces(estab.UF)}+${removeSpaces(estab.CIDADE)}+${removeSpaces(estab.BAIRRO)}`
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
        const headers = ["CNPJ", "Nome fantasia", "Municipio", "Bairro", "Endereco", "Telefone", "E-mail", "Origem", "Associados Abrasel?", "Tem Sou Abrasel?", "Pesquisar no Google", "Pesquisar no Google Maps"];
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

    const handleSendMessage = async () => {
        const searchParamsObject = {};
        for (const [key, value] of search.entries()) {
            if (key !== 'pageSize') {
                searchParamsObject[key] = value;
            }
        }

        searchParamsObject['pageSize'] = numEstabs;

        const searchParams = new URLSearchParams(searchParamsObject);
        const query = searchParams.toString();

        const url = `https://painel-de-leads-abrasel.onrender.com/download/?${query}`;

        const message = `Olá! Faça o download dos estabelecimentos neste link ${url}`;

        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, "_blank");
    };

    const handleCopyMessage = async () => {
        const searchParamsObject = {};
        for (const [key, value] of search.entries()) {
            if (key !== 'pageSize') {
                searchParamsObject[key] = value;
            }
        }
        searchParamsObject['pageSize'] = numEstabs;

        const searchParams = new URLSearchParams(searchParamsObject);
        const query = searchParams.toString();

        const url = `https://painel-de-leads-abrasel.onrender.com/download/?${query}`;

        try {
            await navigator.clipboard.writeText(url);
            setCopySuccess(true); // Set the state to indicate success

            setShowCopyMessage(true); // Show the copy message
            setTimeout(() => {
                setShowCopyMessage(false); // Hide the copy message after 3 seconds
            }, 3000); // 3000 milliseconds = 3 seconds
        } catch (err) {
            console.error('Failed to copy URL to clipboard:', err);
            setCopySuccess(false); // Set the state to indicate failure
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setShowIcon(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initialize the state on load

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [window.innerWidth]);

    return (loadingDownload) ? (
        <PuffLoader size={20} color={'#fff'} />
    ) :
        (
            <div
                className="flex gap-2"
            >
                {/* <Dropdown
                    show={showMenuWhatsapp}
                    onToggle={handleToggleWhatsapp}>
                    <Dropdown.Toggle
                        disabled={!cidade || isLoading || isFetching}
                        variant="info"
                        id="dropdown"
                        onClick={handleToggleWhatsapp}
                    >
                        {showIcon ? (
                            <AiOutlineWhatsApp className="text-xl mx-1  text-white" />
                        ) : (
                            <div className="flex max-h-[14px] ">
                                <p className="text-xs md:text-sm">Compartilhar link</p>
                            </div>
                        )}
                    </Dropdown.Toggle>
                    {showMenuWhatsapp && (
                        <Dropdown.Menu
                            className="flex flex-col z-10 mt-4 bg-white "
                        >
                            <Dropdown.Item
                                className="text-black hover:bg-gray-100 p-3"
                                onClick={handleSendMessage}
                            >
                                Compartilhar no WhatsApp
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="text-black hover:bg-gray-100 p-3"
                                onClick={handleCopyMessage}
                            >
                                {showCopyMessage && <p>URL copiada!</p>}
                                {!showCopyMessage && <p>Copiar link</p>}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    )}
                </Dropdown> */}
                <Dropdown show={showMenuExport} onToggle={handleToggleExport}>
                    <Dropdown.Toggle
                        disabled={!cidade || isLoading || isFetching}
                        variant="info"
                        id="dropdown"
                        onClick={handleToggleExport}
                    >
                        {showIcon ? (
                            <BiExport className="text-xl mx-1  text-white" />
                        ) : (
                            <div className="flex max-h-[14px] ">
                                <p className="text-xs md:text-sm">Exportar</p>
                            </div>
                        )}
                    </Dropdown.Toggle>
                    {showMenuExport && (
                        <Dropdown.Menu
                            className="flex flex-col z-10 mt-4 bg-white "
                        >
                            <Dropdown.Item href="#/action-1"
                                className="text-black hover:bg-gray-100 p-3 "
                                onClick={(event) => {
                                    handleDownloadCsv();
                                    event.stopPropagation();
                                }}
                            >
                                CSV
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="text-black hover:bg-gray-100 p-3"
                                onClick={(event) => {
                                    handleDownloadXlsx();
                                    event.stopPropagation();
                                }}
                            >
                                XLSX
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    )}
                </Dropdown>
            </div>
        )
}


export default TableInputsAxios
