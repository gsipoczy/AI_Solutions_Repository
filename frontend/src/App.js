
import Cookies from 'js-cookie';
import api from './api/backend';
import {useEffect} from 'react';
import NavBar from './components/Navbar';
//import NotFound from './components/Notfound';
import { Container } from 'react-bootstrap';

import C000Routes from './components/c000_main/C000_Routes';
import C001Routes from './components/c001_SimpleChat/C001_Routes';



function App() {
    
    useEffect(() => {
        const handleClose = (e) => {
            async function logout() {
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
            logout();
        }
        window.addEventListener("unload", handleClose);

        return () => {
            window.removeEventListener('unload', handleClose);
        };
    }, []);


    return (
        <div>
            <Container>
                <NavBar />
                <C000Routes />
                <C001Routes />
            </Container>
        </div>
    )
}

export default App;