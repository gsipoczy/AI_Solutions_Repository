import C001RagChat from "./C001_RAG_Chat";
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';

const C001RagGpt = () => {
    return (
        <>
        <C999CheckExpiry />
        <h1>RAG Chat with GPT</h1>
        <div>
            <C001RagChat
                partnerUrl = {'/d001/rag_gpt'}
                clearUrl={'/d001/clear_rag_gpt'}
                uploadUrl={'/d001/upload_files_gpt'}
                headerText={'Ask ChatGPT (about your uploaded files)'}
                headerFiles={'Select files to upload to the vector database'}
            />
        </div>
        </>
    )
}

export default C001RagGpt;