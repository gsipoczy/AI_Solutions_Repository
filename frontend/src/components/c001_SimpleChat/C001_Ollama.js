import C001Chat from "./C001_Chat";
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';

const C001Ollama = () => {
    return (
        <>
        <C999CheckExpiry />
        <h1>Simple Chat with Ollama</h1>
        <div>
            <C001Chat
                partnerUrl = {'/d001/chat_ollama'}
                clearUrl={'/d001/clear_chat_ollama'}
                headerText={'Ask Ollama (local LLM model)'}
            />
        </div>
        </>
    )
}

export default C001Ollama;