import './c999.css';
import { useForm } from 'react-hook-form'
import { Form, Button } from 'react-bootstrap'

const C999InputText=({
    headerText,
    originalText,
    isObligatory,
    obligatoryErrorText,
    numberOfRows,
    buttonText,
    updateFunction,
    showOnClick,
    onClick,
    onClickButtonText
})=>{

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    setValue('text', originalText);

    const updateCaller = (data) => {
        updateFunction(data.text);
        reset();
    }

    return(
        <form>
            <Form.Group className="mb-3">
                <Form.Label>{headerText}</Form.Label>
                {isObligatory && 
                    <>
                        {errors.text?.type==="required" && <small className="c999_error"><br/>{obligatoryErrorText}</small>}
                        <Form.Control as="textarea" rows={numberOfRows}
                        {...register('text', { required: true, maxLength: 255 })}
                        />
                    </>
                }
                {!isObligatory && 
                    <>
                        <Form.Control as="textarea" rows={{numberOfRows}}
                        {...register('text')}
                        />
                    </>
                }

            </Form.Group>
            <div className='c999_button_div'>
                <Form.Group className="mb-3">
                    <Button as="sub" variant="secondary dark" className="c999_button" onClick={handleSubmit(updateCaller)}>
                        {buttonText}
                    </Button>
                </Form.Group>
                <Form.Group className="mb-3">
                    {showOnClick && <Button as="sub" variant='secondary dark' className="c999_button" onClick={onClick}>{onClickButtonText}</Button>}
                </Form.Group>
            </div>
            <br />
        </form>
    )
}

export default C999InputText;