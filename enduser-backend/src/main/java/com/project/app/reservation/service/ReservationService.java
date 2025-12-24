package com.project.app.reservation.service;

import java.util.List;
import java.util.Map;

public interface ReservationService {
	List<Map<String, Object>> getMyReservations(String userId);
}
