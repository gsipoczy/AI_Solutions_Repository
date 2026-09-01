import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Cookies from 'js-cookie';
import Constants from '../Constants';

const LoggedInLinks = () => {
    return (
        <>
            <Nav.Link href={Constants.URL_HOME}>Home</Nav.Link>
            <NavDropdown title="Demos" id="demos">
                <NavDropdown drop="end" title="Chat" id="chat">
                    <NavDropdown drop="end" title="Simple Chat" id="chat">
                        <NavDropdown.Item href="/d001/gpt">Chat with GPT</NavDropdown.Item>    
                        <NavDropdown.Item href="/d001/ollama">Chat with Ollama</NavDropdown.Item>    
                    </NavDropdown>
                </NavDropdown>
                {/*<NavDropdown drop="end" title="Translate" id="translate">
                    <NavDropdown drop="end" title="Simple Translate" id="translate">
                        <NavDropdown.Item href="#" disabled>Translate with GPT</NavDropdown.Item>    
                        <NavDropdown.Item href="#" disabled>Translate with Ollama</NavDropdown.Item>    
                    </NavDropdown>
                </NavDropdown>*/}
                <NavDropdown drop="end" title="RAG" id="rag">
                    <NavDropdown drop="end" title="Simple RAG, memory vector store" id="rag">
                        <NavDropdown.Item href="/d001/rag_gpt" >RAG with GPT</NavDropdown.Item>    
                        <NavDropdown.Item href="/d001/rag_ollama" >RAG with Ollama</NavDropdown.Item>    
                    </NavDropdown>
                </NavDropdown>
            </NavDropdown>
            <NavDropdown title="Profile" id="profile">
                <NavDropdown.Item href="/main/update_user">Modify Data</NavDropdown.Item>
                <NavDropdown.Item href="/main/update_password">Change Password</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/main/delete">Delete Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/main/logout">Log Out</NavDropdown.Item>
            </NavDropdown>
</>
    )
}

const LoggedOutLinks = () => {
    return (
        <>
            <Nav.Link href="/" disabled><span className="navlogin">Log In</span></Nav.Link>
        </>
    )
}

const isLoggedIn = () => {
    let logCookie = Cookies.get("loggedIn");
    let logged = false
    if(logCookie) {
        logged = logCookie === 'true';
    }
    console.log("Navbar logged: " + logged)
    return logged;
}

const NavBar = () => {

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container fluid>
                <Navbar.Brand>
                    PwC AI Demo</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav 
                        className="me-auto my-2 my-lg-0 Header"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                        defaultActiveKey="/"
                    >
                        {isLoggedIn()?<LoggedInLinks/>:<LoggedOutLinks/>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar
