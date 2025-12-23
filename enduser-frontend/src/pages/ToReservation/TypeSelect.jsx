import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link, useLocation } from 'react-router-dom';
import './TypeSelect.css';

const TypeSelect = () => {
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await api.get('/sporttypes/getAllSportTypesForR');
                setSports(response.data);
            } catch (err) {
                setError('스포츠 종목 데이터를 불러오는 데 실패 했습니다.');
                console.error('Error fetching sport data:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchSports();
    }, [])

    return (
        <div className='type-select-container'>
            <div className='type-section'>
                <p className='section-title'>지점별 예약</p>
                <p className='info-text'>지점을 선택해주세요.</p>
                <p className='info-text more'>더보기</p>
            </div>

            <div className='type-section'>
                <p className='section-title'>종목별 예약</p>
                {loading ? (<div>스포츠 종목 데이터를 불러오는 중 입니다.</div>) :
                    error ? (<div>{error}</div>) : (
                        sports.map(sport => (
                            <div key={sport.sportId}>
                                <Link
                                    className='sport-link'
                                    to={`/type-sport?sportId=${sport.sportId}`}
                                    state={{ 
                                        selectedType : "sport" ,
                                        selectedSport : `${sport.sportNm}`,
                                    }}>
                                    <p>{sport.sportNm}</p>
                                </Link>
                            </div>
                        ))
                    )
                }

            </div>
        </div>
    );
};

export default TypeSelect;