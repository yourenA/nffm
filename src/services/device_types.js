import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/device_types`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

