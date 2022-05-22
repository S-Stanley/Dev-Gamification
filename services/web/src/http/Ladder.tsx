import axios from "axios";
import Config from "../Config";
import ILadder from "../interfaces/ILadder";

const getLadder = async(repo_id: string, sortBy: string, filterDate: string): Promise<ILadder[]> => {
    try {
        const req = await axios.get(`${Config.api}/ladder?repo_id=${repo_id}&sorted_by=${sortBy}&month=${filterDate.split('/')[0]}&year=${filterDate.split('/')[1]}`);
        return (req.data);
    }
    catch {
        return ([]);
    }
}

const Ladder = {
    getLadder,
}

export default Ladder;