import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import api from '../../api/backend';
import Cookies from 'js-cookie';
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';

const C000UpdateUser = () => {

    // Validate form.
    // use in form: {...register("username", ...rules)}
    //
    // maxLength: set the same as in the database field (string(25))
    const { register, handleSubmit, formState:{errors}, setValue, reset } = useForm();

    const [show, setShow] = useState(false)
    const [serverResponse, setServerResponse] = useState('')
    const [alertVariant, setAlertVariant] = useState('')
    const [currentUser, setCurrentUser] = useState({});

    // This is called in the submit button onClick
    const updateUser = (data) => {

            if(data.email.includes("@pwc.")) {

                async function updateU(data) {

                const id = currentUser.id || 0;
                if(id !== 0) {
                    const url = '/auth/update_user/' + id;

                    const body = {
                        username: data.username,
                        email: data.email,
                        //password: data.password,
                        gpt_api_key: data.gpt_api_key,
                        gpt_model: data.gpt_model,
                        api_key0: '', //data.api_key0,
                        api_key1: '', //data.api_key1,
                        api_key2: '', //data.api_key2,
                        api_key3: '', //data.api_key3,
                        api_key4: '', //data.api_key4,
                        api_key5: '', //data.api_key5,
                        api_key6: '', //data.api_key6,
                        api_key7: '', //data.api_key7,
                        api_key8: '', //data.api_key8,
                        api_key9: '', //data.api_key9,
                        var0: '', //data.var0,
                        var1: '', //data.var1,
                        var2: '', //data.var2,
                        var3: '', //data.var3,
                        var4: '', //data.var4,
                        var5: '', //data.var5,
                        var6: '', //data.var6,
                        var7: '', //data.var7,
                        var8: '', //data.var8,
                        var9: '', //data.var9
                    }
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + currentUser.access_token
                    }

                    try {
                        const response = await api.put(url, body, { headers: headers });
                        console.log(response.data)
                        setServerResponse(" User " + data.username + " successfully updated.");
                        setAlertVariant('success')
                        setShow(true);
                        
                        let modUser = currentUser;
                        modUser.username = data.username;
                        modUser.email = data.email;
                        //password: data.password,
                        modUser.gpt_api_key = data.gpt_api_key;
                        modUser.gpt_model = data.gpt_model;
                        modUser.api_key0 = ''; //data.api_key0,
                        modUser.api_key1 = ''; //data.api_key1,
                        modUser.api_key2 = ''; //data.api_key2,
                        modUser.api_key3 = ''; //data.api_key3,
                        modUser.api_key4 = ''; //data.api_key4,
                        modUser.api_key5 = ''; //data.api_key5,
                        modUser.api_key6 = ''; //data.api_key6,
                        modUser.api_key7 = ''; //data.api_key7,
                        modUser.api_key8 = ''; //data.api_key8,
                        modUser.api_key9 = ''; //data.api_key9,
                        modUser.var0 = ''; //data.var0,
                        modUser.var1 = ''; //data.var1,
                        modUser.var2 = ''; //data.var2,
                        modUser.var3 = ''; //data.var3,
                        modUser.var4 = ''; //data.var4,
                        modUser.var5 = ''; //data.var5,
                        modUser.var6 = ''; //data.var6,
                        modUser.var7 = ''; //data.var7,
                        modUser.var8 = ''; //data.var8,
                        modUser.var9 = ''; //data.var9
                        setCurrentUser(modUser);
                        Cookies.set('currentUser', JSON.stringify(modUser));

                    } catch (err) {
                        // we get 409 if the user exists already
                        if(String(err.status).includes("409")) {
                            setServerResponse("User " + data.username + " already exists.");
                            setAlertVariant('warning')
                            setShow(true);  
                        }
                        else {
                            //alert("Posting error: " + err)
                            setServerResponse("Posting error: " + err);
                            setAlertVariant('danger')
                            setShow(true);
                        }
                    }

                    reset();
                }
                else {
                    setServerResponse("User does not exist.");
                    setAlertVariant('danger')
                    setShow(true);
                }
            }
            updateU(data);
        }
        else {
            setServerResponse("Please use your PwC e-mail address.");
            setAlertVariant('danger')
            setShow(true);
        }
    }

    useEffect(() => {
        let curUser = Cookies.get("currentUser");
        if(curUser) {
            setCurrentUser(JSON.parse(curUser));
        }
    }, []);

    useEffect(() => {
        setValue('username', currentUser.username);
        setValue('email', currentUser.email);
        setValue('gpt_api_key', currentUser.gpt_api_key);
        setValue('gpt_model', currentUser.gpt_model);
    }, [currentUser, setValue]);


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
                
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    {errors.username?.type==="required" && <small className="main_error"><br/>Username is required</small>}
                    {errors.username?.type==="maxLength" && <small className="main_error"><br/>Maximum length is 25 characters</small>}
                    <Form.Control 
                        type="text" 
                        placeholder="Your Username"
                        {...register("username", {required:true, maxLength:25})}
                    />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>E-mail</Form.Label>
                    {errors.email?.type==="required" && <small className="main_error"><br/>E-mail is required</small>}
                    {errors.email?.type==="maxLength" && <small className="main_error"><br/>Maximum length is 80 characters</small>}
                    {errors.email?.message && 
                        <small className="main_error"><br/>{errors.email?.message}</small>}
                    <Form.Control 
                        type="email" 
                        placeholder="Your e-mail address"
                        {...register("email", {
                            required:true, 
                            maxLength:80,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid e-mail address"
                            }
                        })}
                    />
                </Form.Group>
                {/*<Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    {errors.password?.type==="required" && <small className="main_error"><br/>Password is required</small>}
                    {errors.password?.type==="minLength" && <small className="main_error"><br/>Minimum length is 8 characters</small>}
                    <Form.Control 
                        type="password" 
                        placeholder="Your password"
                        {...register("password", {required:true, minLength:8})}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    {errors.confirmPassword?.type==="required" && <small className="main_error"><br/>Confirmation is required</small>}
                    {errors.confirmPassword?.type==="minLength" && <small className="main_error"><br/>Minimum length is 8 characters</small>}
                    <Form.Control 
                        type="password" 
                        placeholder="Your password"
                        {...register("confirmPassword", {required:true, minLength:8})}
                    />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Button as="sub" variant="secondary dark" onClick={handleSubmit(submitForm)}>
                        Register
                    </Button>
                    <span className="keep_distance">or if you have an account already,</span>
                    <Link to='/'>
                        <Button variant="secondary dark"><small>Log In</small></Button>
                    </Link>
                </Form.Group> */}
                <h2>Additional data</h2>
                <Form.Group className="mb-3">
                    <Form.Label>GPT API Key</Form.Label>
                    {errors.username?.type==="maxLength" && <small className="main_error"><br/>Maximum length is 255 characters</small>}
                    <Form.Control 
                        type="text" 
                        placeholder="API Key for GPT"
                        {...register("gpt_api_key", {maxLength:255})}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>GPT Model</Form.Label>
                    {errors.username?.type==="maxLength" && <small className="main_error"><br/>Maximum length is 255 characters</small>}
                    <Form.Control 
                        type="text" 
                        placeholder="Your preferred GPT model"
                        {...register("gpt_model", {maxLength:255})}
                    />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Button as="sub" variant="secondary dark" onClick={handleSubmit(updateUser)}>
                        Save
                    </Button>
                </Form.Group>
            </form>
        </div>
    )
}

export default C000UpdateUser;