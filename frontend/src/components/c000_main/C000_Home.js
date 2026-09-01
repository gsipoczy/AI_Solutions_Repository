import Cookies from 'js-cookie';
import C999CheckExpiry from '../c999_reusables/C999_CheckExpiry';

const C000Home = () => {

    let currentUser = {}
    let curUser = Cookies.get("currentUser");
    if(curUser) {
        currentUser = JSON.parse(curUser);
        console.log(currentUser);
    }

    return (
        <div>
            <C999CheckExpiry />
            <h1> </h1>
        </div>
    )

}

export default C000Home;