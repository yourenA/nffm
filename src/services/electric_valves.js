import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/grouping_parameters`,{
    method:'GET',
    params:{
      types:['electric_valve']
    }
  });
}


export async function add({device_id,...payload}) {
  console.log('payload',payload)
  return request(`/devices/${device_id}/electric_valves`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}
export async function edit({device_id,parameter_id,...payload}) {
  console.log('payload',payload)
  return request(`/devices/${device_id}/electric_valves/${parameter_id}`, {
    method: 'PUT',
    data: {
      ...payload,
    },
  });
}
export async function remove({device_id,parameter_id}) {
  return request(`/devices/${device_id}/parameters/${parameter_id}`, {
    method: 'DELETE',
  });
}
