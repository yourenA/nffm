import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/double_ball_valves`,{
    method:'GET',
  });
}


export async function add({device_id,...payload}) {
  return request(`/devices/${device_id}/double_ball_valves`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}
export async function remove({device_id,valve_id}) {
  return request(`/devices/${device_id}/double_ball_valves/${valve_id}`, {
    method: 'DELETE',
  });
}
