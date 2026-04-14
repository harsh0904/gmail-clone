import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { setEmails, setSentEmails } from "../redux/appSlice";

const API_URL = import.meta.env.VITE_API_URL;

const useGetAllEmails = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                // Fetch inbox (emails received by me)
                const inboxRes = await axios.get(`${API_URL}/api/v1/email/getallemails`, {
                    withCredentials: true
                });
                dispatch(setEmails(inboxRes.data.emails));

                // Fetch sent (emails I sent)
                const sentRes = await axios.get(`${API_URL}/api/v1/email/sentemails`, {
                    withCredentials: true
                });
                dispatch(setSentEmails(sentRes.data.emails));
            } catch (error) {
                console.log(error);
            }
        }
        fetchEmails();
    }, []);
};
export default useGetAllEmails;