import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import api from '../../api/backend';
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';

const C000Logout = () => {

    const navigate = useNavigate();
    const { handleSubmit } = useForm();

    const logoutUser = (data) => {

        async function logout(data) {
            let currentUser = {}
            let curUser = Cookies.get("currentUser");
            if(curUser) {
                currentUser = JSON.parse(curUser);

                // Call backend
                const body = {
                    username: currentUser.username
                }
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                }
                try {
                    await api.post('/auth/logout', body, { headers: headers });
                } catch (err) {
                    alert("Posting error: " + err)
                }
            }

        }
        logout(data);

        console.log("Logout: deleting cookie");
        Cookies.remove('currentUser');
        Cookies.remove('loggedIn');

        navigate('/');
        navigate(0);
    }

    return (
        <div className="main_form mt-5">
            <C999CheckExpiry />
            <form>
                <Form.Group className="mb-5">
                    <Button as="sub" variant="secondary dark" onClick={handleSubmit(logoutUser)}>
                        Log Out
                    </Button>
                </Form.Group>
            </form>
        </div>
    )
}

export default C000Logout;