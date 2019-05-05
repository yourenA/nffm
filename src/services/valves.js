import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/valves`,{
    method:'GET',
  });
}


export async function edit(payload) {
  return request(`/devices/${payload.device_id}/valves`, {
    method: 'PUT',
    data: {
      ...payload,
    },
  });
}

