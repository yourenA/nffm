import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/errors`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}


