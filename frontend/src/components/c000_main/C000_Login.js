import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/backend';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const C000Login = () => {

    // Validate form.
    // use in form: {...register("username", ...rules)}
    //
    // maxLength: set the same as in the database field (string(25))
    const { register, handleSubmit, formState:{errors}, reset } = useForm();

    const [show, setShow] = useState(false);
    const [serverResponse, setServerResponse] = useState('');
    const [alertVariant, setAlertVariant] = useState('');
    const navigate = useNavigate();

    function checkCookie(){
        var cookieEnabled = navigator.cookieEnabled;
        if (!cookieEnabled){ 
            setServerResponse("Please enable cookies!");
            setAlertVariant('danger')
            setShow(true);
        }
        Cookies.remove('currentUser');
    }
    checkCookie();

    const loginUser = async (data) => {
        const body = {
            username: data.username,
            password: data.password
        }

        try {
            const response = await api.post('/auth/login', body);
            console.log(response.data)
            /*
            Response.data format at 200:
            {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6Z…DI5fQ.-gmdGN7iotB03kPvGmDsvK1M3OwoXxKi9BMslqFWwoE', 
                refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6Z…kyOX0.V1-OHR3SXPNLCTBjE_vvzYhNQlO1RZQ8zPbDieX0gBk', 
                username: 'gabor', 
                password: 'gaborgabor', 
                email: 'gabor@pwc.ch'
            }
            status: 200-299 OK
            */
            
            console.log("Login: saving user to cookie");
            Cookies.set('currentUser', JSON.stringify(response.data));
            Cookies.set('loggedIn', 'true');

            reset();
            navigate('/main/home');
            navigate(0);

        } catch (err) {
            // we get 401 if the user unauthorized
            if(String(err.status).includes("401")) {
                setServerResponse("Wrong credentials");
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
                    <h1>Log In</h1>
                </>
                :
                <h1>Log In</h1>
            }

            <form>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    {errors.username?.type==="required" && <small className="main_error"><br/>Username is required</small>}
                    {errors.username?.type==="maxLength" && <small className="main_error"><br/>Maximum length is 25 characters</small>}
                    <Form.Control 
                        type="text" 
                        placeholder="Username"
                        {...register("username", {required:true, maxLength:25})}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    {errors.password?.type==="required" && <small className="main_error"><br/>Password is required</small>}
                    {errors.password?.type==="minLength" && <small className="main_error"><br/>Minimum length is 8 characters</small>}
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        {...register("password", {required:true, minLength:8})}
                    />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Button as="sub" variant="secondary dark" onClick={handleSubmit(loginUser)}>
                        Log In
                    </Button>
                </Form.Group>
                <Form.Group>
                    <small>Don't have an account?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to='/main/signup'>
                            <Button variant="light"><small>Register</small></Button>
                        </Link>
                    </small>
                </Form.Group>
            </form>
        </div>
    )
}

export default C000Login;