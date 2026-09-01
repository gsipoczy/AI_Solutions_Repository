import C001Chat from "./C001_Chat";
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';

const C001Gpt = () => {
    return (
        <>
        <C999CheckExpiry />
        <h1>Simple Chat with GPT</h1>
        <div>
            <C001Chat
                partnerUrl = {'/d001/chat_gpt'}
                clearUrl={'/d001/clear_chat_gpt'}
                headerText={'Ask ChatGPT'}
            />
        </div>
        </>
    )
}

export default C001Gpt;