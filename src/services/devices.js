import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function remove({id}) {
  return request(`/devices/${id}`, {
    method: 'DELETE',
  });
}

export async function resetPassword({id}) {
  console.log('id',id)
  return request(`/devices/${id}/password`, {
    method: 'PUT',
  });
}
export async function add(payload) {
  return request(`/devices`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/devices/${id}`, {
    method: 'PATCH',
    data: {
      ...restParams,
    },
  });
}

export async function editStatus({data:{id,status}}) {
  return request(`/users/${id}/status`, {
    method: 'PUT',
    data: {
      status,
    },
  });
}
