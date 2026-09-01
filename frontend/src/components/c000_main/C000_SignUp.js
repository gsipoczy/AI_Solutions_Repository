import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/backend';

const C000SignUp = () => {

    // Validate form.
    // use in form: {...register("username", ...rules)}
    //
    // maxLength: set the same as in the database field (string(25))
    const { register, handleSubmit, formState:{errors}, reset } = useForm();

    const [show, setShow] = useState(false)
    const [serverResponse, setServerResponse] = useState('')
    const [alertVariant, setAlertVariant] = useState('')

    // This is called in the submit button onClick
    const submitForm = async (data) => {
        if (data.password === data.confirmPassword) {

            // only pwc e-mail
            if(data.email.includes("@pwc.")) {
                const body = {
                    username: data.username,
                    email: data.email,
                    password: data.password,
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

                try {
                    const response = await api.post('/auth/signup', body);
                    console.log(response.data)
                    /*
                    Response.data format:
                    {
                        username: 'blablabla1', 
                        email: 'blabla@any.com', 
                        password: 'scrypt:32768:8:1$jRk6sN16uDAtzI7N$9d1b87e8811e9619…17c574ed2f77761d752083a93b9f8c398b0d8c29dc966c4c7'
                    }

                    status: 200-299 OK
                    */
                    setServerResponse(" User " + data.username + " successfully created.");
                    setAlertVariant('success')
                    setShow(true);
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
                setServerResponse("Please use your PwC e-mail address.");
                setAlertVariant('danger')
                setShow(true);
            }
        }

        else {
            setServerResponse("Passwords do not match");
            setAlertVariant('danger')
            setShow(true);
        }
    }

    return (
        <div className="main_form mt-5">

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
                <Form.Group className="mb-3">
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
                {/* <Form.Group className="mb-5">
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
                    <Button as="sub" variant="secondary dark" onClick={handleSubmit(submitForm)}>
                        Register
                    </Button>
                    <span className="keep_distance">or if you have an account already,</span>
                    <Link to='/'>
                        <Button variant="secondary dark"><small>Log In</small></Button>
                    </Link>
                </Form.Group>
            </form>
        </div>
    )
}

export default C000SignUp;