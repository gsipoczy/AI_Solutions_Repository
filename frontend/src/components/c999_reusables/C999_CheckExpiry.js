import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/backend';
import Cookies from 'js-cookie';

const C999CheckExpiry = () => {

    console.log("CheckExpiry: reading user from local storage")
    //let loggedIn = true;
    const [loggedIn, setLoggedIn] = useState(true);
    let currentUser = {}
    let curUser = Cookies.get("currentUser");
    if(!curUser) {
        console.log("CheckExpiry: user not found")
    }
    else {
        currentUser = JSON.parse(curUser);
        console.log(currentUser.username);
    }
    const navigate = useNavigate();

    function checkExp() {
        async function checkExp2() {
            if(!currentUser) {
                console.log("currentUser none")
                //loggedIn = false;
                setLoggedIn(false);
                Cookies.set('loggedIn', 'false');
            }
            else {
                console.log("currentUser NOT none")
                if(currentUser && !currentUser.username) {
                    console.log("No user logged in " + currentUser.username);
                    //loggedIn = false;
                    setLoggedIn(false);
                    Cookies.set('loggedIn', 'false');
                }
                else {
                    console.log("User " + currentUser.username + " logged in");
                    const body = {};

                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + currentUser.access_token
                    }
            
                    try {
                        const response = await api.post('/auth/check_expiry', body, { headers: headers });
                        console.log("Expiry check: " + response.data)
                    } catch (err) {
                        console.log("Token expired")
                        const body2 = {};
                        const headers2 = {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + currentUser.refresh_token
                        }
                        try {
                            const response = await api.post('/auth/refresh', body2, { headers: headers2 });
                            console.log("Refresh response: " + response.data)
                            currentUser.access_token = response.data.access_token;
                            Cookies.set('currentUser', JSON.stringify(currentUser));
                            Cookies.set('loggedIn', 'true');
                        } catch (err) {
                            console.log("Token expired")
                            //loggedIn = false;
                            setLoggedIn(false);
                            Cookies.set('loggedIn', 'false');
                        }
                    }
                }
            }
        }
        checkExp2();
    }
    

    useEffect(() => {
        return () => {
            if(!loggedIn) {
                navigate("/");
                navigate(0);
            }
        }
    }, [loggedIn])

    return ( <p onLoad={checkExp()}></p> )

}

export default C999CheckExpiry;