import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { setEmails, setSentEmails, setStarredEmails, setSnoozedEmails, setDrafts } from "../redux/appSlice";

const API_URL = import.meta.env.VITE_API_URL;

const useGetAllEmails = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const [inboxRes, sentRes, starredRes, snoozedRes, draftsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/v1/email/getallemails`, { withCredentials: true }),
                    axios.get(`${API_URL}/api/v1/email/sentemails`, { withCredentials: true }),
                    axios.get(`${API_URL}/api/v1/email/starred`, { withCredentials: true }),
                    axios.get(`${API_URL}/api/v1/email/snoozed`, { withCredentials: true }),
                    axios.get(`${API_URL}/api/v1/email/drafts`, { withCredentials: true }),
                ]);

                dispatch(setEmails(inboxRes.data.emails || []));
                dispatch(setSentEmails(sentRes.data.emails || []));
                dispatch(setStarredEmails(starredRes.data.emails || []));
                dispatch(setSnoozedEmails(snoozedRes.data.emails || []));
                dispatch(setDrafts(draftsRes.data.drafts || []));
            } catch (error) {
                console.log(error);
            }
        }
        fetchEmails();
    }, []);
};

export default useGetAllEmails;