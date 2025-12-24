import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { Link, useLocation } from 'react-router-dom';
import './TypeSelect.css';

const TypeSelect = () => {
    const [sports, setSports] = useState([]);
    const [sportLoading, setSportLoading] = useState(true);
    const [sportError, setSportError] = useState(null);

    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [branchloading, setBranchLoading] = useState(true);
    const [branchError, setBranchError] = useState(null);

    const location = useLocation();

    // 종목 데이터 호출
    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await api.get('/sporttypes/getAllSportTypesForR');
                setSports(response.data);
            } catch (err) {
                setSportError('스포츠 종목 데이터를 불러오는 데 실패 했습니다.');
                console.error('Error fetching sport data:', err);
            } finally {
                setSportLoading(false);
            }
        }

        fetchSports();
    }, [])

    // 지점 데이터 호출
    useEffect(() => {
        const fetchBranchs = async () => {
            try {
                const response = await api.get('/branches/getAllBranchesForR');
                setBranches(response.data);
                setFilteredBranches(response.data.slice(0, 10)); // 가장 앞의 10개의 데이터만 저장
            } catch (err) {
                setBranchError('지점 데이터를 불러오는 데 실패 했습니다.');
                console.error('Error fetching branch data:', err);
            } finally {
                setBranchLoading(false);
            }
        }

        fetchBranchs();
    }, [])

    return (
        <div className='type-select-container'>
            <div className='type-section'>
                <p className='section-title'>지점별 예약</p>
                {branchloading ? (
                    <div>지점 데이터를 불러오는 중 입니다.</div>
                ) : (
                    branchError ? (
                        <div>{branchError}</div>
                    ) : (
                        branches === 0 ? (
                            <div>등록된 지점이 없습니다.</div>
                        ) : (
                            filteredBranches.map(branch => (
                                <div key={branch.brchId}>
                                    <Link
                                        className='sport-link'
                                        to={`/schedule-list?brchId=${branch.brchId}`}
                                        state={{
                                            selectedType: "branch",
                                            selectedBranch: `${branch.brchNm}`,
                                        }}
                                    >
                                        <p>{branch.brchNm}</p>
                                    </Link>
                                </div>
                            ))
                        )
                    )
                )}
                <p className='info-text more'>더보기</p>
            </div>

            <div className='type-section'>
                <p className='section-title'>종목별 예약</p>
                {sportLoading ? (<div>스포츠 종목 데이터를 불러오는 중 입니다.</div>) :
                    sportError ? (<div>{sportError}</div>) : (
                        sports === 0 ? (
                            <div>등록된 종목이 없습니다.</div>
                        ) : (
                            sports.map(sport => (
                                <div key={sport.sportId}>
                                    <Link
                                        className='sport-link'
                                        to={`/schedule-list?sportId=${sport.sportId}`}
                                        state={{
                                            selectedType: "sport",
                                            selectedSport: `${sport.sportNm}`,
                                        }}>
                                        <p>{sport.sportNm}</p>
                                    </Link>
                                </div>
                            ))
                        )

                    )
                }

            </div>
        </div>
    );
};

export default TypeSelect;