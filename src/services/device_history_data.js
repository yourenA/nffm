import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/historical_data`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

