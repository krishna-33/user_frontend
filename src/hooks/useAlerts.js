import { toast } from 'react-toastify'

const useAlerts = () => {
    const successMessage = (message = "") => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000
        });
    }
    const errorMessage = (message = "") => {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000
        });
    }
    return {
        success: successMessage,
        error: errorMessage
    }
}

export default useAlerts
