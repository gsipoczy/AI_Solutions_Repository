import C999CheckExpiry from './C999_CheckExpiry';
import C999ListModalItem from './C999_ListModalItem';

const C999ListModal = ({
    headerText,
    list,
    modalTitle,
    itemTitlePrefix,
    itemDescriptionPrefix,
    showOnClick,
    onClick,
    onClickButtonText,
    showOnDelete,
    onDelete,
    onDeleteButtonText
    }) => {

    return (
        <div>
            <C999CheckExpiry />
            <h1>{headerText}</h1>
            <br/>
            {
                list.map(
                    (item, index) => (
                        <>
                        <C999ListModalItem
                            key={index}
                            length = {list.length}
                            id = {item.id}
                            modalTitle = {modalTitle}
                            itemTitle = {item.title}
                            itemTitlePrefix = {itemTitlePrefix}
                            itemDescription = {item.description}
                            itemDescriptionPrefix = {itemDescriptionPrefix}
                            showOnClick={showOnClick}
                            onClick = {onClick}
                            onClickButtonText = {onClickButtonText}
                            showOnDelete={showOnDelete}
                            onDelete = {onDelete}
                            onDeleteButtonText = {onDeleteButtonText}
                        />
                        </>
                    )
                )
            }
        </div>
    )
}

export default C999ListModal;

