import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/device_types/${resetParams.device_types_id}/views`,{
    method:'GET',
  });
}

export async function remove({id,...restParams}) {
  return request(`/device_types/${restParams.device_types_id}/views/${id}`, {
    method: 'DELETE',
  });
}

export async function add(payload) {
  return request(`/device_types/${payload.device_types_id}/views`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/device_types/${restParams.device_types_id}/views/${id}`, {
    method: 'PATCH',
    data: {
      ...restParams,
    },
  });
}

