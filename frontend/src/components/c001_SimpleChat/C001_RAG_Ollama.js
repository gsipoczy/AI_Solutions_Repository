import C001RagChat from "./C001_RAG_Chat";
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';

const C001RagOllama = () => {
    return (
        <>
        <C999CheckExpiry />
        <h1>RAG Chat with Ollama</h1>
        <div>
            <C001RagChat
                partnerUrl = {'/d001/rag_ollama'}
                clearUrl={'/d001/clear_rag_ollama'}
                uploadUrl={'/d001/upload_files_ollama'}
                headerText={'Ask Ollama (local LLM model about your uploaded files)'}
                headerFiles={'Select files to upload to the vector database'}
            />
        </div>
        </>
    )
}

export default C001RagOllama;