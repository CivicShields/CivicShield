import { useState, useEffect } from "react";
import { useDepart } from "../contexts/DepartContext";

function AllDeparts() {
    const { fetchDeparts } = useDepart();
    const [departs, setDeparts] = useState([]);

    useEffect(() => {
        fetchDeparts().then(setDeparts).catch(console.error);
    }, [fetchDeparts]);

    return departs
}

export default AllDeparts;