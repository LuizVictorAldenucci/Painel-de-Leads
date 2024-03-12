import './App.css';
import { Routes, Route, useSearchParams, useLocation } from 'react-router-dom'
import Layout from './components/Layout';
import Main from './components/Main';
import DownloadButton from './components/DownloadButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectUf, selectCidade, selectBairro, selectAssociados, selectSouabrasel, selectPageSize, selectOrigem, changeUf, changeCidade, changeBairro, changeSouabrasel, changeOrigem, changeAssociados, changeGroupby, changeBairros, changeOrigens } from './features/queryParams/queryParamsSlice';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch(0)
  let location = useLocation()
  const [search, setSearch] = useSearchParams()
  const uf = useSelector(selectUf)
  const cidade = useSelector(selectCidade)
  const bairro = useSelector(selectBairro)
  const origem = useSelector(selectOrigem)
  const associados = useSelector(selectAssociados)
  const souabrasel = useSelector(selectSouabrasel)
  const pageSize = useSelector(selectPageSize)

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

  // Caso tenha inserido parâmetros na URL (useEffect ocorre apenas uma vez)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const uf = searchParams.get('uf');
    const cidade = searchParams.get('cidade');
    const associados = searchParams.get('associados');
    const souabrasel = searchParams.get('souabrasel');
    const bairro = searchParams.get('bairro');
    const origem = searchParams.get('origem');

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
  }, [])

  // Caso não tenha inserido parâmetros na URL
  const queryObject = {};
  const origensValue = origem.map(origem => origem.value)

  if (uf && uf !== "") queryObject.uf = uf;
  if (cidade !== "") queryObject.cidade = cidade;
  if (Array.isArray(bairro) && bairro.length > 0) queryObject.bairro = [bairro];
  if (souabrasel !== "") queryObject.souabrasel = souabrasel;
  if (associados !== "") queryObject.associados = associados;
  if (Array.isArray(origem) && origem.length > 0) queryObject.origem = [origensValue];
  if (pageSize != 0) queryObject.pageSize = pageSize

  useEffect(() => {
    setSearch(queryObject)
  }, [uf, cidade, bairro, associados, souabrasel, origem])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path='download' element={<DownloadButton />} />
      </Route>
    </Routes>
  );
}

export default App;
