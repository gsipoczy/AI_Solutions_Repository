import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import api from '../../api/backend';
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';

const C000Delete = () => {

    const navigate = useNavigate();
    const { handleSubmit } = useForm();

    const deleteUser = (data) => {

        async function deleteU(data) {
            let currentUser = {}
            let curUser = Cookies.get("currentUser");
            if(curUser) {
                currentUser = JSON.parse(curUser);
                const id = currentUser.id
                const url = '/auth/delete_user/' + id;
                console.log("URL for delete: " + url);

                // Call backend
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                }
                try {
                    await api.delete(url, { headers: headers });
                    alert("Profile of " + currentUser.username + " deleted");
                } catch (err) {
                    alert("Posting error: " + err)
                }
            }

        }
        deleteU(data);

        console.log("Delete User: deleting cookie");
        Cookies.remove('currentUser');
        Cookies.remove('loggedIn');

        navigate('/');
        navigate(0);
    }

    return (
        <div className="main_form mt-5">
            <C999CheckExpiry />
            <form>
                <h2>Are you sure you want to delete your profile?</h2>
                <Form.Group className="mb-5">
                    <Button as="sub" variant="secondary dark" onClick={handleSubmit(deleteUser)}>
                        Delete
                    </Button>
                </Form.Group>
            </form>
        </div>
    )
}

export default C000Delete;