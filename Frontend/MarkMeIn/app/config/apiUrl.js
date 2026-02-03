const BASE_URL = "https://ibs-server-82kd.onrender.com/markMeIn"; 
// OR for local
// const BASE_URL = "http://192.168.29.129:3030/markMeIn";

export const API_URLS = {
  // Auth
  LOGIN: `${BASE_URL}/auth/login`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  PLAN :  `${BASE_URL}/plans`,
  // Municipality
  ADD_MUNICIPALITY: `${BASE_URL}/municipality/add`,
  GET_MUNICIPALITIES: `${BASE_URL}/municipality/getMyMunicipality`,

  // Employee
  EMPLOYEE_LOGIN: `${BASE_URL}/loginEmployee`,
  EMPLOYEE_REGISTER: `${BASE_URL}/employee/register`,

  // Attendance
  PUNCH_IN: `${BASE_URL}/attendance/punch-in`,
  PUNCH_OUT: `${BASE_URL}/attendance/punch-out`,
  MONTHLY : `${BASE_URL}/attendance/monthlyAttendance`,
  TODAY_ATTENDANCE :`${BASE_URL}/attendance/today`,
  REMOTEATTENDANCE:`${BASE_URL}/attendance/remote-stats`,
  // subscription
  SUBSCRIPTION : `${BASE_URL}/subscription`
};

export default API_URLS;