import axios from "axios"
import Config from "../Config"

const getMergePerWeek = async (login: string): Promise<number[]> => {
    try {
        const req = await axios.get(`${Config.api}/graphs/merges-per-week?login=${login}`);
        return (req.data);
    }
    catch (e) {
        return ([]);
    }

}

export default {
    getMergePerWeek,
}