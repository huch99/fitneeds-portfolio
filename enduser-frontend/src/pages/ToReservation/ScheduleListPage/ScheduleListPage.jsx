import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { Link, useLocation } from 'react-router-dom';
import './ScheduleListPage.css';

const ScheduleListPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sportId = queryParams.get('sportId');
    const brchId = queryParams.get('brchId');

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    

    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        const fetchSchedulesBySportId = async () => {
            setLoading(true);
            setError(null);

            let rawSchedules = [];

            if (sportId) { // sportId가 유효한 경우에만 API 호출
                try {
                    const response = await api.get(`/schedules/getSchedulesBySportIdForR/${sportId}`);
                    rawSchedules = response.data;
                } catch (err) {
                    setError('스케줄 데이터를 불러오는 데 실패 했습니다.');
                    console.error('Error fetching schedule data:', err);
                    setLoading(false); // 에러 발생 시 로딩 종료
                    return; // 에러 발생 시 이후 로직 실행 중단
                } finally {
                    setLoading(false);
                }
            } else if (brchId) { // brchId가 유효한 경우에 호출
                try {
                    const response = await api.get(`/schedules/getSchedulesByBrchIdForR/${brchId}`);
                    rawSchedules = response.data;
                } catch (err) {
                    setError('스케줄 데이터를 불러오는 데 실패 했습니다.');
                    console.error('Error fetching schedule data:', err);
                    setLoading(false); // 에러 발생 시 로딩 종료
                    return; // 에러 발생 시 이후 로직 실행 중단
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setError('유효한 ID가 전달되지 않았습니다.');
                console.warn('Sport ID is missing in query parameters, skipping API call.');
                return;
            }

            // 원본 스케줄 데이터 가공로직 ---
            const groupedSchedulesMap = new Map();

            rawSchedules.forEach(schedule => {
                const key = `${schedule.userId} - ${schedule.progId}`;

                if(!groupedSchedulesMap.has(key)) {
                    groupedSchedulesMap.set(key, {
                        schdId : schedule.schdId,
                        userName : schedule.userName,
                        progNm : schedule.progNm,
                        brchNm : schedule.brchNm,
                        strtTm: schedule.strtTm,
                        endTm: schedule.endTm,
                        groupedStrtDt: schedule.strtDt,
                        groupedEndDt: schedule.endDt,
                    });
                } else {
                    const existingGroup = groupedSchedulesMap.get(key);

                    if(schedule.strtDt < existingGroup.groupedStrtDt) {
                        existingGroup.groupedStrtDt = schedule.strtDt;
                    }
                    if(schedule.endDt < existingGroup.groupedEndDt) {
                        existingGroup.groupedEndDt = schedule.endDt;
                    }

                    groupedSchedulesMap.set(key, existingGroup);
                }
            });

            setSchedules(Array.from(groupedSchedulesMap.values()));
            setLoading(false);
        };

        fetchSchedulesBySportId();
    }, [sportId, brchId, location.search])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        // 검색어 변경 시 바로 useEffect가 필터링을 다시 실행함
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        // handleSearchChange에서 이미 searchTerm이 업데이트되었고,
        // 이로 인해 useEffect가 필터링을 수행하므로 별도의 필터링 로직은 필요 없음.
        // 여기서는 주로 폼 제출 시 검색 input에 포커스를 두거나 추가 작업을 할 때 사용.
        console.log("검색어 제출:", searchTerm);
    };

    return (
        <div  className='schedule-list-page-container'>

            <p className='schedule-header-info'>
                {location.state?.selectedType === "sport" ? (
                    `종목별 예약 / ${location.state?.selectedSport}`
                ) : (
                    `지점별 예약 / ${location.state?.selectedBranch}`
                )}
            </p>

             <form className="search-form" onSubmit={handleSearchSubmit}>
                <input 
                    type="search" 
                    placeholder="프로그램명 또는 강사명을 검색하세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    <span role="img" aria-label="search">🔍</span> {/* 돋보기 아이콘 */}
                </button>
            </form>


            <div className='schedules-list'>
                {loading ? (
                    <div className='loading-message'>스케줄 데이터를 불러오는 중 입니다.</div>
                ) : (
                    error ? (
                        <div className='error-message'>{error}</div>
                    ) : (
                        schedules.length > 0 ? ( // 스케줄 데이터가 있을 때만 맵핑
                            schedules.map(schedule => (
                                <div key={schedule.schdId}> {/* Link 컴포넌트에 직접 클래스를 적용하지 않고, Link를 감싸는 div를 만들어도 돼요 */}
                                    <Link to={`/`} className='schedule-item-link'>
                                        <p>{schedule.userName}</p>
                                        <p>{schedule.progNm}</p>
                                        <p>{schedule.brchNm}</p>
                                        <p>{schedule.groupedStrtDt} ~ {schedule.groupedEndDt}</p>
                                        <p>{schedule.strtTm} ~ {schedule.endTm}</p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className='no-data-message'>등록된 스케줄 데이터가 없습니다.</div>
                        )
                    )
                )}
            </div>
        </div>
    );
};

export default ScheduleListPage;