import axios from "axios";
import Config from "../Config";
import ILadder from "../interfaces/ILadder";

const getLadder = async(username: string): Promise<ILadder[]> => {
    try {
        const req = await axios.get(`${Config.api}/ladder?username=${username}`);
        return (req.data);
    }
    catch {
        return ([]);
    }
}

export default {
    getLadder,
}