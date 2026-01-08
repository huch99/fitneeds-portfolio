import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, startOfMonth, endOfMonth, isSameMonth, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { scheduleApi, programApi, branchApi, teacherApi } from '../api'

function AdminSchedulePage() {
  const [branches, setBranches] = useState([])
  const [selectedBranchId, setSelectedBranchId] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [allPrograms, setAllPrograms] = useState([])
  const [programs, setPrograms] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month')
  const [showModal, setShowModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  const [formData, setFormData] = useState({
    progId: '',
    usrId: '',
    scheduleDate: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '10:00',
    maxCapacity: 10,
    sttsCd: 'OPEN',
    description: '',
    repeatType: 'none',
    selectedDays: []
  })
  const [dateMode, setDateMode] = useState('single')

  useEffect(() => {
    loadBranches()
  }, [])

  useEffect(() => {
    if (selectedBranchId && selectedBranch && branches.length > 0 && schedules.length === 0) {
      const timer = setTimeout(() => {
        loadDataForBranch(selectedBranch).catch(error => {
          console.error('Error reloading data in useEffect:', error)
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [selectedBranchId, selectedBranch, branches.length])

  const loadBranches = async () => {
    try {
      setLoading(true)
      const response = await branchApi.getAll()
      const rawList = Array.isArray(response) ? response : (response?.data || [])
      
      const branchesList = rawList
        .map(b => {
          const brchId = b.brchId ?? b.brch_id ?? b.branchId ?? b.branch_id
          const brchNm = b.brchNm ?? b.brch_nm ?? b.branchName ?? b.branch_name
          return brchId && brchNm ? { ...b, brchId, brchNm } : null
        })
        .filter(Boolean)

      const fallbackBranches = [
        { brchId: '001', brchNm: '수원본점' },
        { brchId: '002', brchNm: '강남점' },
      ]

      const finalBranches = branchesList.length > 0 ? branchesList : fallbackBranches
      setBranches(finalBranches)

      if (finalBranches.length > 0) {
        const savedBranchId = localStorage.getItem('selectedBranchId')
        let selectedBranchObj = null
        
        if (savedBranchId && savedBranchId !== 'ALL') {
          selectedBranchObj = finalBranches.find(b => String(b.brchId) === savedBranchId)
        }
        
        if (!selectedBranchObj && savedBranchId !== 'ALL') {
          const suwonBranch = finalBranches.find(b => b.brchNm === '수원본점' || b.brchId === '001')
          selectedBranchObj = suwonBranch || finalBranches[0]
        }
        
        if (savedBranchId === 'ALL') {
          setSelectedBranchId('ALL')
          setSelectedBranch(null)
          try {
            await loadDataForAllBranches()
          } catch (error) {
            console.error('Error loading initial data for all branches:', error)
          }
        } else if (selectedBranchObj) {
          setSelectedBranchId(String(selectedBranchObj.brchId))
          setSelectedBranch(selectedBranchObj)
          localStorage.setItem('selectedBranchId', String(selectedBranchObj.brchId))
          
          try {
            await loadDataForBranch(selectedBranchObj)
          } catch (error) {
            console.error('Error loading initial data:', error)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load branches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBranchChange = async (e) => {
    const branchId = e.target.value
    if (branchId === 'ALL') {
      setSelectedBranchId('ALL')
      setSelectedBranch(null)
      localStorage.setItem('selectedBranchId', 'ALL')
      setFormData(prev => ({ ...prev, progId: '' }))
      try {
        setLoading(true)
        await loadDataForAllBranches()
      } catch (error) {
        console.error('Error loading data for all branches:', error)
      } finally {
        setLoading(false)
      }
    } else {
      const selected = branches.find(b => String(b.brchId) === branchId)
      setSelectedBranchId(branchId)
      setSelectedBranch(selected)
      localStorage.setItem('selectedBranchId', branchId)
      setFormData(prev => ({ ...prev, progId: '' }))
      if (selected) {
        try {
          setLoading(true)
          await loadDataForBranch(selected)
        } catch (error) {
          console.error('Error loading data for branch:', error)
        } finally {
          setLoading(false)
        }
      }
    }
  }

  const loadDataForAllBranches = async () => {
    try {
      const [schedulesRes, programsRes, usersRes] = await Promise.all([
        scheduleApi.getAll().catch(() => []),
        programApi.getAll().catch(() => []),
        teacherApi.getAll().catch(() => [])
      ])
      
      const allPrograms = Array.isArray(programsRes) ? programsRes : (programsRes?.data || [])
      setAllPrograms(allPrograms)
      setPrograms(allPrograms)
      
      const allSchedules = Array.isArray(schedulesRes) ? schedulesRes : (schedulesRes?.data || [])
      setSchedules(allSchedules)
      
      const allTeachers = Array.isArray(usersRes) ? usersRes : (usersRes?.data || [])
      setUsers(allTeachers)
    } catch (error) {
      console.error('Error loading data for all branches:', error)
      throw error
    }
  }

  const loadDataForBranch = async (branch) => {
    if (!branch) return
    
    try {
      const [schedulesRes, programsRes, usersRes] = await Promise.all([
        scheduleApi.getAll().catch(() => []),
        programApi.getAll().catch(() => []),
        teacherApi.getAll().catch(() => [])
      ])
      
      const allPrograms = Array.isArray(programsRes) ? programsRes : (programsRes?.data || [])
      setAllPrograms(allPrograms)
      
      const branchName = branch.brchNm
      const filteredPrograms = allPrograms.filter(program => {
        const programName = program.progNm || program.programName || ''
        return programName.includes(branchName)
      })
      
      setPrograms(filteredPrograms)
      
      const allSchedules = Array.isArray(schedulesRes) ? schedulesRes : (schedulesRes?.data || [])
      const branchProgramIds = filteredPrograms
        .map(p => {
          const progId = p.progId || p.prog_id
          return progId ? Number(progId) : null
        })
        .filter(id => id !== null)
      
      const filteredSchedules = allSchedules.filter(schedule => {
        const scheduleProgId = schedule.progId || schedule.prog_id
        const scheduleProgIdNum = scheduleProgId ? Number(scheduleProgId) : null
        if (scheduleProgIdNum === null) return false
        return branchProgramIds.includes(scheduleProgIdNum)
      })
      
      setSchedules(filteredSchedules)
      
      const allTeachers = Array.isArray(usersRes) ? usersRes : (usersRes?.data || [])
      setUsers(allTeachers)
    } catch (error) {
      console.error('Error loading data for branch:', error)
      throw error
    }
  }

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else {
      setCurrentDate(subWeeks(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else {
      setCurrentDate(addWeeks(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const getKoreanHolidayName = (date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()
    
    const fixedHolidays = {
      '1-1': '신정',
      '3-1': '삼일절',
      '5-5': '어린이날',
      '6-6': '현충일',
      '8-15': '광복절',
      '10-3': '개천절',
      '10-9': '한글날',
      '12-25': '크리스마스'
    }
    
    const key = `${month}-${day}`
    if (fixedHolidays[key]) return fixedHolidays[key]
    
    const lunarHolidays = {
      2024: [
        { month: 2, day: 10, name: '설날' },
        { month: 2, day: 11, name: '설날' },
        { month: 2, day: 12, name: '설날' },
        { month: 5, day: 15, name: '부처님오신날' },
        { month: 9, day: 16, name: '추석' },
        { month: 9, day: 17, name: '추석' },
        { month: 9, day: 18, name: '추석' }
      ],
      2025: [
        { month: 1, day: 28, name: '설날' },
        { month: 1, day: 29, name: '설날' },
        { month: 1, day: 30, name: '설날' },
        { month: 5, day: 5, name: '부처님오신날' },
        { month: 10, day: 5, name: '추석' },
        { month: 10, day: 6, name: '추석' },
        { month: 10, day: 7, name: '추석' }
      ],
      2026: [
        { month: 2, day: 16, name: '설날' },
        { month: 2, day: 17, name: '설날' },
        { month: 2, day: 18, name: '설날' },
        { month: 5, day: 24, name: '부처님오신날' },
        { month: 9, day: 24, name: '추석' },
        { month: 9, day: 25, name: '추석' },
        { month: 9, day: 26, name: '추석' }
      ]
    }
    
    const yearHolidays = lunarHolidays[year] || []
    const holiday = yearHolidays.find(h => h.month === month && h.day === day)
    return holiday ? holiday.name : null
  }

  const isKoreanHoliday = (date) => getKoreanHolidayName(date) !== null

  const handleDateClick = (date) => {
    if (isKoreanHoliday(date)) {
      alert('명절 날짜에는 스케줄을 등록할 수 없습니다.')
      return
    }
    
    setSelectedDate(date)
    const dateStr = format(date, 'yyyy-MM-dd')
    setFormData({
      ...formData,
      scheduleDate: dateStr,
      startDate: dateStr,
      endDate: dateStr,
      repeatType: 'none',
      selectedDays: []
    })
    setDateMode('single')
    setShowModal(true)
    setEditingSchedule(null)
  }

  const handleScheduleClick = (schedule) => {
    setEditingSchedule(schedule)
    const dateStr = schedule.strtDt || schedule.scheduleDate || ''
    setFormData({
      progId: schedule.progId || '',
      usrId: schedule.usrId || '',
      scheduleDate: dateStr,
      startDate: dateStr,
      endDate: dateStr,
      startTime: (schedule.strtTm || schedule.startTime)?.substring(0, 5) || '09:00',
      endTime: (schedule.endTm || schedule.endTime)?.substring(0, 5) || '10:00',
      maxCapacity: schedule.maxNopCnt || schedule.maxCapacity || 10,
      sttsCd: schedule.sttsCd || 'OPEN',
      description: schedule.description || '',
      repeatType: 'none',
      selectedDays: []
    })
    setDateMode('single')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSchedule(null)
    setSelectedDate(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      if (name === 'day') {
        const dayValue = parseInt(value)
        setFormData(prev => {
          const selectedDays = prev.selectedDays || []
          const newSelectedDays = checked
            ? [...selectedDays, dayValue]
            : selectedDays.filter(d => d !== dayValue)
          return { ...prev, selectedDays: newSelectedDays }
        })
      }
    } else {
      setFormData(prev => {
        const updated = { ...prev, [name]: value }
        if (name === 'progId') {
          const program = programs.find(p => String(p.progId || p.programId) === String(value))
          if (program) {
            updated.maxCapacity = program.maxNopCnt || program.maxCapacity || 10
          }
        }
        return updated
      })
    }
  }

  const toggleDay = (dayIndex) => {
    setFormData(prev => {
      const selectedDays = prev.selectedDays || []
      const isSelected = selectedDays.includes(dayIndex)
      const newSelectedDays = isSelected
        ? selectedDays.filter(d => d !== dayIndex)
        : [...selectedDays, dayIndex].sort()
      return { ...prev, selectedDays: newSelectedDays }
    })
  }

  const getDatesForSelectedDays = (startDate, endDate, selectedDays) => {
    if (!selectedDays || selectedDays.length === 0) return []
    const dates = []
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()
      if (selectedDays.includes(dayOfWeek) && !isKoreanHoliday(currentDate)) {
        dates.push(new Date(currentDate))
      }
      currentDate = addDays(currentDate, 1)
    }
    return dates
  }

  const getNonHolidayDateRanges = (startDate, endDate) => {
    const ranges = []
    let currentRangeStart = null
    let checkDate = new Date(startDate)
    while (checkDate <= endDate) {
      if (!isKoreanHoliday(checkDate)) {
        if (currentRangeStart === null) currentRangeStart = new Date(checkDate)
      } else {
        if (currentRangeStart !== null) {
          const rangeEnd = new Date(checkDate)
          rangeEnd.setDate(rangeEnd.getDate() - 1)
          ranges.push({ start: new Date(currentRangeStart), end: new Date(rangeEnd) })
          currentRangeStart = null
        }
      }
      checkDate = addDays(checkDate, 1)
    }
    if (currentRangeStart !== null) ranges.push({ start: new Date(currentRangeStart), end: new Date(endDate) })
    return ranges
  }

  const handleSave = async () => {
    try {
      if (!formData.progId || !formData.usrId) {
        alert('프로그램과 강사를 선택해주세요.')
        return
      }
      if (selectedBranchId === 'ALL' && !editingSchedule) {
        alert('지점을 선택한 후 스케줄을 추가해주세요.')
        return
      }

      const branchIdStr = String(selectedBranchId)
      
      if (editingSchedule) {
        const startDate = new Date(formData.scheduleDate)
        const endDate = new Date(formData.scheduleDate)
        const dateRanges = getNonHolidayDateRanges(startDate, endDate)
        if (dateRanges.length === 0) {
          alert('선택한 기간에 예약 가능한 날짜가 없습니다.')
          return
        }
        
        await scheduleApi.delete(editingSchedule.schdId)
        const createPromises = dateRanges.map(async (range) => {
          const data = {
            brchId: branchIdStr,
            progId: Number(formData.progId),
            usrId: String(formData.usrId),
            strtDt: format(range.start, 'yyyy-MM-dd'),
            endDt: format(range.end, 'yyyy-MM-dd'),
            strtTm: String(formData.startTime).length === 5 ? `${formData.startTime}:00` : formData.startTime,
            endTm: String(formData.endTime).length === 5 ? `${formData.endTime}:00` : formData.endTime,
            maxNopCnt: Number(formData.maxCapacity),
            sttsCd: String(formData.sttsCd),
            description: formData.description || null
          }
          return await scheduleApi.create(data).catch(err => (err.response?.status === 409 ? null : Promise.reject(err)))
        })
        
        await Promise.all(createPromises)
        alert('수정되었습니다.')
        handleCloseModal()
        if (selectedBranchId === 'ALL') await loadDataForAllBranches()
        else if (selectedBranch) await loadDataForBranch(selectedBranch)
      } else {
        let datesToCreate = []
        if (dateMode === 'single') {
          const date = new Date(formData.scheduleDate)
          if (!isKoreanHoliday(date)) {
            datesToCreate.push(date)
          }
        } else {
          // range 모드 또는 weekly 모드 처리
          const start = new Date(formData.startDate)
          const end = new Date(formData.endDate)
          if (formData.repeatType === 'weekly') {
            datesToCreate = getDatesForSelectedDays(start, end, formData.selectedDays)
          } else {
            const dateRanges = getNonHolidayDateRanges(start, end)
            dateRanges.forEach(range => {
              let curr = new Date(range.start)
              while (curr <= range.end) {
                datesToCreate.push(new Date(curr))
                curr = addDays(curr, 1)
              }
            })
          }
        }

        if (datesToCreate.length === 0) {
          alert('등록 가능한 날짜가 없습니다.')
          return
        }

        const createPromises = datesToCreate.map(async (date) => {
          const data = {
            brchId: branchIdStr,
            progId: Number(formData.progId),
            usrId: String(formData.usrId),
            strtDt: format(date, 'yyyy-MM-dd'),
            endDt: format(date, 'yyyy-MM-dd'),
            strtTm: String(formData.startTime).length === 5 ? `${formData.startTime}:00` : formData.startTime,
            endTm: String(formData.endTime).length === 5 ? `${formData.endTime}:00` : formData.endTime,
            maxNopCnt: Number(formData.maxCapacity),
            sttsCd: String(formData.sttsCd),
            description: formData.description || null
          }
          return await scheduleApi.create(data).catch(err => (err.response?.status === 409 ? null : Promise.reject(err)))
        })

        const results = await Promise.all(createPromises)
        const successCount = results.filter(r => r !== null).length
        alert(`${successCount}개의 스케줄이 생성되었습니다.`)
        handleCloseModal()
        if (selectedBranchId === 'ALL') await loadDataForAllBranches()
        else if (selectedBranch) await loadDataForBranch(selectedBranch)
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('저장에 실패했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await scheduleApi.delete(editingSchedule.schdId)
      alert('삭제되었습니다.')
      handleCloseModal()
      if (selectedBranchId === 'ALL') await loadDataForAllBranches()
      else if (selectedBranch) await loadDataForBranch(selectedBranch)
    } catch (error) {
      console.error('Error deleting:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const getSchedulesForDate = (date) => {
    if (!schedules) return []
    const dateStr = format(date, 'yyyy-MM-dd')
    return schedules.filter(s => s.strtDt === dateStr)
  }

  const getStatusColor = (sttsCd) => {
    switch (sttsCd) {
      case 'OPEN': return '#28a745'
      case 'CLOSED': return '#dc3545'
      case 'UNAVAILABLE': return '#6c757d'
      default: return '#6c757d'
    }
  }

  const getStatusLabel = (sttsCd) => {
    switch (sttsCd) {
      case 'OPEN': return '예약가능'
      case 'CLOSED': return '마감'
      case 'UNAVAILABLE': return '예약불가'
      default: return sttsCd
    }
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    const days = []
    let day = calendarStart
    while (day <= calendarEnd) {
      days.push(new Date(day))
      day = addDays(day, 1)
    }

    const weekDays = ['일', '월', '화', '수', '목', '금', '토']

    return (
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {weekDays.map(d => <div key={d} style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: d === '일' ? '#dc3545' : d === '토' ? '#007bff' : '#333' }}>{d}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {days.map((d, idx) => {
            const daySchedules = getSchedulesForDate(d)
            const isHoliday = isKoreanHoliday(d)
            const isToday = isSameDay(d, new Date())
            const isCurrMonth = isSameMonth(d, currentDate)
            
            return (
              <div key={idx} onClick={() => handleDateClick(d)} style={{ 
                minHeight: '100px', padding: '8px', border: isToday ? '2px solid #007bff' : '1px solid #e0e0e0', 
                borderRadius: '8px', background: isHoliday ? '#ffe6e6' : (isCurrMonth ? '#fff' : '#f8f9fa'),
                cursor: isHoliday ? 'not-allowed' : 'pointer'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: isHoliday ? '#dc3545' : (isCurrMonth ? '#333' : '#999') }}>{format(d, 'd')}</span>
                  {isHoliday && <span style={{ fontSize: '10px', color: '#dc3545' }}>{getKoreanHolidayName(d)}</span>}
                </div>
                <div style={{ marginTop: '4px' }}>
                  {daySchedules.slice(0, 3).map(s => {
                    const prog = programs.find(p => p.progId === s.progId) || allPrograms.find(p => p.progId === s.progId)
                    return (
                      <div key={s.schdId} onClick={(e) => { e.stopPropagation(); handleScheduleClick(s) }} style={{ 
                        fontSize: '10px', background: getStatusColor(s.sttsCd), color: '#fff', padding: '2px 4px', borderRadius: '4px', marginBottom: '2px'
                      }}>
                        {s.strtTm?.substring(0, 5)} {prog?.progNm || '수업'}
                      </div>
                    )
                  })}
                  {daySchedules.length > 3 && <div style={{ fontSize: '10px', color: '#666' }}>+{daySchedules.length - 3}개 더보기</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    const weekDaysLabels = ['일', '월', '화', '수', '목', '금', '토']

    return (
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>
          {weekDays.map((d, idx) => {
            const daySchedules = getSchedulesForDate(d)
            const isHoliday = isKoreanHoliday(d)
            const isToday = isSameDay(d, new Date())
            
            return (
              <div key={idx} style={{ minHeight: '400px', border: isToday ? '2px solid #007bff' : '1px solid #e0e0e0', borderRadius: '8px', padding: '12px', background: isHoliday ? '#ffe6e6' : (isToday ? '#e3f2fd' : '#fff') }}>
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>{weekDaysLabels[idx]}</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{format(d, 'd')}</div>
                  {isHoliday && <div style={{ fontSize: '10px', color: '#dc3545' }}>{getKoreanHolidayName(d)}</div>}
                </div>
                <div>
                  {daySchedules.map(s => {
                    const prog = programs.find(p => p.progId === s.progId) || allPrograms.find(p => p.progId === s.progId)
                    return (
                      <div key={s.schdId} onClick={() => handleScheduleClick(s)} style={{ 
                        padding: '8px', background: getStatusColor(s.sttsCd), color: '#fff', borderRadius: '6px', marginBottom: '8px', cursor: 'pointer', fontSize: '12px'
                      }}>
                        <div style={{ fontWeight: 'bold' }}>{s.strtTm?.substring(0, 5)} - {s.endTm?.substring(0, 5)}</div>
                        <div>{prog?.progNm || '수업'}</div>
                      </div>
                    )
                  })}
                  {!isHoliday && <button onClick={() => handleDateClick(d)} style={{ width: '100%', padding: '8px', border: '1px dashed #ccc', borderRadius: '6px', background: 'transparent', color: '#666', cursor: 'pointer' }}>+ 추가</button>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>로딩 중...</div>

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>
            <span style={{ color: '#007bff', fontWeight: 'bold' }}>[{selectedBranchId === 'ALL' ? '전체 지점' : selectedBranch?.brchNm}]</span> 스케줄 관리
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>{format(currentDate, 'yyyy년 MM월', { locale: ko })}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={selectedBranchId || ''} onChange={handleBranchChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
            <option value="ALL">전체 지점</option>
            {branches.map(b => <option key={b.brchId} value={String(b.brchId)}>{b.brchNm}</option>)}
          </select>
          <button onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')} style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {viewMode === 'month' ? '주간 보기' : '월간 보기'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button onClick={handlePrev} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}>이전</button>
        <button onClick={handleToday} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}>오늘</button>
        <button onClick={handleNext} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}>다음</button>
      </div>

      {viewMode === 'month' ? renderMonthView() : renderWeekView()}

      {showModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.6)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000, 
          backdropFilter: 'blur(4px)' 
        }} onClick={handleCloseModal}>
          <div 
            className="content-box"
            style={{ 
              background: '#fff', 
              padding: '32px', 
              borderRadius: '12px', 
              width: '450px',
              maxWidth: '90%',
              maxHeight: '90vh', 
              overflowY: 'auto', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              animation: 'modalSlideIn 0.3s ease-out'
            }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '24px'
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#333'
              }}>
                {editingSchedule ? '스케줄 수정' : '스케줄 추가'}
              </h2>
              <button 
                onClick={handleCloseModal} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer', 
                  color: '#999',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>프로그램 <span style={{ color: '#f5576c' }}>*</span></label>
                <select 
                  name="progId" 
                  value={formData.progId} 
                  onChange={handleChange} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
                >
                  <option value="">선택하세요</option>
                  {programs.map(p => <option key={p.progId} value={p.progId}>{p.progNm || p.programName}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>강사 <span style={{ color: '#f5576c' }}>*</span></label>
                <select 
                  name="usrId" 
                  value={formData.usrId} 
                  onChange={handleChange} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
                >
                  <option value="">선택하세요</option>
                  {users.map(u => <option key={u.userId} value={u.userId}>{u.userName}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>시작 시간 <span style={{ color: '#f5576c' }}>*</span></label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>종료 시간 <span style={{ color: '#f5576c' }}>*</span></label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>최대 인원 <span style={{ color: '#f5576c' }}>*</span></label>
                  <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>상태 <span style={{ color: '#f5576c' }}>*</span></label>
                  <select 
                    name="sttsCd" 
                    value={formData.sttsCd} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="OPEN">예약가능</option>
                    <option value="CLOSED">마감</option>
                    <option value="UNAVAILABLE">예약불가</option>
                  </select>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontWeight: '500', color: '#333', fontSize: '14px' }}>날짜 <span style={{ color: '#f5576c' }}>*</span></label>
                  {!editingSchedule && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button type="button" onClick={() => setDateMode('single')} style={{ padding: '2px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid', borderColor: dateMode === 'single' ? '#007bff' : '#ddd', background: dateMode === 'single' ? '#007bff' : '#fff', color: dateMode === 'single' ? '#fff' : '#666', cursor: 'pointer' }}>단일</button>
                      <button type="button" onClick={() => setDateMode('range')} style={{ padding: '2px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid', borderColor: dateMode === 'range' ? '#007bff' : '#ddd', background: dateMode === 'range' ? '#007bff' : '#fff', color: dateMode === 'range' ? '#fff' : '#666', cursor: 'pointer' }}>기간</button>
                    </div>
                  )}
                </div>
                
                {dateMode === 'single' || editingSchedule ? (
                  <input type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      <span style={{ color: '#999' }}>~</span>
                      <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #eee' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666', cursor: 'pointer', marginBottom: formData.repeatType === 'weekly' ? '8px' : 0 }}>
                        <input type="checkbox" checked={formData.repeatType === 'weekly'} onChange={(e) => setFormData(prev => ({ ...prev, repeatType: e.target.checked ? 'weekly' : 'none' }))} />
                        매주 반복
                      </label>
                      {formData.repeatType === 'weekly' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => {
                            const isSelected = formData.selectedDays?.includes(idx)
                            return (
                              <button key={idx} type="button" onClick={() => toggleDay(idx)} style={{ flex: 1, padding: '6px 0', borderRadius: '4px', border: '1px solid', borderColor: isSelected ? '#007bff' : '#ddd', background: isSelected ? '#eef2ff' : '#fff', color: isSelected ? '#007bff' : '#666', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>{day}</button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>설명</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="2" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', resize: 'none', outline: 'none', boxSizing: 'border-box' }} 
                  placeholder="추가 설명 (선택사항)"
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                {editingSchedule && (
                  <button onClick={handleDelete} style={{ padding: '10px 20px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>삭제</button>
                )}
                <button onClick={handleCloseModal} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>취소</button>
                <button 
                  onClick={handleSave} 
                  style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .content-box::-webkit-scrollbar {
          width: 8px;
        }
        .content-box::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .content-box::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .content-box::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }
      `}</style>
    </div>
  )
}

export default AdminSchedulePage
