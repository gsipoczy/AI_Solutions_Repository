import Constants from '../../Constants';
import C000SignUp from './C000_SignUp';
import C000Home from './C000_Home';
import C000Logout from './C000_Logout';
import C000Login from './C000_Login';
import C000Delete from './C000_Delete';
import C000UpdateUser from './C000_UpdateUser';
import C000UpdatePassword from './C000_UpdatePassword';
import { Routes, Route } from 'react-router-dom';

const C000Routes = () => {

    return (
        <Routes>
            <Route exact path="/" element={<C000Login />} />
            <Route exact path="/main/signup" element={<C000SignUp />} />
            <Route exact path={Constants.URL_HOME} element={<C000Home />} />
            <Route exact path="/main/logout" element={<C000Logout />} />
            <Route exact path="/main/delete" element={<C000Delete />} />
            <Route exact path="/main/update_user" element={<C000UpdateUser />} />
            <Route exact path="/main/update_password" element={<C000UpdatePassword />} />
        </Routes>
    )

}

export default C000Routes;