import axios from 'axios';
import Constants from '../Constants';

// We will start the JSON server on port 3500
export default axios.create({
    baseURL: Constants.URL_BACKEND_BASE
});