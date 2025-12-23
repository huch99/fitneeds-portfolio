import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link, useLocation } from 'react-router-dom';

const ScheduleListPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sportId = queryParams.get('sportId');

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchSchedulesBySportId = async () => {
            if (sportId) { // sportId가 유효한 경우에만 API 호출
                setLoading(true);
                try {
                    const response = await api.get(`/schedules/getSchedulesBySportIdForR/${sportId}`);
                    setSchedules(response.data);
                    console.log("API 호출 결과:", response.data);
                } catch (err) {
                    setError('스케줄 데이터를 불러오는 데 실패 했습니다.');
                    console.error('Error fetching schedule data:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setError('유효한 스포츠 ID가 전달되지 않았습니다.');
                console.warn('Sport ID is missing in query parameters, skipping API call.');
            }
        };

        fetchSchedulesBySportId();
    }, [sportId, location.search])

    return (
        <div>
            {location.state?.selectedType == "sport" ? (
                <p>종목별 예약 / {location.state?.selectedSport}</p>
            ):(
                <p>지점별 예약 / </p>
            )}

            <div>
                {loading ? (
                    <div>스케줄 데이터를 불러오는 중 입니다.</div>
                ) : (
                    error ? (
                        <div>{error}</div>
                    ) : (
                        schedules.map(schedule => (
                            <div key={schedule.schdId}>
                                <Link>
                                    <p>{schedule.userName}</p>
                                    <p>{schedule.progNm}</p>
                                    <p>{schedule.addr}</p>
                                    <p>{schedule.strtDt} ~ {schedule.endDt}</p>
                                    <p>{schedule.strtTm} ~ {schedule.endTm}</p>
                                </Link>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default ScheduleListPage;