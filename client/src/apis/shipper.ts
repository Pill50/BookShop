import { apiCaller } from '~/configs/apiCaller'

const getAllShippers = async () => {
    const path = '/shipper'
    const response = await apiCaller('GET', path)
    return response
}

export { getAllShippers }
