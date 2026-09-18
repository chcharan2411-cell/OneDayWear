package com.onedaywear.admin.service;

import java.util.List;
import java.util.Map;

import com.onedaywear.admin.dto.DashboardResponse;

public interface AdminService {

    DashboardResponse getDashboard();

    List<Map<String, Object>> getAllUsers();
}