import { jwtDecode } from 'jwt-decode';

const decodeToken = (token) => {
    try {
       return jwtDecode(token)
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

export default decodeToken;
