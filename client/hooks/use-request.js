import axios from 'axios';

import { useState } from 'react';


// So the doRequest is a closure function as it is returned from a main function !!
// Now the closure has access to the main function scoped variables.
// When we return a closure it will be returned with a backpack.
// The backPack will be having all the main function level scope varibales;
// In this case since we arent returning anything from the closure we are accessing
// The main function level errors useState by returning it.
// Whenver there is an error in the closure we are accessing the setErrors from the backPack (i.e main function level useState)
// then updating the errors state. Since this errors state is return by the function we have access to it where ever we
// have called the useRequestHook function!!

// A hook will be a function having a useState /  any other state management stuff !
// It will return a useState or something like that and can be used by any component that has imported it !!
const useRequestHook = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);
    const doRequest = async (props = {}) => {
        try {
            const response = await axios[method](url,
                { ...body, ...props }
            );
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err) {

            setErrors(<div className="alert alert-danger">
                <h4>Ooops....</h4>
                <ul className="my-0">
                    {err.response.data.errors.map((err) => <li key={err.message}>{err.message}</li>)}
                </ul>
            </div>);
        }
    };

    return { doRequest, errors };

}

export default useRequestHook;