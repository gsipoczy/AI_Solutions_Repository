import React, { useState } from 'react';
import './c999.css';
import { useForm } from 'react-hook-form'
import { Form, Button } from 'react-bootstrap'

const C999InputFiles=({
    headerText,
    isObligatory,
    obligatoryErrorText,
    buttonText,
    updateFunction,
})=>{

    const [files, setFiles] = useState([]);

    const { handleSubmit, reset } = useForm();

    const storeFiles = (e) => {
        setFiles(e.target.files)
    }

    const updateCaller = () => {
        reset();
        updateFunction(files);
    }

    return(
        <form>
            
            <Form.Group className="mb-3">
                <Form.Label>{headerText}</Form.Label>
                <Form.Control type="file" multiple 
                    onChange={(e) => storeFiles(e)}
                />
            </Form.Group>
            <div className='c999_button_div'>
                <Form.Group className="mb-3">
                    <Button as="sub" variant="secondary dark" className="c999_button" onClick={handleSubmit(updateCaller)}>
                        {buttonText}
                    </Button>
                </Form.Group>
            </div>
            <br />
        </form>
    )
}

export default C999InputFiles;