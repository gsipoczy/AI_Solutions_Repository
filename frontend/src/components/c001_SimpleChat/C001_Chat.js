import React, { useState } from 'react';
import C999InputText from '../c999_reusables/C999_InputText';
import C999ListModal from '../c999_reusables/C999_ListModal';
import Cookies from 'js-cookie';
import api from '../../api/backend';
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';
import '../c999_reusables/c999.css';

const C001Chat = ({partnerUrl, clearUrl, headerText}) => {

    const [list, setList] = useState([]);
    const [lastIndex, setLastIndex] = useState(1);
    const [loading, setLoading] = useState(false);

    const askLlm = (data) => {
        const question = data;

        let listItem = {};
        let answer = '';
        setLoading(true);

        async function callBackend(question) {
            let currentUser = {}
            let curUser = Cookies.get("currentUser");
            if(curUser) {
                currentUser = JSON.parse(curUser);

                // Call backend
                const body = {
                    username: currentUser.username,
                    question: question
                }
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                }
                try {
                    const result = await api.post(partnerUrl, body, { headers: headers });
                    setLoading(false);
                    answer = result.data.answer
                    console.log("answer:\n" + answer);
                    listItem = {
                        id: lastIndex,
                        title: question,
                        description: answer
                    }
                    setLastIndex(lastIndex + 1);
                    setList(list => [...list, listItem]);
                    console.log(list.length);
                } catch (err) {
                    alert("Posting error: " + err)
                }
            }
        }
        callBackend(question);

    }

    const clearChat = () => {
        setLastIndex(1);
        setList([]);

        async function callBackendClear() {
            let currentUser = {}
            let curUser = Cookies.get("currentUser");
            if(curUser) {
                currentUser = JSON.parse(curUser);
                console.log("Cleanup user: " + currentUser.username);
                console.log("Cleanup token: " + currentUser.access_token);

                // Call backend
                const body = {
                    username: currentUser.username
                }
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                }
                try {
                    await api.post(clearUrl, body,  { headers: headers });
                } catch (err) {
                    alert("Posting error: " + err)
                }
            }
        }
        callBackendClear();

    }

    return (
        <>
            <C999CheckExpiry />
            <C999InputText
                headerText = {headerText}
                originalText = {''}
                isObligatory = {true}
                obligatoryErrorText = {'Plase enter your question'}
                numberOfRows = {10}
                buttonText = {'Send'}
                updateFunction = {(data) => askLlm(data)}
                showOnClick={list.length > 0}
                onClick = {clearChat }
                onClickButtonText = {'Clear History'}
            />
            {loading && 
                <div className='c999_loader'></div>
            }
            {
                <C999ListModal
                    headerText = {''}
                    list = {list.reverse()}
                    modalTitle = {'Q&A'}
                    itemTitlePrefix = {'Q: '}
                    itemDescriptionPrefix = {'A: '}
                    showOnClick={false}
                    onClick = {() => {}}
                    onClickButtonText = {''}
                    showOnDelete={false}
                    onDelete = {() => {}}
                    onDeleteButtonText = {''}
                />
            }
        </>
    )
}

export default C001Chat;