import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/configs`,{
    method:'GET',
  });
}


export async function edit(restParams) {
  return request(`/devices/${restParams.device_id}/configs`, {
    method: 'PATCH',
    data: {
      ...restParams,
    },
  });
}

