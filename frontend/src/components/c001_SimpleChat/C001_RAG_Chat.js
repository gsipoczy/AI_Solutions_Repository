import React, { useState } from 'react';
import C999InputText from '../c999_reusables/C999_InputText';
import C999ListModal from '../c999_reusables/C999_ListModal';
import C999InputFiles from '../c999_reusables/C999_InputFiles';
import Cookies from 'js-cookie';
import api from '../../api/backend';
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';
import '../c999_reusables/c999.css';

const C001RagChat = ({partnerUrl, clearUrl, uploadUrl, headerText, headerFiles}) => {

    const [list, setList] = useState([]);
    const [lastIndex, setLastIndex] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filesVdb, setFilesVdb] = useState("");

    const uploadFiles = (file_list) => {
        console.log("Files selected:")
        console.log(file_list)
        //file_list.map(item => console.log(item));
        for(let val in Object.keys(file_list)) {
            console.log(file_list[val])
        }

        setLoading(true);

        async function callUpload(file_list) {
            let currentUser = {}
            let curUser = Cookies.get("currentUser");
            if(curUser) {
                currentUser = JSON.parse(curUser);

                // Call backend
                const body = new FormData();
                const info = '{"username": "' + currentUser.username + '"}';
                body.append('info', info);
                for(let fkey in Object.keys(file_list)) {
                    body.append('file', file_list[fkey], file_list[fkey].name);
                }

                const headers = {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + currentUser.access_token
                }
                try {
                    const result = await api.post(uploadUrl, body, { headers: headers });
                    setLoading(false);
                    setFilesVdb(result.data.answer)
                } catch (err) {
                    alert("Posting error: " + err)
                    setLoading(false);
                }
            }
        }
        callUpload(file_list);
    }

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
        setFilesVdb("");
    }

    return (
        <>
            <C999CheckExpiry />
            <C999InputFiles
                headerText = {headerFiles}
                isObligatory = {true}
                obligatoryErrorText = {'Please select files'}
                buttonText = {'Upload'}
                updateFunction = {(data) => uploadFiles(data)}
            />
            {filesVdb !== "" && 
                <p>Files in vector database: {filesVdb}</p>
            }
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

export default C001RagChat;