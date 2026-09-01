import React from 'react'
import { Button, Card ,Modal} from 'react-bootstrap';
import { useState } from 'react';
import './c999.css';


const C999ListModalItem=({
    length,
    id,
    modalTitle,
    itemTitle,
    itemTitlePrefix,
    itemDescription,
    itemDescriptionPrefix,
    showOnClick,
    onClick,
    onClickButtonText,
    showOnDelete,
    onDelete,
    onDeleteButtonText
    })=>{

    const [show, setShow] = useState(false);

    const closeModal = () => {
        setShow(false);
    }

    const showModal = () => {
        setShow(true);
    }

    return(
        <>
        <Modal
            show={show}
            size="lg"
            onHide={closeModal}
        >
            <Modal.Header closeButton>
                {modalTitle}
            </Modal.Header>
            <Modal.Body>
                <p>{itemTitlePrefix} {itemTitle}</p>
                <p>{itemDescriptionPrefix} <span className='c999_display_linebreak'>{itemDescription}</span></p>
            </Modal.Body>
        </Modal>
        
        {id >= length &&
            <Card className="c999_item">
                <Card.Body>
                    <Card.Title>{itemTitlePrefix} {itemTitle}</Card.Title>
                    <Card.Text>{itemDescriptionPrefix} <span className='c999_display_linebreak'>{itemDescription}</span></Card.Text>
                    {showOnClick && <Button variant='secondary dark' className="c999_button" onClick={onClick(id)}>{onClickButtonText}</Button>}
                    {showOnDelete && <Button variant='danger' className="c999_button" onClick={onDelete(id)}>{onDeleteButtonText}</Button>}
                </Card.Body>    
            </Card>
        }
        {id < length &&
            <Card className="c999_item">
                <Card.Body>
                    <Card.Title>{itemTitlePrefix} {
                            (itemTitle).length <= 80
                            ? itemTitle
                            : `${(itemTitle).slice(0, 80)}...`
                    }</Card.Title>
                    <Card.Text>{itemDescriptionPrefix} <span className='c999_display_linebreak'>{
                        (itemDescription).length <= 100
                        ? itemDescription
                        : `${(itemDescription).slice(0, 100)}...`
                    }</span></Card.Text>
                    <Button variant='secondary dark' className="c999_button" onClick={() => {showModal()}}>Show complete</Button>
                    {showOnClick && <Button variant='secondary dark' className="c999_button" onClick={onClick(id)}>{onClickButtonText}</Button>}
                    {showOnDelete && <Button variant='danger' className="c999_button" onClick={onDelete(id)}>{onDeleteButtonText}</Button>}
                </Card.Body>
            </Card>
        }
        </>
    )
}


export default C999ListModalItem;