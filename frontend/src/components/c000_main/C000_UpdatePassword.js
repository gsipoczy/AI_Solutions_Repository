import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import api from '../../api/backend';
import Cookies from 'js-cookie';
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';
import Constants from '../../Constants';

const C000UpdatePassword = () => {

    const { register, handleSubmit, formState:{errors}, reset } = useForm();

    const [show, setShow] = useState(false)
    const [serverResponse, setServerResponse] = useState('')
    const [alertVariant, setAlertVariant] = useState('')
    const [currentUser, setCurrentUser] = useState({});
    const [isAdmin, setIsadmin] = useState(false);

    // This is called in the submit button onClick
    const updatePassword = (data) => {

        async function updateP(data) {
            if (data.password === data.confirmPassword &&
                ( data.oldPassword === currentUser.password || currentUser.username === Constants.ADMIN_USER )
            ) {
                let id = 0;
                console.log(currentUser.username);
                console.log(Constants.ADMIN_USER);
                console.log(currentUser.access_token);
                console.log(data.username);
                if(currentUser.username === Constants.ADMIN_USER) {
                    const url1 = '/auth/read_user';
                    const body1 = {
                        username: data.username
                    }
                    const headers1 = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + currentUser.access_token
                    }
                    try {    
                        const response = await api.post(url1, body1, { headers: headers1 });
                        console.log(response.data);
                        id = response.data.id;
                    } catch (err) {
                        setServerResponse("Posting error: " + err);
                        setAlertVariant('danger')
                        setShow(true);
                        id = 0;
                    }
                }
                else {
                    id = currentUser.id || 0;
                }
                if(id !== 0) {
                    const url = '/auth/update_password/' + id;
                    const body = {
                        password: data.password
                    }
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + currentUser.access_token
                    }
                    try {
                        await api.put(url, body, { headers: headers });
                        setServerResponse(" Password successfully updated.");
                        setAlertVariant('success')
                        setShow(true);
                        
                        let modUser = currentUser;
                        modUser.password = data.password;
                        setCurrentUser(modUser);
                        Cookies.set('currentUser', JSON.stringify(modUser));

                    } catch (err) {
                        setServerResponse("Posting error: " + err);
                        setAlertVariant('danger')
                        setShow(true);
                    }

                    reset();
                }
                else {
                    if(show === false) {
                        setServerResponse("User does not exist.");
                        setAlertVariant('danger')
                        setShow(true);
                    }
                }
            }
            else {
                setServerResponse("Incorrect password or new passwords do not match");
                setAlertVariant('danger')
                setShow(true);
            }
        }
        updateP(data);
    }


    useEffect(() => {
        let curUser = Cookies.get("currentUser");
        if(curUser) {
            setCurrentUser(JSON.parse(curUser));
        }
    }, []);

    useEffect(() => {
        if(currentUser.username === Constants.ADMIN_USER) { setIsadmin(true); }
        else { setIsadmin(false) ;}
    }, [currentUser]);

    return (
        <div className="main_form mt-5">
            <C999CheckExpiry />

            {show?  
                <>
                    <Alert variant={alertVariant} onClose={() => {setShow(false)}} dismissible>
                        <p>
                            {serverResponse}
                        </p>
                    </Alert>
                </>
                :<p></p>
            }

            <form>
                
                {isAdmin ?
                    <Form.Group className="mb-3">
                        <Form.Label>User</Form.Label>
                        {errors.username?.type==="required" && <small className="main_error"><br/>User is required</small>}
                        <Form.Control 
                            type="text" 
                            placeholder="User to change the password for"
                            {...register("username", {required:true})}
                        />
                    </Form.Group>
                :
                    <Form.Group className="mb-3">
                        <Form.Label>Old Password</Form.Label>
                        {errors.oldPassword?.type==="required" && <small className="main_error"><br/>Password is required</small>}
                        {errors.oldPassword?.type==="minLength" && <small className="main_error"><br/>Minimum length is 8 characters</small>}
                        <Form.Control 
                            type="password" 
                            placeholder="Your current password"
                            {...register("oldPassword", {required:true, minLength:8})}
                        />
                    </Form.Group>
                }
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    {errors.password?.type==="required" && <small className="main_error"><br/>Password is required</small>}
                    {errors.password?.type==="minLength" && <small className="main_error"><br/>Minimum length is 8 characters</small>}
                    <Form.Control 
                        type="password" 
                        placeholder="Your new password"
                        {...register("password", {required:true, minLength:8})}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    {errors.confirmPassword?.type==="required" && <small className="main_error"><br/>Confirmation is required</small>}
                    {errors.confirmPassword?.type==="minLength" && <small className="main_error"><br/>Minimum length is 8 characters</small>}
                    <Form.Control 
                        type="password" 
                        placeholder="Repeat new password"
                        {...register("confirmPassword", {required:true, minLength:8})}
                    />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Button as="sub" variant="secondary dark" onClick={handleSubmit(updatePassword)}>
                        Save
                    </Button>
                </Form.Group>
            </form>
        </div>
    )
}

export default C000UpdatePassword;