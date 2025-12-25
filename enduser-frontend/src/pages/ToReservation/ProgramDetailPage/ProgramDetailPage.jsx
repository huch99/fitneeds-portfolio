import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../api';

const ProgramDetailPage = () => {
    const location = useLocation();
    const progId = location.state?.progId;

    const [programDetails, setProgramDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgramDetails = async () => {
            try {
                const response = await api.get(`/programs/getProgramByProgIdForR/${progId}`);
                setProgramDetails(response.data);
            } catch (err) {
                setError('프로그램 데이터를 불러오는 중 오류가 발생했습니다.');
                console.error('Error fetching program data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgramDetails();
    }, [progId])

    return (
        <div>
            {loading ? (
                <div>프로그램 데이터를 불러오는 중입니다.</div>
            ) : (
                error ? (
                    <div>{error}</div>
                ) : (
                    <div>{programDetails.progNm}</div>
                )
            )}
        </div>
    );
};

export default ProgramDetailPage;