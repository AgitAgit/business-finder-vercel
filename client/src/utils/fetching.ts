import axios from "axios";

export async function getBusinesses() {
  const response = await axios.get('http://localhost:3000/businesses');
  return response.data;
}

export async function getBusinessesWithFilters(_name?, _description?, _limit?, _offset?) {
  let queryString = '?';
  if(_name) queryString += `name=${_name}&`;
  if(_description) queryString += `description=${_description}&`;
  if(_limit) queryString += `limit=${_limit}&`;
  if(_offset) queryString += `offset=${_offset}`;

  const response = await axios.get(`http://localhost:3000/businesses${queryString}`);
  return response.data;
}