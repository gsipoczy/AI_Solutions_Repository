//import Constants from '../../Constants';
import C001Gpt from './C001_Gpt';
import C001Ollama from './C001_Ollama';
import C001RagGpt from './C001_RAG_Gpt';
import C001RagOllama from './C001_RAG_Ollama';
import { Routes, Route } from 'react-router-dom';

const C000Routes = () => {

    return (
        <Routes>
            <Route exact path="/d001/gpt" element={<C001Gpt />} />
            <Route exact path="/d001/ollama" element={<C001Ollama />} />
            <Route exact path="/d001/rag_gpt" element={<C001RagGpt />} />
            <Route exact path="/d001/rag_ollama" element={<C001RagOllama />} />
        </Routes>
    )

}

export default C000Routes;