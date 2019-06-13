import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/parameters`,{
    method:'GET',
  });
}


export async function add({device_id,...payload}) {
  return request(`/devices/${device_id}/parameters`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

